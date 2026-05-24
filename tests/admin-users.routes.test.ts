import { Prisma } from "@prisma/client";
import { createHash } from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAdmin: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("@/services/email-service", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { sendPasswordResetEmail } from "@/services/email-service";
import { GET as listUsersGet, POST as createUserPost } from "@/app/api/admin/users/route";
import { PATCH as updateUserPatch } from "@/app/api/admin/users/[id]/route";
import { POST as resetPasswordPost } from "@/app/api/admin/users/[id]/reset-password/route";

const adminSession = { user: { id: "admin_1", role: "ADMIN" as const } };

const publicUser = {
  id: "user_1",
  email: "user@example.com",
  name: "Test User",
  role: "USER" as const,
  isActive: true,
  createdAt: new Date("2026-01-01"),
  lastLoginAt: null,
};

const validCreatePayload = {
  email: "new@example.com",
  name: "New User",
  role: "USER",
  password: "StrongP@ssw0rd",
};

describe("Admin Users API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authHelpers.requireAdmin).mockResolvedValue(adminSession as never);
    vi.mocked(authHelpers.hashPassword).mockResolvedValue("hashed_password");
    vi.mocked(prisma.$transaction).mockImplementation(async (arg) => {
      if (typeof arg === "function") {
        return arg(prisma as never);
      }
      return Promise.all(arg as Promise<unknown>[]);
    });
  });

  describe("authorization", () => {
    it("returns 403 when not admin on GET", async () => {
      vi.mocked(authHelpers.requireAdmin).mockRejectedValue(new Error("403: Forbidden"));

      const res = (await listUsersGet(new Request("http://localhost/api/admin/users"))) as Response;
      expect(res.status).toBe(403);
    });

    it("returns 401 when unauthenticated on POST", async () => {
      vi.mocked(authHelpers.requireAdmin).mockRejectedValue(new Error("401: Unauthorized"));

      const res = (await createUserPost(
        new Request("http://localhost/api/admin/users", {
          method: "POST",
          body: JSON.stringify(validCreatePayload),
          headers: { "Content-Type": "application/json" },
        }),
      )) as Response;

      expect(res.status).toBe(401);
    });

    it("returns 403 on PATCH when not admin", async () => {
      vi.mocked(authHelpers.requireAdmin).mockRejectedValue(new Error("403: Forbidden"));

      const res = (await updateUserPatch(
        new Request("http://localhost/api/admin/users/user_1", {
          method: "PATCH",
          body: JSON.stringify({ role: "USER" }),
          headers: { "Content-Type": "application/json" },
        }),
        { params: { id: "user_1" } },
      )) as Response;

      expect(res.status).toBe(403);
    });

    it("returns 401 on reset-password when unauthenticated", async () => {
      vi.mocked(authHelpers.requireAdmin).mockRejectedValue(new Error("401: Unauthorized"));

      const res = (await resetPasswordPost(
        new Request("http://localhost/api/admin/users/user_1/reset-password", {
          method: "POST",
        }),
        { params: { id: "user_1" } },
      )) as Response;

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/admin/users", () => {
    it("returns paginated users", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([publicUser] as never);
      vi.mocked(prisma.user.count).mockResolvedValue(25);

      const res = (await listUsersGet(
        new Request("http://localhost/api/admin/users?page=2&limit=10"),
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.items).toHaveLength(1);
      expect(json.data.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it("uses default page=1 and limit=20", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const res = (await listUsersGet(new Request("http://localhost/api/admin/users"))) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.meta).toMatchObject({ page: 1, limit: 20, total: 0, totalPages: 1 });
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it("filters by role", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const res = (await listUsersGet(
        new Request("http://localhost/api/admin/users?role=ADMIN"),
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: "ADMIN",
          }),
        }),
      );
    });

    it("filters by isActive status", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const res = (await listUsersGet(
        new Request("http://localhost/api/admin/users?isActive=false"),
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: false,
          }),
        }),
      );
    });

    it("filters by search, role and isActive combined", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const res = (await listUsersGet(
        new Request("http://localhost/api/admin/users?search=bob&role=USER&isActive=true"),
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { email: { contains: "bob", mode: "insensitive" } },
              { name: { contains: "bob", mode: "insensitive" } },
            ],
            role: "USER",
            isActive: true,
          },
        }),
      );
    });
  });

  describe("POST /api/admin/users", () => {
    it("creates a user with valid payload", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(publicUser as never);

      const res = (await createUserPost(
        new Request("http://localhost/api/admin/users", {
          method: "POST",
          body: JSON.stringify(validCreatePayload),
          headers: { "Content-Type": "application/json" },
        }),
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.email).toBe("user@example.com");
      expect(authHelpers.hashPassword).toHaveBeenCalledWith("StrongP@ssw0rd");
    });

    it("returns 409 for duplicate email", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" } as never);

      const res = (await createUserPost(
        new Request("http://localhost/api/admin/users", {
          method: "POST",
          body: JSON.stringify(validCreatePayload),
          headers: { "Content-Type": "application/json" },
        }),
      )) as Response;

      expect(res.status).toBe(409);
    });

    it("returns 422 for invalid payload", async () => {
      const res = (await createUserPost(
        new Request("http://localhost/api/admin/users", {
          method: "POST",
          body: JSON.stringify({ email: "not-an-email" }),
          headers: { "Content-Type": "application/json" },
        }),
      )) as Response;

      expect(res.status).toBe(422);
    });
  });

  describe("PATCH /api/admin/users/:id", () => {
    it("rejects self demotion", async () => {
      const res = (await updateUserPatch(
        new Request("http://localhost/api/admin/users/admin_1", {
          method: "PATCH",
          body: JSON.stringify({ role: "USER" }),
          headers: { "Content-Type": "application/json" },
        }),
        { params: { id: "admin_1" } },
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("own account");
    });

    it("rejects self deactivation", async () => {
      const res = (await updateUserPatch(
        new Request("http://localhost/api/admin/users/admin_1", {
          method: "PATCH",
          body: JSON.stringify({ isActive: false }),
          headers: { "Content-Type": "application/json" },
        }),
        { params: { id: "admin_1" } },
      )) as Response;

      expect(res.status).toBe(400);
    });

    it("rejects demoting the last admin", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        role: "ADMIN",
        isActive: true,
      } as never);
      vi.mocked(prisma.user.count).mockResolvedValue(1);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...publicUser,
        role: "USER",
      } as never);

      const res = (await updateUserPatch(
        new Request("http://localhost/api/admin/users/admin_only", {
          method: "PATCH",
          body: JSON.stringify({ role: "USER" }),
          headers: { "Content-Type": "application/json" },
        }),
        { params: { id: "admin_only" } },
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("last admin");
      expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    });

    it("rejects deactivating the last admin", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        role: "ADMIN",
        isActive: true,
      } as never);
      vi.mocked(prisma.user.count).mockResolvedValue(1);

      const res = (await updateUserPatch(
        new Request("http://localhost/api/admin/users/admin_only", {
          method: "PATCH",
          body: JSON.stringify({ isActive: false }),
          headers: { "Content-Type": "application/json" },
        }),
        { params: { id: "admin_only" } },
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("last admin");
      expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    });

    it("updates user successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        role: "USER",
        isActive: true,
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...publicUser,
        name: "Updated Name",
      } as never);

      const res = (await updateUserPatch(
        new Request("http://localhost/api/admin/users/user_1", {
          method: "PATCH",
          body: JSON.stringify({ role: "USER" }),
          headers: { "Content-Type": "application/json" },
        }),
        { params: { id: "user_1" } },
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.name).toBe("Updated Name");
    });
  });

  describe("POST /api/admin/users/:id/reset-password", () => {
    it("returns 404 when user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const res = (await resetPasswordPost(
        new Request("http://localhost/api/admin/users/missing/reset-password", {
          method: "POST",
        }),
        { params: { id: "missing" } },
      )) as Response;

      expect(res.status).toBe(404);
    });

    it("creates token, invalidates prior tokens, and sends email", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user_1",
        email: "user@example.com",
        name: "Test User",
      } as never);
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "token_1",
        token: "abc",
        userId: "user_1",
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const res = (await resetPasswordPost(
        new Request("http://localhost/api/admin/users/user_1/reset-password", {
          method: "POST",
        }),
        { params: { id: "user_1" } },
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.message).toContain("sent");
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalled();
      expect(prisma.passwordResetToken.create).toHaveBeenCalled();
      const createArg = vi.mocked(prisma.passwordResetToken.create).mock.calls[0]?.[0] as {
        data: { token: string };
      };
      const emailPayload = vi.mocked(sendPasswordResetEmail).mock.calls[0]?.[0];
      const plaintextToken = new URL(emailPayload!.resetLink).searchParams.get("token");

      expect(plaintextToken).toBeTruthy();
      expect(createArg.data.token).toBe(createHash("sha256").update(plaintextToken!).digest("hex"));
      expect(createArg.data.token).not.toBe(plaintextToken);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@example.com",
          resetLink: expect.stringContaining(`token=${plaintextToken}`),
        }),
      );
    });

    it("does not return the reset token in the API response", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user_1",
        email: "user@example.com",
        name: "Test User",
      } as never);
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "token_1",
        token: "hashed",
        userId: "user_1",
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const res = (await resetPasswordPost(
        new Request("http://localhost/api/admin/users/user_1/reset-password", {
          method: "POST",
        }),
        { params: { id: "user_1" } },
      )) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual({ message: "Password reset email sent" });
      expect(json.data).not.toHaveProperty("token");
      expect(JSON.stringify(json)).not.toMatch(/token=/);
    });
  });
});
