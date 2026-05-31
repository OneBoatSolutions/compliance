import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    control: {
      count: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    assessmentItem: {
      count: vi.fn(),
    },
    $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAdmin: vi.fn(),
}));

import { GET as listFrameworks } from "@/app/api/frameworks/route";
import { DELETE as deleteFramework, GET as getFramework } from "@/app/api/frameworks/[id]/route";
import { POST as publishFramework } from "@/app/api/frameworks/[id]/publish/route";
import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";

const adminSession = { user: { id: "admin_1", role: "ADMIN" as const } };

describe("Framework Admin API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authHelpers.requireAdmin).mockResolvedValue(adminSession as never);
  });

  it("GET /api/frameworks returns list with meta", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      {
        id: "fw1",
        code: "GDPR",
        name: "GDPR",
        description: "",
        region: "",
        category: "",
        version: "1.0.0",
        effectiveDate: new Date(),
        sourceLink: null,
        status: "DRAFT",
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { controls: 5 },
      },
    ] as never);
    vi.mocked(prisma.framework.count).mockResolvedValue(1);
    vi.mocked(prisma.framework.groupBy).mockResolvedValue([
      { status: "DRAFT", _count: { status: 1 } },
    ] as never);

    const res = (await listFrameworks(
      new Request("http://localhost/api/frameworks?page=1&limit=20"),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.items).toHaveLength(1);
    expect(json.data.meta).toEqual({
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  });

  it("GET /api/frameworks applies search filter", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.framework.count).mockResolvedValue(0);
    vi.mocked(prisma.framework.groupBy).mockResolvedValue([] as never);

    await listFrameworks(
      new Request("http://localhost/api/frameworks?search=gdpr&page=1&limit=10"),
    );

    expect(prisma.framework.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: "gdpr", mode: "insensitive" } }),
          ]),
        }),
      }),
    );
  });

  it("GET /api/frameworks returns 401 when not admin", async () => {
    vi.spyOn(authHelpers, "requireAdmin").mockRejectedValue(new Error("401: Unauthorized"));

    const res = (await listFrameworks(new Request("http://localhost/api/frameworks"))) as Response;

    expect(res.status).toBe(401);
  });

  it("GET /api/frameworks/[id] returns 404 when missing", async () => {
    vi.mocked(prisma.framework.findUnique).mockResolvedValue(null);

    const res = (await getFramework(new Request("http://localhost/api/frameworks/x"), {
      params: { id: "x" },
    })) as Response;

    expect(res.status).toBe(404);
  });

  it("DELETE /api/frameworks/[id] returns 409 when framework is in use", async () => {
    vi.mocked(prisma.framework.findUnique).mockResolvedValue({ id: "fw1" } as never);
    vi.mocked(prisma.assessmentItem.count).mockResolvedValue(3);

    const res = (await deleteFramework(new Request("http://localhost/api/frameworks/fw1"), {
      params: { id: "fw1" },
    })) as Response;

    expect(res.status).toBe(409);
  });

  it("DELETE /api/frameworks/[id] succeeds when not in use", async () => {
    vi.mocked(prisma.framework.findUnique).mockResolvedValue({ id: "fw1" } as never);
    vi.mocked(prisma.assessmentItem.count).mockResolvedValue(0);
    vi.mocked(prisma.framework.delete).mockResolvedValue({} as never);

    const res = (await deleteFramework(new Request("http://localhost/api/frameworks/fw1"), {
      params: { id: "fw1" },
    })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.deleted).toBe(true);
    expect(prisma.framework.delete).toHaveBeenCalledWith({ where: { id: "fw1" } });
  });

  it("POST /api/frameworks/[id]/publish returns 422 when no controls", async () => {
    vi.mocked(prisma.framework.findUnique).mockResolvedValue({
      id: "fw1",
      code: "X",
      name: "X",
      description: "A test framework",
      status: "DRAFT",
    } as never);
    vi.mocked(prisma.control.count).mockResolvedValue(0);

    const res = (await publishFramework(
      new Request("http://localhost/api/frameworks/fw1/publish", { method: "POST" }),
      { params: { id: "fw1" } },
    )) as Response;

    expect(res.status).toBe(422);
  });

  it("POST /api/frameworks/[id]/publish updates to PUBLISHED", async () => {
    const publishedAt = new Date();
    vi.mocked(prisma.framework.findUnique).mockResolvedValue({
      id: "fw1",
      code: "X",
      name: "X",
      description: "A test framework",
      status: "DRAFT",
    } as never);
    vi.mocked(prisma.control.count).mockResolvedValue(2);
    vi.mocked(prisma.framework.update).mockResolvedValue({
      id: "fw1",
      code: "X",
      name: "X",
      description: "",
      region: "",
      category: "",
      version: "1.0.0",
      effectiveDate: new Date(),
      sourceLink: null,
      status: "PUBLISHED",
      publishedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const res = (await publishFramework(
      new Request("http://localhost/api/frameworks/fw1/publish", { method: "POST" }),
      { params: { id: "fw1" } },
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("PUBLISHED");
    expect(prisma.framework.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "fw1" },
        data: expect.objectContaining({ status: "PUBLISHED" }),
      }),
    );
  });
});
