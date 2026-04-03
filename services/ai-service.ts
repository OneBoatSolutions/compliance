import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import crypto from "crypto";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map<string, { data: FrameworkSuggestion[]; expiry: number }>();
const cacheTtl = 24 * 60 * 60 * 1000; // 24 hours

interface OrgProfile {
  name: string;
  description: string;
  services: string;
  customers: string;
  problem: string;
  dataHandled: string[];
  regions: string[];
}

interface FrameworkSuggestion {
  code: string;
  name: string;
  confidence: number;
  explanation: string;
  tags: string[];
}

//TODO: fallback to be improved later (include multiple frameworks)
const fallbackSuggestions: FrameworkSuggestion[] = [
  {
    code: "ISO27001",
    name: "ISO 27001",
    confidence: 70,
    explanation: "Fallback recommendation due to AI failure",
    tags: ["security"],
  },
];

export function getComplianceFallback(): FrameworkSuggestion[] {
  return fallbackSuggestions;
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

async function parseAIResponse(text: string): Promise<FrameworkSuggestion[]> {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.frameworks || !Array.isArray(parsed.frameworks)) {
      throw new Error("Invalid format");
    }

    // validation
    return parsed.frameworks.map((f: Partial<FrameworkSuggestion>) => ({
      code: f.code ?? "UNKNOWN",
      name: f.name ?? "Unknown",
      confidence: Math.min(100, Math.max(0, f.confidence ?? 50)),
      explanation: f.explanation ?? "",
      tags: Array.isArray(f.tags) ? f.tags : [],
    }));
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

      cache.set(key, {
        data: parsed,
        expiry: Date.now() + cacheTtl,
      });

      prisma.aIInteraction
        .create({
          data: {
            type: "COMPLIANCE_MAPPING",
            input: JSON.stringify(org),
            output: JSON.stringify(parsed),
            model: "llama-3.3-70b",
            tokensUsed: result.usage?.totalTokens ?? 0,
          },
        })
        .catch((logError) => {
          console.error("Failed to log AI interaction", logError);
        });

      return parsed;
    } catch (err) {
      console.error(`AI attempt ${attempt} failed`, err);
      if (attempt === maxRetries) {
        break;
      }
    }
  }

  const fallback = getComplianceFallback();

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
