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

  it("normalizes human-style applicability and evidence health wording", () => {
    const responseWithNaturalLanguage = {
      ...validRemediationResponse,
      businessFit: {
        applicability: "Likely applicable",
        rationale: "The control likely applies, but company size and processing scale are missing.",
      },
      evidenceValidation: {
        overallHealth: "Missing",
        missingTypes: ["Policy", "Evidence log"],
        recommendations: ["Upload the policy and log."],
      },
      confidence: "72",
    };

    const parsed = parseRemediationResponse(JSON.stringify(responseWithNaturalLanguage));

    expect(parsed.businessFit?.applicability).toBe("PARTIALLY_APPLICABLE");
    expect(parsed.evidenceValidation?.overallHealth).toBe("MISSING");
    expect(parsed.confidence).toBe(72);
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

  it("builds an auditor-style prompt that calls out missing context and evidence limits", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(validRemediationResponse),
      usage: { totalTokens: 150 },
    } as never);

    await generateRemediation({
      ...input,
      userNotes: "Needs documented review cadence",
      uploadedEvidenceFiles: ["screenshot.png"],
      productDescription: "B2B SaaS platform for mid-market teams",
      targetAudience: "Operations and security teams",
    });

    const prompt = vi.mocked(generateText).mock.calls[0]?.[0]?.prompt as string | undefined;

    expect(prompt).toContain("Likely applicable or Potentially applicable");
    expect(prompt).toContain("company size, processing scale, jurisdiction, or regulatory scope");
    expect(prompt).toContain(
      "do not assume legal obligations solely because the product processes financial or personal data",
    );
    expect(prompt).toContain("state that compliance cannot be verified");
    expect(prompt).toContain("directly related to the current control");
    expect(prompt).toContain("what missing information prevents a higher score");
    expect(prompt).toContain(
      "Assess whether this control is legally required for the organization",
    );
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

describe("ai-service: heuristic fallback (replaces old getComplianceFallback)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns heuristic suggestions mapped to frameworks when AI times out", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    // Mock framework catalog so enrichment works
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

    const result = await mapCompliance(mockOrgProfile);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0]).toHaveProperty("frameworkId");
    expect(result[0]).toHaveProperty("controls");
    expect(result[0]).toHaveProperty("source");
    expect(result[0].source).toBe("heuristic");
    // Confidence should be capped at 55 for heuristic results
    expect(result[0].confidence).toBeLessThanOrEqual(55);
  });

  it("returns heuristic suggestions with source: heuristic", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      {
        id: "fw_gdpr",
        code: "GDPR",
        name: "General Data Protection Regulation",
        _count: { controls: 20 },
      },
    ] as never);

    const result = await mapCompliance(mockOrgProfile);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].source).toBe("heuristic");
  });

  it("returns empty array when no keywords match the org profile", async () => {
    const obscureOrg = {
      name: "WidgetCo",
      description: "We make widgets",
      services: "Widget manufacturing",
      customers: "Other widget makers",
      problem: "Widget quality",
      dataHandled: ["metal", "plastic"],
      regions: ["mars"],
    };

    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    vi.mocked(prisma.framework.findMany).mockResolvedValue([] as never);

    const result = await mapCompliance(obscureOrg);
    expect(result).toHaveLength(0);
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
        source: "ai",
      },
    ]);
    vi.mocked(generateText).mockRejectedValue(new Error("should not be called"));

    const result = await mapCompliance(mockOrgProfile);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe("GDPR");
    expect(result[0].source).toBe("ai");
  });

  it("returns heuristic suggestions when AI times out", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      {
        id: "fw_gdpr",
        code: "GDPR",
        name: "General Data Protection Regulation",
        _count: { controls: 20 },
      },
    ] as never);

    const result = await mapCompliance(mockOrgProfile);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].source).toBe("heuristic");
    expect(setCache).toHaveBeenCalled();
  });

  it("throws on non-timeout AI errors so the route can return 500", async () => {
    vi.mocked(getCache).mockResolvedValue(null);
    vi.mocked(generateText).mockRejectedValue(new Error("AI unavailable"));

    await expect(mapCompliance(mockOrgProfile)).rejects.toThrow("AI unavailable");
  });
});
