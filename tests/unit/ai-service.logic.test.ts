import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before any imports
vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
    },
    aIInteraction: {
      create: vi.fn().mockReturnValue({
        catch: vi.fn(),
      }),
    },
  },
}));

vi.mock("@/lib/cache", () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/cache";
import { generateText } from "ai";
import {
  generateRemediation,
  parseRemediationResponse,
  mapCompliance,
  getComplianceFallback,
  clearAIServiceCachesForTests,
} from "@/services/ai-service";
import type { GenerateRemediationInput } from "@/types/ai";

const validRemediationResponse = {
  steps: [
    { title: "Step A", description: "Do A", priority: "HIGH", owner: "IT", estimatedHours: 4 },
    { title: "Step B", description: "Do B", priority: "MEDIUM", owner: "Ops", estimatedHours: 2 },
    { title: "Step C", description: "Do C", priority: "LOW", owner: "Dev", estimatedHours: 1 },
  ],
  policies: ["Policy 1", "Policy 2"],
  technicalControls: ["Control 1", "Control 2"],
};

const mockOrgProfile = {
  name: "TestOrg",
  description: "A test organization",
  services: "Cloud services",
  customers: "Enterprise",
  problem: "Compliance management",
  dataHandled: ["PII"],
  regions: ["US"],
};

describe("ai-service: parseRemediationResponse", () => {
  it("parses pure JSON", () => {
    const result = parseRemediationResponse(JSON.stringify(validRemediationResponse));
    expect(result.steps).toHaveLength(3);
    expect(result.policies).toHaveLength(2);
    expect(result.technicalControls).toHaveLength(2);
  });

  it("parses JSON embedded in text output", () => {
    const text = `Here is the plan:\n${JSON.stringify(validRemediationResponse)}\nEnd.`;
    const result = parseRemediationResponse(text);
    expect(result.steps[0].title).toBe("Step A");
  });

  it("accepts legacy policySuggestions field", () => {
    const legacy = {
      steps: validRemediationResponse.steps,
      policySuggestions: validRemediationResponse.policies,
      technicalControls: validRemediationResponse.technicalControls,
    };
    const result = parseRemediationResponse(JSON.stringify(legacy));
    expect(result.policies).toEqual(validRemediationResponse.policies);
  });

  it("throws RemediationParseError for invalid JSON", () => {
    expect(() => parseRemediationResponse("not json")).toThrow();
  });

  it("throws RemediationParseError for missing required fields", () => {
    const bad = { steps: [{ title: "A" }] };
    expect(() => parseRemediationResponse(JSON.stringify(bad))).toThrow();
  });

  it("throws when steps are fewer than minimum (3)", () => {
    const tooFew = {
      steps: [
        { title: "A", description: "do A", priority: "HIGH", owner: "IT", estimatedHours: 1 },
        { title: "B", description: "do B", priority: "MEDIUM", owner: "Ops", estimatedHours: 2 },
      ],
      policies: ["P1"],
      technicalControls: ["T1"],
    };
    expect(() => parseRemediationResponse(JSON.stringify(tooFew))).toThrow();
  });
});

describe("ai-service: generateRemediation", () => {
  const input: GenerateRemediationInput = {
    controlId: "C-001",
    controlTitle: "Access Control",
    controlDescription: "Ensure proper access controls",
    currentStatus: "NOT_COMPLIANT",
    severity: "HIGH",
    frameworkName: "GDPR",
    regenerate: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached result when available and not regenerating", async () => {
    vi.mocked(getCache).mockResolvedValue(validRemediationResponse);
    vi.mocked(generateText).mockRejectedValue(new Error("should not be called"));

    const result = await generateRemediation({ ...input, regenerate: false });
    expect(result).toEqual(validRemediationResponse);
    expect(generateText).not.toHaveBeenCalled();
  });

  it("calls AI and caches the result on success", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(validRemediationResponse),
      usage: { totalTokens: 150 },
    } as never);

    const result = await generateRemediation(input);
    expect(result.steps).toHaveLength(3);
    expect(setCache).toHaveBeenCalled();
  });

  it("throws timeout error to allow API route to return 504", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("AI remediation request timed out"));

    await expect(generateRemediation(input)).rejects.toThrow(/timed out/i);
  });

  it("falls back to default remediation after max retries of parse failures", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockResolvedValue({
      text: "bad json that fails schema",
      usage: { totalTokens: 10 },
    } as never);

    const result = await generateRemediation(input);
    expect(result.steps.length).toBeGreaterThanOrEqual(3);
  });

  it("clears caches for tests", () => {
    expect(() => clearAIServiceCachesForTests()).not.toThrow();
  });
});

describe("ai-service: getComplianceFallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns enriched fallback suggestions mapped to frameworks", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      {
        id: "fw_gdpr",
        code: "GDPR",
        name: "General Data Protection Regulation",
        _count: { controls: 20 },
      },
      {
        id: "fw_hipaa",
        code: "HIPAA",
        name: "Health Insurance Portability and Accountability Act",
        _count: { controls: 15 },
      },
      {
        id: "fw_pci",
        code: "PCI-DSS",
        name: "Payment Card Industry Data Security Standard",
        _count: { controls: 12 },
      },
    ] as never);

    const result = await getComplianceFallback();
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0]).toHaveProperty("frameworkId");
    expect(result[0]).toHaveProperty("controls");
  });
});

describe("ai-service: mapCompliance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAIServiceCachesForTests();
  });

  it("returns cached results when available", async () => {
    vi.mocked(getCache).mockResolvedValue([
      {
        code: "GDPR",
        name: "GDPR",
        confidence: 95,
        explanation: "test",
        tags: ["privacy"],
        frameworkId: "fw1",
        controls: 10,
      },
    ]);
    vi.mocked(generateText).mockRejectedValue(new Error("should not be called"));

    const result = await mapCompliance(mockOrgProfile);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe("GDPR");
  });

  it("returns fallback suggestions when AI times out", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    const result = await mapCompliance(mockOrgProfile);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(setCache).toHaveBeenCalled();
  });

  it("throws on non-timeout AI errors so the route can return 500", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("AI unavailable"));

    await expect(mapCompliance(mockOrgProfile)).rejects.toThrow("AI unavailable");
  });
});
