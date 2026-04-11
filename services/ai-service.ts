import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import crypto from "crypto";

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

const cache = new Map<string, { data: FrameworkSuggestion[]; expiry: number }>();
const cacheTtl = 24 * 60 * 60 * 1000; // 24 hours
const frameworkCatalogCacheTtl = 5 * 60 * 1000; // 5 minutes

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

  const catalog = frameworks.map((framework) => ({
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

async function parseAIResponse(text: string): Promise<AIFrameworkSuggestion[]> {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      frameworks?: Array<Partial<AIFrameworkSuggestion>>;
    };

    if (!parsed.frameworks || !Array.isArray(parsed.frameworks)) {
      throw new Error("Invalid format");
    }

    const validated: AIFrameworkSuggestion[] = parsed.frameworks.map(
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

  const key = crypto.createHash("md5").update(JSON.stringify(org)).digest("hex");

  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
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

      cache.set(key, {
        data: mappedSuggestions,
        expiry: Date.now() + cacheTtl,
      });

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
        .catch((logError) => {
          console.error("Failed to log AI interaction", logError);
        });

      return mappedSuggestions;
    } catch (err) {
      console.error(`AI attempt ${attempt} failed`, err);
      if (attempt === maxRetries) {
        break;
      }
    }
  }

  const fallback = await getComplianceFallback();

  cache.set(key, {
    data: fallback,
    expiry: Date.now() + cacheTtl,
  });

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
    .catch((logError) => {
      console.error("Failed to log fallback AI interaction", logError);
    });

  return fallback;
}
