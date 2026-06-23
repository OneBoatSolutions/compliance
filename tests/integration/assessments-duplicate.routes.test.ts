import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { POST as duplicateAssessment } from "@/app/api/assessments/[id]/duplicate/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessment: {
        findFirst: vi.fn(),
      },
      control: {
        findMany: vi.fn(),
      },
      assessmentItem: {
        createMany: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  };
});

describe("Assessment duplicate API route", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
    vi.spyOn(prisma, "$transaction").mockImplementation(async (callback) => {
      return await callback({
        assessment: { create: vi.fn().mockResolvedValue({ id: "asm_copy" }) },
        assessmentItem: { createMany: vi.fn().mockResolvedValue({ count: 3 }) },
      } as never);
    });
  });

  it("duplicates an assessment with its frameworks and controls", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({
      id: "asm_1",
      organizationId: "org_1",
      items: [{ control: { frameworkId: "fw_1" } }, { control: { frameworkId: "fw_2" } }],
    } as never);
    vi.spyOn(prisma.control, "findMany").mockResolvedValue([
      { id: "ctrl_1" },
      { id: "ctrl_2" },
      { id: "ctrl_3" },
    ] as never);

    const req = new Request("http://localhost/api/assessments/asm_1/duplicate", {
      method: "POST",
    });

    const res = (await duplicateAssessment(req, {
      params: Promise.resolve({ id: "asm_1" }),
    })) as Response;
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.assessmentId).toBe("asm_copy");
  });

  it("returns 404 when source assessment not found", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/assessments/missing/duplicate", {
      method: "POST",
    });

    const res = (await duplicateAssessment(req, {
      params: Promise.resolve({ id: "missing" }),
    })) as Response;
    expect(res.status).toBe(404);
  });

  it("returns 400 when assessment has no items with frameworks", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({
      id: "asm_empty",
      organizationId: "org_1",
      items: [],
    } as never);

    const req = new Request("http://localhost/api/assessments/asm_empty/duplicate", {
      method: "POST",
    });

    const res = (await duplicateAssessment(req, {
      params: Promise.resolve({ id: "asm_empty" }),
    })) as Response;
    expect(res.status).toBe(400);
  });

  it("returns 401 when unauthenticated", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/assessments/asm_1/duplicate", {
      method: "POST",
    });

    const res = (await duplicateAssessment(req, {
      params: Promise.resolve({ id: "asm_1" }),
    })) as Response;
    expect(res.status).toBe(401);
  });
});
