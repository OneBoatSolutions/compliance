import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GET as getAssessmentById } from "@/app/api/assessments/[id]/route";
import { GET as getAssessments, POST as createAssessment } from "@/app/api/assessments/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      organization: {
        findUnique: vi.fn(),
      },
      framework: {
        findMany: vi.fn(),
      },
      control: {
        findMany: vi.fn(),
      },
      assessment: {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      assessmentItem: {
        createMany: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  };
});

describe("Assessments API routes", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
    vi.spyOn(prisma, "$transaction").mockImplementation(async (callback) => {
      return await callback(prisma as never);
    });
  });

  it("creates an assessment with deduplicated framework IDs and bulk items", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: "user_1",
    } as never);

    vi.spyOn(prisma.framework, "findMany").mockResolvedValue([
      { id: "fw_1" },
      { id: "fw_2" },
    ] as never);

    vi.spyOn(prisma.control, "findMany").mockResolvedValue([
      { id: "ctrl_1" },
      { id: "ctrl_2" },
      { id: "ctrl_3" },
    ] as never);

    vi.spyOn(prisma.assessment, "create").mockResolvedValue({ id: "asm_1" } as never);
    vi.spyOn(prisma.assessmentItem, "createMany").mockResolvedValue({ count: 3 } as never);

    const req = new Request("http://localhost/api/assessments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: "cm8abcde0000000000000001",
        frameworkIds: [
          "cm8abcde0000000000000002",
          "cm8abcde0000000000000002",
          "cm8abcde0000000000000003",
        ],
      }),
    });

    const res = (await createAssessment(req)) as Response;
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.assessmentId).toBe("asm_1");
    expect(json.data.totalItems).toBe(3);
    expect(prisma.framework.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: {
            in: ["cm8abcde0000000000000002", "cm8abcde0000000000000003"],
          },
        },
      }),
    );
    expect(prisma.assessmentItem.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { assessmentId: "asm_1", controlId: "ctrl_1" },
          { assessmentId: "asm_1", controlId: "ctrl_2" },
          { assessmentId: "asm_1", controlId: "ctrl_3" },
        ],
      }),
    );
  });

  it("returns 400 when selected frameworks have no controls", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: "user_1",
    } as never);
    vi.spyOn(prisma.framework, "findMany").mockResolvedValue([{ id: "fw_1" }] as never);
    vi.spyOn(prisma.control, "findMany").mockResolvedValue([] as never);

    const req = new Request("http://localhost/api/assessments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: "cm8abcde0000000000000001",
        frameworkIds: ["cm8abcde0000000000000002"],
      }),
    });

    const res = (await createAssessment(req)) as Response;

    expect(res.status).toBe(400);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("returns 403 when organization is not owned by current user", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: "user_2",
    } as never);

    const req = new Request("http://localhost/api/assessments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: "cm8abcde0000000000000001",
        frameworkIds: ["cm8abcde0000000000000002"],
      }),
    });

    const res = (await createAssessment(req)) as Response;

    expect(res.status).toBe(403);
  });

  it("returns all assessments for current user", async () => {
    vi.spyOn(prisma.assessment, "findMany").mockResolvedValue([
      {
        id: "asm_2",
        status: "COMPLETED",
        score: 92,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        organizationId: "org_2",
      },
      {
        id: "asm_1",
        status: "IN_PROGRESS",
        score: null,
        createdAt: new Date("2026-03-31T00:00:00.000Z"),
        organizationId: "org_1",
      },
    ] as never);

    const req = new Request("http://localhost/api/assessments", {
      method: "GET",
    });

    const res = (await getAssessments(req)) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(2);
    expect(prisma.assessment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_1" },
        orderBy: { createdAt: "desc" },
      }),
    );
  });

  it("returns assessment detail with items, control, and framework", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({
      id: "asm_1",
      userId: "user_1",
      organizationId: "org_1",
      status: "IN_PROGRESS",
      score: null,
      createdAt: new Date("2026-03-31T00:00:00.000Z"),
      updatedAt: new Date("2026-03-31T00:00:00.000Z"),
      completedAt: null,
      items: [
        {
          id: "item_1",
          control: {
            id: "ctrl_1",
            code: "GDPR-1",
            title: "Control One",
            framework: {
              id: "fw_1",
              code: "GDPR",
              name: "GDPR",
            },
          },
        },
      ],
    } as never);

    const req = new Request("http://localhost/api/assessments/asm_1", {
      method: "GET",
    });

    const res = (await getAssessmentById(req, { params: { id: "asm_1" } })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe("asm_1");
    expect(json.data.items[0].control.framework.code).toBe("GDPR");
  });

  it("returns 404 for missing assessment detail", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/assessments/missing", {
      method: "GET",
    });

    const res = (await getAssessmentById(req, { params: { id: "missing" } })) as Response;

    expect(res.status).toBe(404);
  });

  it("maps auth failures to 401", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/assessments", {
      method: "GET",
    });

    const res = (await getAssessments(req)) as Response;

    expect(res.status).toBe(401);
  });
});
