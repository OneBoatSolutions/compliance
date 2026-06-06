import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed"),
  verifyPassword: vi.fn().mockResolvedValue(true),
  getSession: vi.fn(),
}));

vi.mock("@/lib/rate-limits", () => ({
  isLocked: vi.fn().mockReturnValue(false),
  recordFailedAttempt: vi.fn(),
  resetAttempts: vi.fn(),
}));

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { isLocked } from "@/lib/rate-limits";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { GET as meGet } from "@/app/api/auth/me/route";

describe("Auth routes: success paths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isLocked).mockReturnValue(false);
  });

  describe("POST /api/auth/login", () => {
    it("returns user and updates lastLoginAt on valid credentials", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "Alice",
        role: "USER",
        password: "hashed",
        isActive: true,
      } as never);
      vi.mocked(authHelpers.verifyPassword).mockResolvedValue(true as never);
      vi.mocked(prisma.user.update).mockResolvedValue({ id: "u1" } as never);

      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "StrongP@ssw0rd" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await loginPost(req)) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.user.email).toBe("a@b.com");
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "u1" },
          data: { lastLoginAt: expect.any(Date) },
        }),
      );
    });

    it("returns 401 on wrong password", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "Alice",
        role: "USER",
        password: "hashed",
        isActive: true,
      } as never);
      vi.mocked(authHelpers.verifyPassword).mockResolvedValue(false as never);

      // Password must be valid per schema; we'll just rely on the verifyPassword mock to fail it
      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "WrongP@ssw0rd" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await loginPost(req)) as Response;
      expect(res.status).toBe(401);
    });

    it("returns 422 for invalid login payload", async () => {
      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "not-an-email" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await loginPost(req)) as Response;
      expect(res.status).toBe(422);
    });

    it("returns 429 when account is locked", async () => {
      vi.mocked(isLocked).mockReturnValue(true);

      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "StrongP@ssw0rd" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await loginPost(req)) as Response;
      expect(res.status).toBe(429);
    });

    it("returns 401 when user is not active", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "Alice",
        role: "USER",
        password: "hashed",
        isActive: false,
      } as never);

      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "StrongP@ssw0rd" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await loginPost(req)) as Response;
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/register", () => {
    it("creates a new user with organization", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: "u1",
        name: "New",
        email: "new@b.com",
        role: "USER",
      } as never);

      const req = new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: "New",
          companyName: "Acme",
          email: "new@b.com",
          password: "StrongP@ssw0rd",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await registerPost(req)) as Response;
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.email).toBe("new@b.com");
    });

    it("returns 409 on duplicate email", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" } as never);

      const req = new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: "New",
          companyName: "Acme",
          email: "duplicate@b.com",
          password: "StrongP@ssw0rd",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await registerPost(req)) as Response;
      expect(res.status).toBe(409);
    });

    it("returns 422 for invalid register payload", async () => {
      const req = new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: "not-an-email" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = (await registerPost(req)) as Response;
      expect(res.status).toBe(422);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns the current session user", async () => {
      vi.mocked(authHelpers.getSession).mockResolvedValue({
        user: {
          id: "u1",
          email: "a@b.com",
          name: "Alice",
          role: "USER",
        },
        expires: new Date(Date.now() + 3600_000).toISOString(),
      } as never);

      const res = (await meGet()) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("u1");
      expect(json.data.email).toBe("a@b.com");
    });

    it("returns 401 when session is missing", async () => {
      vi.mocked(authHelpers.getSession).mockResolvedValue(null as never);

      const res = (await meGet()) as Response;
      expect(res.status).toBe(401);
    });
  });
});
