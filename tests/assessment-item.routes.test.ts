import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { PATCH as assessmentItemPatch } from "@/app/api/assessments/[id]/items/[itemId]/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessment: {
        updateMany: vi.fn(),
      },
      assessmentItem: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  };
});

describe("Assessment item API route", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
    vi.spyOn(prisma, "$transaction").mockImplementation(async (callback) => {
      return await callback(prisma as never);
    });
  });

  it("updates assessment item and recalculates + persists score", async () => {
    vi.spyOn(prisma.assessmentItem, "findFirst").mockResolvedValue({
      id: "item_1",
      assessmentId: "asm_1",
    } as never);

    vi.spyOn(prisma.assessmentItem, "update").mockResolvedValue({
      id: "item_1",
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
        status: "NOT_COMPLIANT",
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
    ] as never);
    vi.spyOn(prisma.assessment, "updateMany").mockResolvedValue({ count: 1 } as never);

    const req = new Request("http://localhost/api/assessments/asm_1/items/item_1", {
      method: "PATCH",
      body: JSON.stringify({
        status: "COMPLIANT",
        comments: "Updated",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await assessmentItemPatch(req, {
      params: { id: "asm_1", itemId: "item_1" },
    })) as Response;

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ score: 50 });
    expect(prisma.assessment.updateMany).toHaveBeenCalledWith({
      where: { id: "asm_1" },
      data: { score: 50 },
    });
  });

  it("returns 404 when assessment item is not owned by user", async () => {
    vi.spyOn(prisma.assessmentItem, "findFirst").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/assessments/asm_1/items/missing", {
      method: "PATCH",
      body: JSON.stringify({ status: "COMPLIANT" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await assessmentItemPatch(req, {
      params: { id: "asm_1", itemId: "missing" },
    })) as Response;

    expect(res.status).toBe(404);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("returns 422 for empty payload", async () => {
    vi.spyOn(prisma.assessmentItem, "findFirst").mockResolvedValue({
      id: "item_1",
      assessmentId: "asm_1",
    } as never);

    const req = new Request("http://localhost/api/assessments/asm_1/items/item_1", {
      method: "PATCH",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await assessmentItemPatch(req, {
      params: { id: "asm_1", itemId: "item_1" },
    })) as Response;

    expect(res.status).toBe(422);
  });

  it("maps auth failures to 401", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/assessments/asm_1/items/item_1", {
      method: "PATCH",
      body: JSON.stringify({ status: "COMPLIANT" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await assessmentItemPatch(req, {
      params: { id: "asm_1", itemId: "item_1" },
    })) as Response;

    expect(res.status).toBe(401);
  });
});
