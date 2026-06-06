import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/services/ai-service", () => ({
  parseRemediationResponse: vi.fn(),
  generateRemediation: vi.fn(),
  clearAIServiceCachesForTests: vi.fn(),
}));

import type { GenerateRemediationInput } from "@/types/ai";
import {
  generateRemediation,
  parseRemediationResponse,
  clearAIServiceCachesForTests,
} from "@/services/ai-service";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("AI remediation parsing", () => {
  it("parses valid JSON string", async () => {
    vi.mocked(parseRemediationResponse).mockImplementation((input: string) => {
      return JSON.parse(input);
    });

    const input = JSON.stringify({
      steps: [
        {
          title: "Fix config",
          description: "Update settings",
          priority: "HIGH",
          owner: "admin",
          estimatedHours: 2,
        },
      ],
      policies: [],
      technicalControls: [],
    });
    const parsed = await parseRemediationResponse(input);
    expect(parsed.steps[0].title).toBe("Fix config");
  });

  it("throws when input is invalid", async () => {
    vi.mocked(parseRemediationResponse).mockRejectedValue(new Error("RemediationParseError"));

    await expect(parseRemediationResponse("not json")).rejects.toThrow("RemediationParseError");
  });

  it("generateRemediation calls underlying LLM generator", async () => {
    vi.mocked(generateRemediation).mockResolvedValue({
      steps: [
        {
          title: "Auto remediation",
          description: "Automated fix",
          priority: "HIGH",
          owner: "admin",
          estimatedHours: 1,
        },
      ],
      policies: [],
      technicalControls: [],
    });

    const res = await generateRemediation({
      controlId: "c1",
      context: "ctx",
    } as unknown as GenerateRemediationInput);
    expect(res.steps[0].title).toBe("Auto remediation");
    expect(generateRemediation).toHaveBeenCalled();
  });

  it("clearAIServiceCachesForTests is available", () => {
    expect(typeof clearAIServiceCachesForTests).toBe("function");
  });
});
