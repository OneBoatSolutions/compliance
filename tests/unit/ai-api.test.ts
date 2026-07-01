import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

import { apiClient } from "@/lib/api-client";
import { requestRemediation } from "@/lib/ai-api";

describe("requestRemediation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deduplicates identical in-flight requests", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      steps: [
        { title: "A", description: "a", priority: "HIGH", owner: "IT", estimatedHours: 1 },
        { title: "B", description: "b", priority: "MEDIUM", owner: "IT", estimatedHours: 1 },
        { title: "C", description: "c", priority: "LOW", owner: "IT", estimatedHours: 1 },
      ],
      policies: ["P1", "P2"],
      technicalControls: ["T1", "T2"],
    });

    const input = {
      frameworkName: "GDPR",
      controlId: "C-001",
      controlTitle: "Access Control",
      controlDescription: "Restrict access",
      currentStatus: "NOT_COMPLIANT",
      severity: "HIGH",
      assessmentId: "assessment-1",
    };

    const [first, second] = await Promise.all([
      requestRemediation(input),
      requestRemediation(input),
    ]);

    expect(first).toEqual(second);
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });
});
