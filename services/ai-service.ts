import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type {
  GenerateRemediationInput,
  RemediationPriority,
  RemediationResponse,
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
});

let frameworkCatalogCache: { data: FrameworkCatalogEntry[]; expiry: number } = {
  data: [],
  expiry: 0,
};

const fallbackSuggestions: AIFrameworkSuggestion[] = [
  {
    code: "GDPR",
    name: "General Data Protection Regulation",
    confidence: 82,
    explanation:
      "GDPR is commonly applicable when personal data is collected or processed for users in EU regions.",
    tags: ["privacy", "pii", "eu"],
  },
  {
    code: "HIPAA",
    name: "Health Insurance Portability and Accountability Act",
    confidence: 76,
    explanation:
      "HIPAA is relevant for products handling protected health information or serving healthcare workflows in the US.",
    tags: ["healthcare", "phi", "security"],
  },
  {
    code: "PCI-DSS",
    name: "Payment Card Industry Data Security Standard",
    confidence: 74,
    explanation:
      "PCI-DSS is applicable for systems storing, processing, or transmitting cardholder payment information.",
    tags: ["payments", "finance", "security"],
  },
];

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

export async function getComplianceFallback(): Promise<FrameworkSuggestion[]> {
  return enrichFrameworkSuggestions(fallbackSuggestions);
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
  return `
You are a compliance expert. Generate a remediation plan.

Framework: ${input.frameworkName}
Control: ${input.controlId} - ${input.controlTitle}
Description: ${input.controlDescription}
Current Status: ${input.currentStatus}
Severity: ${input.severity}

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

Output format:
{
  "steps": [
    {
      "title": "Action title",
      "description": "Detailed steps...",
      "priority": "HIGH|MEDIUM|LOW",
      "owner": "IT Security|Compliance|HR|...",
      "estimatedHours": 24
    }
  ],
  "policies": ["Policy 1", "Policy 2"],
  "technicalControls": ["Control 1", "Control 2"]
}
`;
}

function getRemediationCacheKey(input: GenerateRemediationInput): string {
  const keyPayload = JSON.stringify({
    frameworkName: input.frameworkName.trim().toLowerCase(),
    controlId: input.controlId.trim().toLowerCase(),
    controlDescription: input.controlDescription.trim().toLowerCase(),
    currentStatus: input.currentStatus.trim().toLowerCase(),
    severity: input.severity.trim().toLowerCase(),
    cacheKeySalt,
  });
  const key = `remediation:${keyPayload}`;
  return crypto.createHash("md5").update(key).digest("hex");
}

function getPriorityFromSeverity(severity: string): RemediationPriority {
  const normalized = severity.trim().toUpperCase();

  if (normalized === "CRITICAL" || normalized === "HIGH") {
    return "HIGH";
  }

  if (normalized === "MEDIUM") {
    return "MEDIUM";
  }

  return "LOW";
}

function getFallbackRemediation(input: GenerateRemediationInput): RemediationResponse {
  const defaultPriority = getPriorityFromSeverity(input.severity);

  return {
    steps: [
      {
        title: `Perform a targeted gap assessment for ${input.controlId}`,
        description:
          "Review current implementation evidence, compare it against control expectations, and document exact gaps with owners and due dates.",
        priority: defaultPriority,
        owner: "Compliance",
        estimatedHours: 8,
      },
      {
        title: "Implement and document remediation controls",
        description:
          "Deploy required technical and process changes, update procedures, and capture verifiable evidence that maps to the control.",
        priority: defaultPriority,
        owner: "IT Security",
        estimatedHours: 16,
      },
      {
        title: "Validate effectiveness and close findings",
        description:
          "Run control testing, confirm residual risks are addressed, and obtain sign-off from compliance stakeholders.",
        priority: "MEDIUM",
        owner: "Internal Audit",
        estimatedHours: 6,
      },
    ],
    policies: ["Access Control Policy", "Information Security Policy", "Risk Management Policy"],
    technicalControls: [
      "SIEM alerting and log retention",
      "Multi-factor authentication enforcement",
      "Centralized endpoint configuration baseline",
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

export async function generateRemediation(
  input: GenerateRemediationInput,
): Promise<RemediationResponse> {
  const cacheKey = getRemediationCacheKey(input);

  if (!input.regenerate) {
    const cached = await getCache<RemediationResponse>(cacheKey);
    if (cached) {
      void logRemediationInteraction(input, cached, "cache", 0);
      return cached;
    }
  }

  const prompt = buildRemediationPrompt(input);
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

  const fallback = await getComplianceFallback();

  await setCache(key, fallback, aiCacheTtlSeconds);

  prisma.aIInteraction
    .create({
      data: {
        type: "COMPLIANCE_MAPPING",
        input: JSON.stringify(org),
        output: JSON.stringify(fallback),
        model: "fallback",
        tokensUsed: 0,
      },
    })
    .catch((logError: unknown) => {
      console.error("Failed to log fallback AI interaction", logError);
    });

  return fallback;
}
