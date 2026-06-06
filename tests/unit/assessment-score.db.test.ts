import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    assessmentItem: {
      findMany: vi.fn(),
    },
    assessment: {
      updateMany: vi.fn(),
    },
    assessmentScoreLog: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  recalculateAssessmentScore,
  getFrameworkScoresForAssessment,
} from "@/lib/assessment-score";

const compliantRow = (weight: number, frameworkId = "fw1", code = "GDPR", name = "GDPR") => ({
  status: "COMPLIANT" as const,
  control: {
    weight,
    isGateway: false,
    frameworkId,
    framework: { id: frameworkId, code, name },
  },
});

const naRow = (weight: number, frameworkId = "fw1", code = "GDPR", name = "GDPR") => ({
  status: "NOT_APPLICABLE" as const,
  control: {
    weight,
    isGateway: false,
    frameworkId,
    framework: { id: frameworkId, code, name },
  },
});

describe("recalculateAssessmentScore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("computes and persists score, logs score history", async () => {
    vi.mocked(prisma.assessmentItem.findMany).mockResolvedValue([
      compliantRow(2),
      compliantRow(3),
    ] as never);
    vi.mocked(prisma.assessment.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.assessmentScoreLog.create).mockResolvedValue({} as never);

    const result = await recalculateAssessmentScore("asm_1");
    expect(result.assessmentId).toBe("asm_1");
    expect(result.score).toBe(100);
    expect(result.frameworkScores).toHaveLength(1);
    expect(prisma.assessment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "asm_1" },
        data: { score: 100 },
      }),
    );
    expect(prisma.assessmentScoreLog.create).toHaveBeenCalled();
  });

  it("throws 404 when assessment not found (updateMany count=0)", async () => {
    vi.mocked(prisma.assessmentItem.findMany).mockResolvedValue([compliantRow(1)] as never);
    vi.mocked(prisma.assessment.updateMany).mockResolvedValue({ count: 0 } as never);

    await expect(recalculateAssessmentScore("missing")).rejects.toThrow(
      "404: Assessment not found",
    );
  });

  it("returns 0 when all rows are NOT_APPLICABLE", async () => {
    vi.mocked(prisma.assessmentItem.findMany).mockResolvedValue([naRow(5), naRow(3)] as never);
    vi.mocked(prisma.assessment.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.assessmentScoreLog.create).mockResolvedValue({} as never);

    const result = await recalculateAssessmentScore("asm_1");
    expect(result.score).toBe(0);
    expect(result.frameworkScores[0].score).toBe(0);
  });
});

describe("getFrameworkScoresForAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches rows and computes per-framework scores", async () => {
    vi.mocked(prisma.assessmentItem.findMany).mockResolvedValue([
      compliantRow(2, "fw1", "GDPR", "GDPR"),
      {
        status: "NOT_COMPLIANT" as const,
        control: {
          weight: 2,
          isGateway: false,
          frameworkId: "fw1",
          framework: { id: "fw1", code: "GDPR", name: "GDPR" },
        },
      },
    ] as never);

    const scores = await getFrameworkScoresForAssessment("asm_1");
    expect(scores).toHaveLength(1);
    expect(scores[0].score).toBe(50);
    expect(scores[0].frameworkCode).toBe("GDPR");
  });

  it("returns empty array when no items exist", async () => {
    vi.mocked(prisma.assessmentItem.findMany).mockResolvedValue([] as never);
    const scores = await getFrameworkScoresForAssessment("asm_1");
    expect(scores).toEqual([]);
  });
});
