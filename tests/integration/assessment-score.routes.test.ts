import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { GET as scoreGet } from "@/app/api/assessments/[id]/score/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessment: {
        findFirst: vi.fn(),
      },
      assessmentItem: {
        findMany: vi.fn(),
      },
    },
  };
});

describe("Assessment score API route", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
  });

  it("returns stored score and computed framework scores for owned assessment", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({
      id: "asm_1",
      score: 86,
    } as never);
    vi.spyOn(prisma.assessmentItem, "findMany").mockResolvedValue([
      {
        status: "COMPLIANT",
        control: {
          weight: 1,
          frameworkId: "fw_1",
          framework: {
            id: "fw_1",
            code: "GDPR",
            name: "GDPR",
          },
        },
      },
      {
        status: "PARTIALLY_COMPLIANT",
        control: {
          weight: 1,
          frameworkId: "fw_2",
          framework: {
            id: "fw_2",
            code: "ISO27001",
            name: "ISO 27001",
          },
        },
      },
    ] as never);

    const req = new Request("http://localhost/api/assessments/asm_1/score", {
      method: "GET",
    });

    const res = (await scoreGet(req, { params: { id: "asm_1" } })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.assessmentId).toBe("asm_1");
    expect(json.data.score).toBe(86);
    expect(json.data.frameworkScores).toEqual([
      {
        frameworkId: "fw_1",
        frameworkCode: "GDPR",
        frameworkName: "GDPR",
        score: 100,
      },
      {
        frameworkId: "fw_2",
        frameworkCode: "ISO27001",
        frameworkName: "ISO 27001",
        score: 50,
      },
    ]);
  });

  it("returns 404 when assessment does not belong to current user", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/assessments/asm_404/score", {
      method: "GET",
    });

    const res = (await scoreGet(req, { params: { id: "asm_404" } })) as Response;

    expect(res.status).toBe(404);
    expect(prisma.assessmentItem.findMany).not.toHaveBeenCalled();
  });

  it("maps auth failures to 401", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/assessments/asm_1/score", {
      method: "GET",
    });

    const res = (await scoreGet(req, { params: { id: "asm_1" } })) as Response;

    expect(res.status).toBe(401);
  });
});
