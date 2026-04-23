import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGenerateText, mockCreateInteraction, mockGetCache, mockSetCache, cacheStore } =
  vi.hoisted(() => {
    const store = new Map<string, unknown>();

    return {
      mockGenerateText: vi.fn(),
      mockCreateInteraction: vi.fn(),
      mockGetCache: vi.fn(async (key: string) => {
        return store.has(key) ? store.get(key) : null;
      }),
      mockSetCache: vi.fn(async (key: string, data: unknown) => {
        store.set(key, data);
      }),
      cacheStore: store,
    };
  });

vi.mock("ai", () => ({
  generateText: mockGenerateText,
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => vi.fn(() => "mock-model")),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
    },
    aIInteraction: {
      create: mockCreateInteraction,
    },
  },
}));

vi.mock("@/lib/cache", () => ({
  getCache: mockGetCache,
  setCache: mockSetCache,
}));

import {
  clearAIServiceCachesForTests,
  generateRemediation,
  parseRemediationResponse,
} from "@/services/ai-service";

const input = {
  frameworkName: "ISO 27001",
  controlId: "A.9.2",
  controlTitle: "User Access Management",
  controlDescription: "Ensure user access is provisioned and reviewed.",
  currentStatus: "NOT_COMPLIANT",
  severity: "HIGH",
};

const validJson = JSON.stringify({
  steps: [
    {
      title: "Document and approve access workflow",
      description: "Define request, approval, and revocation process for user access.",
      priority: "HIGH",
      owner: "Compliance",
      estimatedHours: 10,
    },
    {
      title: "Implement role-based access control",
      description: "Configure RBAC in identity provider and business systems.",
      priority: "HIGH",
      owner: "IT Security",
      estimatedHours: 16,
    },
    {
      title: "Run quarterly access reviews",
      description: "Review active accounts and remove unnecessary privileges.",
      priority: "MEDIUM",
      owner: "Internal Audit",
      estimatedHours: 6,
    },
  ],
  policies: ["Access Control Policy", "Identity and Access Management Policy"],
  technicalControls: ["MFA enforcement", "Privileged access monitoring"],
});

describe("AI remediation service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheStore.clear();
    clearAIServiceCachesForTests();
    mockCreateInteraction.mockResolvedValue({});
  });

  it("parses valid remediation JSON", () => {
    const parsed = parseRemediationResponse(validJson);

    expect(parsed.steps).toHaveLength(3);
    expect(parsed.steps[0].priority).toBe("HIGH");
    expect(parsed.policies).toHaveLength(2);
    expect(parsed.technicalControls).toHaveLength(2);
  });

  it("retries when AI returns malformed JSON", async () => {
    mockGenerateText
      .mockResolvedValueOnce({ text: "not-json" })
      .mockResolvedValueOnce({ text: validJson, usage: { totalTokens: 250 } });

    const result = await generateRemediation(input);

    expect(result.steps[0].title).toBe("Document and approve access workflow");
    expect(mockGenerateText).toHaveBeenCalledTimes(2);
  });

  it("uses cache on repeated requests", async () => {
    mockGenerateText.mockResolvedValue({ text: validJson, usage: { totalTokens: 200 } });

    await generateRemediation(input);
    await generateRemediation(input);

    expect(mockGenerateText).toHaveBeenCalledTimes(1);
  });

  it("bypasses cache when regenerate is true", async () => {
    mockGenerateText.mockResolvedValue({ text: validJson, usage: { totalTokens: 200 } });

    await generateRemediation(input);
    await generateRemediation({ ...input, regenerate: true });

    expect(mockGenerateText).toHaveBeenCalledTimes(2);
  });
});
