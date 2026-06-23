import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { POST as recalculateScorePost } from "@/app/api/assessments/[id]/score/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessment: {
        findFirst: vi.fn(),
      },
      $queryRaw: vi.fn(),
    },
  };
});

describe("Assessment score API route", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
  });

  it("recalculates score for owned assessment", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({ id: "asm_1" } as never);
    vi.spyOn(prisma, "$queryRaw").mockResolvedValue([
      {
        id: "asm_1",
        score: 86,
        numerator: 172,
        denominator: 200,
      },
    ] as never);

    const req = new Request("http://localhost/api/assessments/asm_1/score", {
      method: "POST",
    });

    const res = (await recalculateScorePost(req, {
      params: Promise.resolve({ id: "asm_1" }),
    })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.assessmentId).toBe("asm_1");
    expect(json.data.score).toBe(86);
    expect(typeof json.data.calculationDurationMs).toBe("number");
  });

  it("returns 404 when assessment does not belong to current user", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/assessments/asm_404/score", {
      method: "POST",
    });

    const res = (await recalculateScorePost(req, {
      params: Promise.resolve({ id: "asm_404" }),
    })) as Response;

    expect(res.status).toBe(404);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it("maps auth failures to 401", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/assessments/asm_1/score", {
      method: "POST",
    });

    const res = (await recalculateScorePost(req, {
      params: Promise.resolve({ id: "asm_1" }),
    })) as Response;

    expect(res.status).toBe(401);
  });
});
