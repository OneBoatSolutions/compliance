import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type {
  GenerateRemediationInput,
  RemediationPriority,
  RemediationResponse,
  SuggestionSource,
} from "@/types/ai";
import crypto from "crypto";
import { getCache, setCache } from "@/lib/cache";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

interface OrgProfile {
  name: string;
  description: string;
  services: string;
  customers: string;
  problem: string;
  dataHandled: string[];
  regions: string[];
}

interface AIFrameworkSuggestion {
  code: string;
  name: string;
  confidence: number;
  explanation: string;
  tags: string[];
  source: SuggestionSource;
}

export interface FrameworkSuggestion extends AIFrameworkSuggestion {
  frameworkId: string;
  controls: number;
}

interface FrameworkCatalogEntry {
  id: string;
  code: string;
  name: string;
  controls: number;
}

interface FrameworkCatalogSelectRow {
  id: string;
  code: string;
  name: string;
  _count: {
    controls: number;
  };
}

const frameworkCatalogCacheTtl = 5 * 60 * 1000; // 5 minutes
const remediationTimeoutMs = 10_000;
const remediationMaxRetries = 3;
const aiCacheTtlSeconds = 24 * 60 * 60;
const remediationPromptVersion = 3;
let cacheKeySalt = "";

const remediationResponseSchema = z.object({
  steps: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
        owner: z.string().trim().min(1),
        estimatedHours: z.coerce.number().int().min(1).max(1000),
      }),
    )
    .min(3)
    .max(5),
  policies: z.array(z.string().trim().min(1)).min(2).max(3),
  technicalControls: z.array(z.string().trim().min(1)).min(2).max(3),
  // Optional enriched response fields
  businessFit: z
    .object({
      applicability: z.enum(["APPLICABLE", "PARTIALLY_APPLICABLE", "NOT_APPLICABLE"]),
      rationale: z.string().trim().min(1),
    })
    .optional(),
  evidenceValidation: z
    .object({
      overallHealth: z.enum(["SUFFICIENT", "PARTIALLY_SUFFICIENT", "INSUFFICIENT", "MISSING"]),
      missingTypes: z.array(z.string()),
      recommendations: z.array(z.string()).max(3),
    })
    .optional(),
  confidence: z.number().min(0).max(100).optional(),
});

function normalizeApplicability(
  value: unknown,
): RemediationResponse["businessFit"] extends infer T
  ? T extends { applicability: infer A }
    ? A
    : never
  : never {
  if (typeof value !== "string") {
    return "PARTIALLY_APPLICABLE" as never;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.includes("not applicable") || normalized.includes("not_applicable")) {
    return "NOT_APPLICABLE" as never;
  }

  if (normalized.includes("required") && normalized.includes("clearly")) {
    return "APPLICABLE" as never;
  }

  if (normalized.includes("likely") || normalized.includes("potential")) {
    return "PARTIALLY_APPLICABLE" as never;
  }

  if (normalized.includes("applicable")) {
    return "APPLICABLE" as never;
  }

  return "PARTIALLY_APPLICABLE" as never;
}

function normalizeOverallHealth(
  value: unknown,
): RemediationResponse["evidenceValidation"] extends infer T
  ? T extends { overallHealth: infer H }
    ? H
    : never
  : never {
  if (typeof value !== "string") {
    return "PARTIALLY_SUFFICIENT" as never;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.includes("missing")) {
    return "MISSING" as never;
  }

  if (normalized.includes("insufficient")) {
    return "INSUFFICIENT" as never;
  }

  if (normalized.includes("partial")) {
    return "PARTIALLY_SUFFICIENT" as never;
  }

  if (normalized.includes("sufficient")) {
    return "SUFFICIENT" as never;
  }

  return "PARTIALLY_SUFFICIENT" as never;
}

function normalizeRemediationResponse(parsed: unknown): unknown {
  if (!parsed || typeof parsed !== "object") {
    return parsed;
  }

  const candidate = parsed as Record<string, unknown>;

  if ("policySuggestions" in candidate && !("policies" in candidate)) {
    candidate.policies = candidate.policySuggestions;
  }

  const businessFit = candidate.businessFit;
  if (businessFit && typeof businessFit === "object") {
    const businessFitCandidate = businessFit as Record<string, unknown>;
    businessFitCandidate.applicability = normalizeApplicability(businessFitCandidate.applicability);
    candidate.businessFit = businessFitCandidate;
  }

  const evidenceValidation = candidate.evidenceValidation;
  if (evidenceValidation && typeof evidenceValidation === "object") {
    const evidenceCandidate = evidenceValidation as Record<string, unknown>;
    evidenceCandidate.overallHealth = normalizeOverallHealth(evidenceCandidate.overallHealth);
    candidate.evidenceValidation = evidenceCandidate;
  }

  if (typeof candidate.confidence === "string") {
    const parsedConfidence = Number(candidate.confidence);
    if (!Number.isNaN(parsedConfidence)) {
      candidate.confidence = parsedConfidence;
    }
  }

  return candidate;
}

let frameworkCatalogCache: { data: FrameworkCatalogEntry[]; expiry: number } = {
  data: [],
  expiry: 0,
};

function normalizeLookupValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function dedupeSuggestions(suggestions: FrameworkSuggestion[]): FrameworkSuggestion[] {
  const byFrameworkId = new Map<string, FrameworkSuggestion>();

  for (const suggestion of suggestions) {
    const existing = byFrameworkId.get(suggestion.frameworkId);
    if (!existing || suggestion.confidence > existing.confidence) {
      byFrameworkId.set(suggestion.frameworkId, suggestion);
    }
  }

  return [...byFrameworkId.values()].sort((a, b) => b.confidence - a.confidence).slice(0, 8);
}

async function getFrameworkCatalog(): Promise<FrameworkCatalogEntry[]> {
  const now = Date.now();
  if (frameworkCatalogCache.expiry > now && frameworkCatalogCache.data.length > 0) {
    return frameworkCatalogCache.data;
  }

  const frameworks = await prisma.framework.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      id: true,
      code: true,
      name: true,
      _count: {
        select: {
          controls: true,
        },
      },
    },
  });

  const catalog = frameworks.map((framework: FrameworkCatalogSelectRow) => ({
    id: framework.id,
    code: framework.code,
    name: framework.name,
    controls: framework._count.controls,
  }));

  frameworkCatalogCache = {
    data: catalog,
    expiry: now + frameworkCatalogCacheTtl,
  };

  return catalog;
}

async function enrichFrameworkSuggestions(
  suggestions: AIFrameworkSuggestion[],
): Promise<FrameworkSuggestion[]> {
  if (suggestions.length === 0) {
    return [];
  }

  const frameworkCatalog = await getFrameworkCatalog();
  const byCode = new Map<string, FrameworkCatalogEntry>();
  const byName = new Map<string, FrameworkCatalogEntry>();

  for (const framework of frameworkCatalog) {
    byCode.set(normalizeLookupValue(framework.code), framework);
    byName.set(normalizeLookupValue(framework.name), framework);
  }

  const mapped = suggestions
    .map((suggestion) => {
      const matchByCode = byCode.get(normalizeLookupValue(suggestion.code));
      const match = matchByCode ?? byName.get(normalizeLookupValue(suggestion.name));

      if (!match) {
        return null;
      }

      return {
        ...suggestion,
        code: match.code,
        name: match.name,
        frameworkId: match.id,
        controls: match.controls,
      };
    })
    .filter((suggestion): suggestion is FrameworkSuggestion => suggestion !== null);

  return dedupeSuggestions(mapped);
}

// ── Keyword-based heuristic fallback ──────────────────────────────────────────
// Used when AI mapping fails (timeout, parse error, etc.).
// Scores frameworks based on keyword matches against the org profile.
// Confidence is capped at 55 to distinguish from AI-generated results.

interface HeuristicRule {
  keywords: string[];
  matchCode: string;
  boost: number;
  explanation: string;
  tags: string[];
}

const heuristicRules: HeuristicRule[] = [
  {
    keywords: ["pii", "personal data", "personal information", "data subject", "data protection"],
    matchCode: "GDPR",
    boost: 30,
    explanation:
      "Your organization handles personal data, which may fall under data protection regulations like GDPR if you operate in or serve users in the EU.",
    tags: ["privacy", "pii", "eu"],
  },
  {
    keywords: ["eu", "europe", "european", "european union", "eea"],
    matchCode: "GDPR",
    boost: 25,
    explanation:
      "Your organization operates in or serves users in the EU/EEA region, where GDPR is the primary data protection regulation.",
    tags: ["privacy", "pii", "eu"],
  },
  {
    keywords: [
      "health",
      "phi",
      "healthcare",
      "medical",
      "patient",
      "hipaa",
      "ehr",
      "electronic health record",
      "protected health information",
    ],
    matchCode: "HIPAA",
    boost: 30,
    explanation:
      "Your organization handles health-related data, which may be subject to HIPAA if you operate in the US healthcare ecosystem.",
    tags: ["healthcare", "phi", "security"],
  },
  {
    keywords: [
      "payment",
      "cardholder",
      "pci",
      "credit card",
      "debit card",
      "card payment",
      "pci-dss",
      "merchant",
      "transaction processing",
    ],
    matchCode: "PCI-DSS",
    boost: 30,
    explanation:
      "Your organization stores, processes, or transmits cardholder data, which is subject to PCI-DSS compliance requirements.",
    tags: ["payments", "finance", "security"],
  },
  {
    keywords: [
      "finance",
      "financial",
      "banking",
      "bank",
      "fintech",
      "investment",
      "securities",
      "money",
      "lending",
    ],
    matchCode: "SOC2",
    boost: 20,
    explanation:
      "Financial services organizations commonly adopt SOC 2 to demonstrate security, availability, and confidentiality controls to customers and auditors.",
    tags: ["security", "audit", "trust"],
  },
  {
    keywords: ["soc2", "soc 2", "soc ii", "service organization", "trust services", "type ii"],
    matchCode: "SOC2",
    boost: 25,
    explanation:
      "Your organization's profile aligns with SOC 2, which is widely adopted by service organizations handling customer data.",
    tags: ["security", "audit", "trust"],
  },
  {
    keywords: [
      "iso 27001",
      "iso27001",
      "information security",
      "isms",
      "information security management",
    ],
    matchCode: "ISO27001",
    boost: 25,
    explanation:
      "Your organization's focus on information security aligns with ISO 27001, the international standard for information security management systems.",
    tags: ["security", "management", "standard"],
  },
  {
    keywords: ["cloud", "saas", "infrastructure", "aws", "azure", "gcp", "hosting", "data center"],
    matchCode: "CSA-STAR",
    boost: 20,
    explanation:
      "Cloud service providers and SaaS organizations commonly adopt CSA STAR to demonstrate cloud security posture.",
    tags: ["cloud", "security", "saas"],
  },
  {
    keywords: [
      "government",
      "public sector",
      "fedramp",
      "state",
      "federal",
      "agency",
      "gxp",
      "21 cfr",
    ],
    matchCode: "FedRAMP",
    boost: 25,
    explanation:
      "Your organization serves government or public sector customers, which may require FedRAMP authorization.",
    tags: ["government", "security", "us"],
  },
  {
    keywords: ["us", "united states", "usa", "america", "north america"],
    matchCode: "NIST",
    boost: 15,
    explanation:
      "US-based organizations commonly adopt the NIST Cybersecurity Framework as a baseline for security controls.",
    tags: ["security", "framework", "us"],
  },
  {
    keywords: ["australia", "australian", "au", "anz", "new zealand"],
    matchCode: "IRAP",
    boost: 20,
    explanation:
      "Your organization operates in Australia/New Zealand, where IRAP is the standard for government and critical infrastructure security assessments.",
    tags: ["government", "security", "anz"],
  },
  {
    keywords: ["japan", "japanese", "jp", "asia pacific"],
    matchCode: "CCSL",
    boost: 15,
    explanation:
      "Your organization operates in Japan or Asia Pacific, where CCSL (Cloud Compliance Security Label) may be relevant.",
    tags: ["cloud", "security", "japan"],
  },
  {
    keywords: ["singapore", "singaporean", "sg", "southeast asia"],
    matchCode: "MTCS",
    boost: 20,
    explanation:
      "Your organization operates in Singapore or Southeast Asia, where MTCS (Multi-Tier Cloud Security) may be applicable.",
    tags: ["cloud", "security", "singapore"],
  },
  {
    keywords: ["china", "chinese", "cn", "prc", "beijing", "shanghai"],
    matchCode: "MLPS",
    boost: 20,
    explanation:
      "Your organization operates in China, where MLPS (Multi-Level Protection Scheme) is the mandatory cybersecurity standard.",
    tags: ["security", "china", "regulation"],
  },
  {
    keywords: ["india", "indian", "in", "bharat"],
    matchCode: "ISMS",
    boost: 15,
    explanation:
      "Your organization operates in India, where ISMS standards and the upcoming Digital Personal Data Protection Act may apply.",
    tags: ["security", "india", "privacy"],
  },
  {
    keywords: ["canada", "canadian", "ca", "north"],
    matchCode: "PIPEDA",
    boost: 20,
    explanation:
      "Your organization operates in Canada, where PIPEDA governs how private sector organizations collect, use, and disclose personal information.",
    tags: ["privacy", "canada", "pii"],
  },
  {
    keywords: ["brazil", "brazilian", "br", "south america", "latin america"],
    matchCode: "LGPD",
    boost: 20,
    explanation:
      "Your organization operates in Brazil or Latin America, where LGPD is the primary data protection regulation.",
    tags: ["privacy", "brazil", "pii"],
  },
  {
    keywords: ["children", "kids", "minor", "under 13", "child", "coppa", "student", "education"],
    matchCode: "COPPA",
    boost: 25,
    explanation:
      "Your organization may collect data from children, which is subject to COPPA (Children's Online Privacy Protection Act) in the US.",
    tags: ["privacy", "children", "us"],
  },
  {
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "llm",
      "model",
      "algorithm",
    ],
    matchCode: "EU-AI-Act",
    boost: 20,
    explanation:
      "Your organization develops or uses AI systems, which may be subject to the EU AI Act or emerging AI governance frameworks.",
    tags: ["ai", "regulation", "eu"],
  },
];

function getHeuristicSuggestions(org: OrgProfile): AIFrameworkSuggestion[] {
  const scores = new Map<string, { boost: number; explanations: string[]; tags: Set<string> }>();

  const fieldsToScan = [
    org.name,
    org.description,
    org.services,
    org.customers,
    org.problem,
    ...org.dataHandled,
    ...org.regions,
  ];

  const normalizedFields = fieldsToScan.map((f) => f.toLowerCase());

  for (const rule of heuristicRules) {
    let matched = false;
    for (const field of normalizedFields) {
      for (const keyword of rule.keywords) {
        if (field.includes(keyword)) {
          matched = true;
          break;
        }
      }
      if (matched) {
        break;
      }
    }

    if (matched) {
      const existing = scores.get(rule.matchCode);
      if (existing) {
        existing.boost += rule.boost;
        existing.explanations.push(rule.explanation);
        for (const tag of rule.tags) {
          existing.tags.add(tag);
        }
      } else {
        scores.set(rule.matchCode, {
          boost: rule.boost,
          explanations: [rule.explanation],
          tags: new Set(rule.tags),
        });
      }
    }
  }

  if (scores.size === 0) {
    return [];
  }

  const maxConfidence = 55;
  const maxPossibleBoost = Math.max(...Array.from(scores.values()).map((s) => s.boost), 1);
  const suggestions: AIFrameworkSuggestion[] = Array.from(scores.entries()).map(([code, data]) => {
    // Normalize confidence: scale boost relative to max possible, capped at maxConfidence
    const rawConfidence = Math.round((data.boost / maxPossibleBoost) * maxConfidence);
    const confidence = Math.min(maxConfidence, Math.max(10, rawConfidence));

    return {
      code,
      name: code, // Will be enriched with real name
      confidence,
      explanation: data.explanations[0],
      tags: Array.from(data.tags),
      source: "heuristic" as SuggestionSource,
    };
  });

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
}

function buildPrompt(org: OrgProfile): string {
  return `
You are a compliance expert.

Analyze the organization and suggest applicable compliance frameworks.

Return ONLY valid JSON in this format:

{
  "frameworks": [
    {
      "code": "GDPR",
      "name": "General Data Protection Regulation",
      "confidence": 95,
      "explanation": "2-3 sentence explanation",
      "tags": ["privacy", "eu", "pii"]
    }
  ]
}

Rules:
- Max 8 frameworks
- Sort by confidence (highest first)
- Confidence must be 0–100
- Explanation must be clear and specific to the org

IMPORTANT:
Return ONLY JSON. No extra text.

Organization:
Product: ${org.name}
Description: ${org.description}
Services: ${org.services}
Customers: ${org.customers}
Problem: ${org.problem}
Data Types: ${org.dataHandled.join(", ")}
Regions: ${org.regions.join(", ")}
`;
}

class RemediationParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RemediationParseError";
  }
}

function buildRemediationPrompt(input: GenerateRemediationInput): string {
  const hasNotes = input.userNotes && input.userNotes.trim().length > 0;
  const hasEvidence = input.uploadedEvidenceFiles && input.uploadedEvidenceFiles.length > 0;
  const hasProductDesc = input.productDescription && input.productDescription.trim().length > 0;
  const hasAudience = input.targetAudience && input.targetAudience.trim().length > 0;

  return `
You are a compliance auditor. Generate a remediation assessment that reasons from the available evidence and business context, not a legal authority or generic checklist.

Return valid JSON only. Keep the existing response structure, but make the reasoning in each section auditor-like and specific.

The response must clearly cover these sections:
1. Business Model Fit Analysis
2. Remediation Action Plan
3. Evidence Validation Summary

Framework: ${input.frameworkName}
Control: ${input.controlId} - ${input.controlTitle}
Description: ${input.controlDescription}
Current Status: ${input.currentStatus}
Severity: ${input.severity}
${hasProductDesc ? `\nProduct Description: ${input.productDescription}` : ""}
${hasAudience ? `\nTarget Audience: ${input.targetAudience}` : ""}
${hasNotes ? `\nUser Notes / Gap Details: ${input.userNotes}` : ""}
${hasEvidence ? `\nUploaded Evidence Files: ${input.uploadedEvidenceFiles?.join(", ")}` : "\nUploaded Evidence Files: None"}

Requirements:
- Return ONLY valid JSON (no extra text)
- Provide 3-5 actionable steps
- Include priority (HIGH, MEDIUM, LOW)
- Assign realistic owner roles
- Include estimated hours
- Suggest 2-3 policies
- Suggest 2-3 technical controls
- Prioritize based on severity
- Prefer real-world tools where relevant
- Keep the response concise, specific, and context-aware
- Do not add generic compliance advice or recommendations for unrelated controls
- If required information is missing, state the uncertainty instead of assuming
- If confidence is lower because context is incomplete, briefly name the missing inputs in the relevant explanation text

Business context usage:
- Use the product description and target audience to judge whether this control is Likely applicable or Potentially applicable when the available information is incomplete.
- Explain why the control applies, may apply, or may not apply to this organization based on the provided product, audience, and scope.
- Do not state that a control "must" apply unless the available information clearly supports that conclusion.
- If company size, processing scale, jurisdiction, or regulatory scope is not provided, say that the applicability is context-dependent and name the missing information.
- Refer to the product by its name where natural. Do not repeat the entire product description in every step.
- Keep all business reasoning inside the businessFit section only.

Compliance status:
- COMPLIANT → recommend monitoring, maintenance, and periodic review only. Do not suggest work that is already complete.
- PARTIALLY_COMPLIANT → focus exclusively on the remaining gaps.
- NOT_COMPLIANT → generate implementation steps to achieve full compliance.
- Every remediation action must be directly related to the current control and its documented gap, not a broad security program recommendation.

User notes:
- If user notes describe specific gaps or implementation details, address them directly instead of generating generic recommendations.
- If user notes are missing, do not invent them and do not pretend they were reviewed.

Uploaded evidence:
- If evidence metadata is provided, treat it as metadata only.
- Do not claim to inspect file contents unless extracted text is explicitly provided.
- Base evidence validation on the provided metadata only.
- If evidence exists, validate only whether the metadata suggests the right kind of evidence is present and identify gaps that remain visible from metadata alone.
- If no evidence exists, state that compliance cannot be verified and specify what evidence should be uploaded.

Remediation steps:
- Each step must represent one clear action. Do not merge multiple actions into one step.
- Do not repeat information from previous steps.
- Explain what should be done, not why the regulation exists.
- Keep each step to 1–3 sentences.
- Be concrete. Avoid phrases like "follow industry best practices," "ensure compliance," or "implement appropriate controls." Instead, describe specific actions tied to this control.

Business fit:
- Determine applicability honestly: APPLICABLE, PARTIALLY_APPLICABLE, or NOT_APPLICABLE.
- Do not assume every control is mandatory.
- In the rationale, state whether the control is Likely applicable or Potentially applicable, then explain why.
- If context is incomplete, explicitly call out the missing information instead of filling in gaps.

Structure guidance:
- businessFit.rationale should answer the Business Model Fit Analysis.
- steps should form the Remediation Action Plan.
- evidenceValidation should form the Evidence Validation Summary.
- The businessFit section should explain why the control applies or may apply to the organization.
- The evidenceValidation section should only evaluate the evidence actually provided.
- For GDPR-related controls, do not assume legal obligations solely because the product processes financial or personal data.
- If GDPR scope is unclear, explicitly call out what is missing, such as organization size, processing scale, regulatory jurisdiction, or whether the processing is large-scale.

Confidence:
- Return a score from 0 to 100 reflecting how complete the available information is.
- Lower the score when business information, user notes, or evidence is missing, or when applicability is uncertain.
- Raise the score only when sufficient context is available to make a confident assessment.
- If the confidence score is not high, briefly explain in the rationale text what missing information prevents a higher score.

Confidence guidance:
- If company size, processing scale, jurisdiction, or regulatory scope is missing, reduce confidence and say which inputs are missing.
- If evidence is only metadata, note that verification is limited to the provided metadata.

Remediation sequencing:
- When applicability is uncertain, make the first remediation action "Assess whether this control is legally required for the organization" before recommending implementation.
- Only recommend mandatory implementation if the available information supports that conclusion.
- Use "may", "likely", or "depending on..." instead of absolute statements when the conclusion is not fully supported.

General tone:
- Write like an experienced compliance consultant giving specific, actionable advice.
- Use the provided business information rather than generic examples.
- Do not invent company details, products, regulations, evidence contents, or implementation status that were not provided.

Output format:
{
  "steps": [
    {
      "title": "Action title",
      "description": "Concise actionable step (1-3 sentences, single action)",
      "priority": "HIGH|MEDIUM|LOW",
      "owner": "IT Security|Compliance|HR|...",
      "estimatedHours": 24
    }
  ],
  "policies": ["Policy 1", "Policy 2"],
  "technicalControls": ["Control 1", "Control 2"],
  "businessFit": { "applicability": "APPLICABLE|PARTIALLY_APPLICABLE|NOT_APPLICABLE", "rationale": "Brief explanation using provided business context" },
  "evidenceValidation": { "overallHealth": "SUFFICIENT|PARTIALLY_SUFFICIENT|INSUFFICIENT|MISSING", "missingTypes": ["List of document categories not yet provided"], "recommendations": ["Actions to improve evidence coverage"] },
  "confidence": 85
}
`;
}

function getRemediationCacheKey(input: GenerateRemediationInput): string {
  const sortedEvidence = (input.uploadedEvidenceFiles ?? [])
    .map((f) => f.trim().toLowerCase())
    .sort((a, b) => a.localeCompare(b));

  const keyPayload = JSON.stringify({
    promptVersion: remediationPromptVersion,
    frameworkName: input.frameworkName.trim().toLowerCase(),
    controlId: input.controlId.trim().toLowerCase(),
    controlDescription: input.controlDescription.trim().toLowerCase(),
    currentStatus: input.currentStatus.trim().toLowerCase(),
    severity: input.severity.trim().toLowerCase(),
    userNotes: (input.userNotes ?? "").trim().toLowerCase(),
    uploadedEvidenceFiles: sortedEvidence,
    productDescription: (input.productDescription ?? "").trim().toLowerCase(),
    targetAudience: (input.targetAudience ?? "").trim().toLowerCase(),
    cacheKeySalt,
  });
  const key = `remediation:${keyPayload}`;
  return crypto.createHash("md5").update(key).digest("hex");
}

function getPriorityFromSeverity(severity: string, currentStatus?: string): RemediationPriority {
  const normalized = severity.trim().toUpperCase();
  const status = (currentStatus ?? "").trim().toUpperCase();

  // COMPLIANT controls always get LOW priority (maintenance only)
  if (status === "COMPLIANT") {
    return "LOW";
  }

  if (normalized === "CRITICAL" || normalized === "HIGH") {
    return "HIGH";
  }

  if (normalized === "MEDIUM") {
    return "MEDIUM";
  }

  return "LOW";
}

function getFallbackRemediation(input: GenerateRemediationInput): RemediationResponse {
  const priority = getPriorityFromSeverity(input.severity, input.currentStatus);
  const statusLabel = (input.currentStatus ?? "unknown").replaceAll("_", " ").toLowerCase();

  return {
    steps: [
      {
        title: `Assess ${input.controlId} against ${input.frameworkName}`,
        description: `Current status is ${statusLabel}. Review current implementation, document gaps against control ${input.controlId} requirements, and assign remediation owners.`,
        priority,
        owner: "Compliance",
        estimatedHours: 8,
      },
      {
        title: "Implement and document required controls",
        description: `Address identified gaps for ${input.controlId}. Deploy required controls, update procedures, and collect evidence for ${input.frameworkName} compliance.`,
        priority,
        owner: "IT Security",
        estimatedHours: 16,
      },
      {
        title: "Validate compliance and obtain sign-off",
        description:
          "Test implemented controls, confirm residual risk is acceptable, and obtain compliance stakeholder approval.",
        priority: "MEDIUM",
        owner: "Internal Audit",
        estimatedHours: 6,
      },
    ],
    policies: ["Access Control Policy", "Information Security Policy"],
    technicalControls: [
      "SIEM alerting and log retention",
      "Multi-factor authentication enforcement",
    ],
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export function parseRemediationResponse(text: string): RemediationResponse {
  // Try to parse the whole string as JSON first (handles pure JSON responses).
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Fallback: extract first JSON object from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new RemediationParseError("No JSON found in AI remediation response");
    }

    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new RemediationParseError("Invalid JSON in AI remediation response");
    }
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "policySuggestions" in parsed &&
    !("policies" in parsed)
  ) {
    const candidate = parsed as { policySuggestions: unknown; policies?: unknown };
    candidate.policies = candidate.policySuggestions;
    parsed = candidate;
  }

  parsed = normalizeRemediationResponse(parsed);

  const result = remediationResponseSchema.safeParse(parsed);

  if (!result.success) {
    throw new RemediationParseError("AI remediation response failed schema validation");
  }

  return result.data;
}

async function logRemediationInteraction(
  input: GenerateRemediationInput,
  output: RemediationResponse,
  model: string,
  tokensUsed: number,
) {
  try {
    await prisma.aIInteraction.create({
      data: {
        type: "REMEDIATION" as never,
        input: JSON.stringify(input),
        output: JSON.stringify(output),
        model,
        tokensUsed,
      },
    });
  } catch (error) {
    try {
      await prisma.aIInteraction.create({
        data: {
          type: "REMEDIATION_PLAN",
          input: JSON.stringify(input),
          output: JSON.stringify(output),
          model,
          tokensUsed,
        },
      });
    } catch (fallbackError) {
      console.error("Failed to log remediation AI interaction", error, fallbackError);
    }
  }
}

async function enrichInputWithOrgData(
  input: GenerateRemediationInput,
): Promise<GenerateRemediationInput> {
  // If business context is already provided, use it as-is
  if (input.productDescription && input.targetAudience) {
    return input;
  }

  // If we have an assessmentId, fetch org data from the database
  if (input.assessmentId) {
    try {
      const assessment = await prisma.assessment.findFirst({
        where: { id: input.assessmentId },
        select: {
          organization: {
            select: {
              productName: true,
              description: true,
              targetCustomers: true,
            },
          },
        },
      });

      if (assessment?.organization) {
        const org = assessment.organization;
        return {
          ...input,
          productDescription:
            input.productDescription ?? org.productName ?? org.description ?? undefined,
          targetAudience: input.targetAudience ?? org.targetCustomers ?? undefined,
        };
      }
    } catch {
      // Swallow DB errors — fall back to whatever input we have
    }
  }

  return input;
}

export async function generateRemediation(
  input: GenerateRemediationInput,
): Promise<RemediationResponse> {
  // Enrich with business context from the database if not provided by caller
  const enriched = await enrichInputWithOrgData(input);
  const cacheKey = getRemediationCacheKey(enriched);

  if (!enriched.regenerate) {
    const cached = await getCache<RemediationResponse>(cacheKey);
    if (cached) {
      void logRemediationInteraction(enriched, cached, "cache", 0);
      return cached;
    }
  }

  const prompt = buildRemediationPrompt(enriched);
  let lastError: Error | null = null;
  let sawTimeout = false;

  for (let attempt = 1; attempt <= remediationMaxRetries; attempt++) {
    try {
      const result = await withTimeout(
        generateText({
          model: groq("llama-3.3-70b-versatile"),
          prompt,
        }),
        remediationTimeoutMs,
        "AI remediation request timed out",
      );

      const parsed = parseRemediationResponse(result.text);

      await setCache(cacheKey, parsed, aiCacheTtlSeconds);

      void logRemediationInteraction(
        input,
        parsed,
        "llama-3.3-70b",
        result.usage?.totalTokens ?? 0,
      );

      return parsed;
    } catch (error) {
      const resolvedError =
        error instanceof Error ? error : new Error("Unknown AI remediation error");
      lastError = resolvedError;

      console.error(`Remediation attempt ${attempt} failed`, resolvedError);

      if (resolvedError.message.toLowerCase().includes("timed out")) {
        sawTimeout = true;
        // Propagate the timeout error so the API route can return 504
        throw resolvedError;
      }

      const shouldRetry = resolvedError instanceof RemediationParseError;

      if (!shouldRetry || attempt === remediationMaxRetries) {
        break;
      }
    }
  }

  // If we observed a timeout, surface it instead of returning a silent fallback
  if (sawTimeout && lastError) {
    throw lastError;
  }

  const fallback = getFallbackRemediation(input);

  await setCache(cacheKey, fallback, aiCacheTtlSeconds);

  void logRemediationInteraction(input, fallback, lastError?.message ?? "fallback", 0);

  return fallback;
}

export function clearAIServiceCachesForTests() {
  cacheKeySalt = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  frameworkCatalogCache = {
    data: [],
    expiry: 0,
  };
}

async function parseAIResponse(text: string): Promise<AIFrameworkSuggestion[]> {
  try {
    // Prefer parsing the entire response as JSON (handles arrays or objects)
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found");
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Accept either an array of suggestions or an object with `frameworks` key
    let candidateFrameworks: Array<Partial<AIFrameworkSuggestion>> | undefined;

    if (Array.isArray(parsed)) {
      candidateFrameworks = parsed as Array<Partial<AIFrameworkSuggestion>>;
    } else if (parsed && typeof parsed === "object") {
      const asObj = parsed as { frameworks?: Array<Partial<AIFrameworkSuggestion>> } & Record<
        string,
        unknown
      >;
      if (Array.isArray(asObj.frameworks)) {
        candidateFrameworks = asObj.frameworks;
      }
    }

    if (!candidateFrameworks || !Array.isArray(candidateFrameworks)) {
      throw new Error("Invalid format");
    }

    const validated: AIFrameworkSuggestion[] = candidateFrameworks.map(
      (f: Partial<AIFrameworkSuggestion>) => ({
        code: typeof f.code === "string" ? f.code.trim() : "UNKNOWN",
        name: typeof f.name === "string" ? f.name.trim() : "Unknown",
        confidence: Math.min(100, Math.max(0, f.confidence ?? 50)),
        explanation: typeof f.explanation === "string" ? f.explanation : "",
        tags: Array.isArray(f.tags) ? f.tags : [],
        source: "ai" as SuggestionSource,
      }),
    );

    return validated
      .sort((a: AIFrameworkSuggestion, b: AIFrameworkSuggestion) => b.confidence - a.confidence)
      .slice(0, 8);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}

export async function mapCompliance(org: OrgProfile): Promise<FrameworkSuggestion[]> {
  const prompt = buildPrompt(org);

  const keyPayload = JSON.stringify({
    org,
    cacheKeySalt,
  });
  const key = crypto.createHash("md5").update(`compliance:${keyPayload}`).digest("hex");

  const cached = await getCache<FrameworkSuggestion[]>(key);
  if (cached) {
    return cached;
  }

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (process.env.OPENAI_API_KEY?.trim() === "Timeout") {
        throw new Error("Timeout");
      }

      const result = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt,
      });

      // console.log("AI RAW:", result.text);

      const parsed = await parseAIResponse(result.text);
      const mappedSuggestions = await enrichFrameworkSuggestions(parsed);

      if (mappedSuggestions.length === 0) {
        throw new Error("No mapped frameworks found in AI response");
      }

      await setCache(key, mappedSuggestions, aiCacheTtlSeconds);

      prisma.aIInteraction
        .create({
          data: {
            type: "COMPLIANCE_MAPPING",
            input: JSON.stringify(org),
            output: JSON.stringify(mappedSuggestions),
            model: "llama-3.3-70b",
            tokensUsed: result.usage?.totalTokens ?? 0,
          },
        })
        .catch((logError: unknown) => {
          console.error("Failed to log AI interaction", logError);
        });

      return mappedSuggestions;
    } catch (err) {
      console.error(`AI attempt ${attempt} failed`, err);

      const errMessage = err instanceof Error ? err.message : "";
      const isTimeout = errMessage.toLowerCase().includes("timed out") || errMessage === "Timeout";

      if (isTimeout) {
        if (attempt === maxRetries) {
          break;
        }
        continue;
      }

      // For non-timeout errors, throw to caller (API route will return 500)
      throw err;
    }
  }

  const heuristicSuggestions = getHeuristicSuggestions(org);
  const enrichedFallback = await enrichFrameworkSuggestions(heuristicSuggestions);

  await setCache(key, enrichedFallback, aiCacheTtlSeconds);

  prisma.aIInteraction
    .create({
      data: {
        type: "COMPLIANCE_MAPPING",
        input: JSON.stringify(org),
        output: JSON.stringify(enrichedFallback),
        model: "heuristic",
        tokensUsed: 0,
      },
    })
    .catch((logError: unknown) => {
      console.error("Failed to log heuristic AI interaction", logError);
    });

  return enrichedFallback;
}
