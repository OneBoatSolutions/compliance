import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    assessmentItem: { count: vi.fn() },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAdmin: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { POST as createFrameworkPost } from "@/app/api/frameworks/route";
import { GET as getFramework, PATCH as updateFramework } from "@/app/api/frameworks/[id]/route";

const adminSession = { user: { id: "admin_1", role: "ADMIN" as const } };

describe("Frameworks admin API: POST + PATCH/GET [id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHelpers.requireAdmin).mockResolvedValue(adminSession as never);
  });

  describe("POST /api/frameworks", () => {
    it("creates a new framework with valid payload", async () => {
      vi.mocked(prisma.framework.create).mockResolvedValue({
        id: "fw_new",
        code: "ISO27001",
        name: "ISO 27001",
        description: "InfoSec",
        region: "Global",
        category: "Security",
        version: "1.0.0",
        effectiveDate: new Date(),
        sourceLink: null,
        status: "DRAFT",
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const req = new Request("http://localhost/api/frameworks", {
        method: "POST",
        body: JSON.stringify({
          code: "ISO27001",
          name: "ISO 27001",
          description: "InfoSec",
          region: "Global",
          category: "Security",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await createFrameworkPost(req)) as Response;
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.code).toBe("ISO27001");
      expect(json.data.status).toBe("DRAFT");
    });

    it("returns 422 for invalid payload", async () => {
      const req = new Request("http://localhost/api/frameworks", {
        method: "POST",
        body: JSON.stringify({ code: "" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await createFrameworkPost(req)) as Response;
      expect(res.status).toBe(422);
    });

    it("returns 409 on duplicate code (P2002)", async () => {
      // Build a PrismaClientKnownRequestError-like object via duck-typing
      // (Prisma's constructor has a different signature in v7+)
      const err = Object.create(Error.prototype, {
        name: { value: "PrismaClientKnownRequestError" },
        code: { value: "P2002" },
        message: { value: "Unique constraint failed on the fields: (`code`)" },
      });
      vi.mocked(prisma.framework.create).mockRejectedValue(err);

      const req = new Request("http://localhost/api/frameworks", {
        method: "POST",
        body: JSON.stringify({
          code: "DUPLICATE",
          name: "Test",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await createFrameworkPost(req)) as Response;
      expect(res.status).toBe(409);
    });
  });

  describe("GET /api/frameworks/[id]", () => {
    it("returns framework with controls", async () => {
      vi.mocked(prisma.framework.findUnique).mockResolvedValue({
        id: "fw_1",
        code: "GDPR",
        name: "GDPR",
        description: "",
        region: "",
        category: "",
        version: "1.0.0",
        effectiveDate: new Date(),
        sourceLink: null,
        status: "PUBLISHED",
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        controls: [],
      } as never);

      const req = new Request("http://localhost/api/frameworks/fw_1");
      const res = (await getFramework(req, {
        params: Promise.resolve({ id: "fw_1" }),
      })) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("fw_1");
    });
  });

  describe("PATCH /api/frameworks/[id]", () => {
    it("updates a DRAFT framework", async () => {
      vi.mocked(prisma.framework.findUnique).mockResolvedValue({
        id: "fw_1",
        status: "DRAFT",
      } as never);

      vi.mocked(prisma.framework.update).mockResolvedValue({
        id: "fw_1",
        code: "GDPR",
        name: "GDPR Updated",
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
      } as never);

      const req = new Request("http://localhost/api/frameworks/fw_1", {
        method: "PATCH",
        body: JSON.stringify({ name: "GDPR Updated" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await updateFramework(req, {
        params: Promise.resolve({ id: "fw_1" }),
      })) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.name).toBe("GDPR Updated");
    });

    it("returns 404 when framework not found", async () => {
      vi.mocked(prisma.framework.findUnique).mockResolvedValue(null);

      const req = new Request("http://localhost/api/frameworks/missing", {
        method: "PATCH",
        body: JSON.stringify({ name: "Updated" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await updateFramework(req, {
        params: Promise.resolve({ id: "missing" }),
      })) as Response;
      expect(res.status).toBe(404);
    });

    it("returns 403 when editing published framework except to archive", async () => {
      vi.mocked(prisma.framework.findUnique).mockResolvedValue({
        id: "fw_1",
        status: "PUBLISHED",
      } as never);

      const req = new Request("http://localhost/api/frameworks/fw_1", {
        method: "PATCH",
        body: JSON.stringify({ name: "Updated" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await updateFramework(req, {
        params: Promise.resolve({ id: "fw_1" }),
      })) as Response;
      expect(res.status).toBe(403);
    });

    it("allows archiving a published framework", async () => {
      vi.mocked(prisma.framework.findUnique).mockResolvedValue({
        id: "fw_1",
        status: "PUBLISHED",
      } as never);

      vi.mocked(prisma.framework.update).mockResolvedValue({
        id: "fw_1",
        code: "GDPR",
        name: "GDPR",
        description: "",
        region: "",
        category: "",
        version: "1.0.0",
        effectiveDate: new Date(),
        sourceLink: null,
        status: "ARCHIVED",
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const req = new Request("http://localhost/api/frameworks/fw_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "ARCHIVED" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await updateFramework(req, {
        params: Promise.resolve({ id: "fw_1" }),
      })) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.status).toBe("ARCHIVED");
    });

    it("returns 422 for invalid PATCH body", async () => {
      vi.mocked(prisma.framework.findUnique).mockResolvedValue({
        id: "fw_1",
        status: "DRAFT",
      } as never);

      const req = new Request("http://localhost/api/frameworks/fw_1", {
        method: "PATCH",
        body: JSON.stringify({ code: 12345 }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await updateFramework(req, {
        params: Promise.resolve({ id: "fw_1" }),
      })) as Response;
      expect(res.status).toBe(422);
    });
  });
});
