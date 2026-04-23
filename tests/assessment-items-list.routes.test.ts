import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authHelpers from "@/lib/auth-helpers";
import { GET as listAssessmentItems } from "@/app/api/assessments/[id]/items/route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessment: {
        findFirst: vi.fn(),
      },
      assessmentItem: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
    },
  };
});

describe("Assessment items list API route", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
  });

  it("returns paginated list with defaults", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({ id: "asm_1" } as never);
    vi.spyOn(prisma.assessmentItem, "findMany").mockResolvedValue([
      {
        id: "item_1",
        status: "NOT_COMPLIANT",
        comments: "Missing policy",
        owner: null,
        targetDate: null,
        remarks: null,
        evidenceNotes: null,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        updatedAt: new Date("2026-04-02T00:00:00.000Z"),
        control: {
          id: "ctrl_1",
          code: "GDPR-1",
          title: "Data policy",
          severity: "CRITICAL",
          weight: 1,
          framework: {
            id: "fw_1",
            code: "GDPR",
            name: "GDPR",
          },
        },
      },
    ] as never);
    vi.spyOn(prisma.assessmentItem, "count").mockResolvedValue(1);

    const req = new Request("http://localhost/api/assessments/asm_1/items", { method: "GET" });
    const res = (await listAssessmentItems(req, { params: { id: "asm_1" } })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.items).toHaveLength(1);
    expect(json.data.meta).toEqual({
      total: 1,
      page: 1,
      limit: 50,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });

    expect(prisma.assessmentItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 50,
        orderBy: [{ control: { severity: "desc" } }, { updatedAt: "desc" }],
      }),
    );
  });

  it("applies filters and search on code/title/comments", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({ id: "asm_1" } as never);
    vi.spyOn(prisma.assessmentItem, "findMany").mockResolvedValue([] as never);
    vi.spyOn(prisma.assessmentItem, "count").mockResolvedValue(0);

    const req = new Request(
      "http://localhost/api/assessments/asm_1/items?status=NOT_COMPLIANT&status=NOT_STARTED&framework=cm8abcde0000000000000002&framework=cm8abcde0000000000000003&severity=CRITICAL&severity=HIGH&search=policy&page=2&limit=10&sortBy=updatedAt&sortOrder=asc",
      { method: "GET" },
    );

    const res = (await listAssessmentItems(req, { params: { id: "asm_1" } })) as Response;

    expect(res.status).toBe(200);
    expect(prisma.assessmentItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          assessmentId: "asm_1",
          status: {
            in: ["NOT_COMPLIANT", "NOT_STARTED"],
          },
          control: {
            frameworkId: {
              in: ["cm8abcde0000000000000002", "cm8abcde0000000000000003"],
            },
            severity: {
              in: ["CRITICAL", "HIGH"],
            },
          },
          OR: [
            { comments: { contains: "policy", mode: "insensitive" } },
            { control: { code: { contains: "policy", mode: "insensitive" } } },
            { control: { title: { contains: "policy", mode: "insensitive" } } },
          ],
        },
        skip: 10,
        take: 10,
        orderBy: [{ updatedAt: "asc" }],
      }),
    );
  });

  it("returns 404 when assessment is not owned by user", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/assessments/asm_404/items", { method: "GET" });
    const res = (await listAssessmentItems(req, { params: { id: "asm_404" } })) as Response;

    expect(res.status).toBe(404);
    expect(prisma.assessmentItem.findMany).not.toHaveBeenCalled();
  });

  it("returns 422 for invalid query", async () => {
    vi.spyOn(prisma.assessment, "findFirst").mockResolvedValue({ id: "asm_1" } as never);

    const req = new Request("http://localhost/api/assessments/asm_1/items?limit=1000", {
      method: "GET",
    });
    const res = (await listAssessmentItems(req, { params: { id: "asm_1" } })) as Response;

    expect(res.status).toBe(422);
  });
});
