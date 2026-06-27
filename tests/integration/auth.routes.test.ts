import { describe, it, expect, vi, beforeEach } from "vitest";

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { sendPasswordResetEmail } from "@/services/email-service";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";
import { GET as meGet } from "@/app/api/auth/me/route";
import { POST as forgotPasswordPost } from "@/app/api/auth/forgot-password/route";
import { POST as resetPasswordPost } from "@/app/api/auth/reset-password/route";
import { rateLimitByKey, isRateLimited } from "@/lib/rate-limiter";

vi.mock("@/lib/rate-limiter", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  rateLimitByKey: vi.fn().mockResolvedValue(false),
  isRateLimited: vi.fn().mockResolvedValue(false),
  incrementFailureCount: vi.fn().mockResolvedValue(undefined),
  resetAttempts: vi.fn().mockResolvedValue(undefined),
  RATE_LIMIT_CONFIGS: {
    auth: { name: "rl:auth", limit: 10, windowSeconds: 900 },
    sensitive: { name: "rl:sensitive", limit: 5, windowSeconds: 3600 },
    loginIpVolumetric: { name: "rl:login:ip:volumetric", limit: 20, windowSeconds: 60 },
    registerIp: { name: "rl:register:ip", limit: 50, windowSeconds: 900 },
    registerEmail: { name: "rl:register:email", limit: 5, windowSeconds: 3600 },
    registerAbuse: { name: "rl:register:abuse", limit: 10, windowSeconds: 900 },
  },
}));

vi.mock("@/lib/prisma", () => {
  const prismaMock = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(async (input: unknown) => {
      if (Array.isArray(input)) {
        return Promise.all(input);
      }

      if (typeof input === "function") {
        return input(prismaMock);
      }

      return null;
    }),
  };

  return {
    prisma: prismaMock,
  };
});

vi.mock("@/services/email-service", () => {
  return {
    sendPasswordResetEmail: vi.fn(),
  };
});

const mockedSendPasswordResetEmail = vi.mocked(sendPasswordResetEmail);

describe("Auth API routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(prisma, "$transaction").mockImplementation(async (input: unknown) => {
      if (Array.isArray(input)) {
        return Promise.all(input);
      }

      if (typeof input === "function") {
        return input(prisma);
      }

      return null;
    });
  });

  it("registers a new user", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null as never);
    vi.spyOn(prisma.user, "create").mockResolvedValue({
      id: "user_1",
      name: "Test User",
      email: "test@example.com",
      role: "USER",
    } as never);
    vi.spyOn(authHelpers, "hashPassword").mockResolvedValue("hashed" as never);

    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        companyName: "Test Company",
        email: "test@example.com",
        password: "StrongP@ssw0rd",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await registerPost(req)) as Response;
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.email).toBe("test@example.com");
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organizations: {
            create: {
              name: "Test Company",
            },
          },
        }),
      }),
    );
  });

  it("rejects invalid login credentials", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "missing@example.com",
        password: "StrongP@ssw0rd",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await loginPost(req)) as Response;
    expect(res.status).toBe(401);
  });

  it("returns 401 for /me when session is missing", async () => {
    vi.spyOn(authHelpers, "getSession").mockResolvedValue(null as never);

    const res = (await meGet()) as Response;
    expect(res.status).toBe(401);
  });

  it("supports logout", async () => {
    const res = (await logoutPost()) as Response;
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("returns generic forgot-password response when email does not exist", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: "missing@example.com",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await forgotPasswordPost(req)) as Response;
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.message).toBe(
      "If an account with that email exists, password reset instructions have been sent.",
    );
    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mockedSendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("creates a reset token and sends an email when account exists", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
      id: "user_1",
      email: "user@example.com",
      name: "Reset User",
    } as never);
    vi.spyOn(prisma.passwordResetToken, "updateMany").mockResolvedValue({ count: 1 } as never);
    vi.spyOn(prisma.passwordResetToken, "create").mockResolvedValue({
      id: "prt_1",
    } as never);

    const req = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: "user@example.com",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await forgotPasswordPost(req)) as Response;
    expect(res.status).toBe(200);
    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user_1",
          token: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      }),
    );
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        name: "Reset User",
        resetLink: expect.stringContaining("/reset-password?token="),
      }),
    );
  });

  it("returns success when email provider fails (mail send error)", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
      id: "user_2",
      email: "user2@example.com",
      name: "Failing User",
    } as never);
    vi.spyOn(prisma.passwordResetToken, "updateMany").mockResolvedValue({ count: 0 } as never);
    vi.spyOn(prisma.passwordResetToken, "create").mockResolvedValue({ id: "prt_fail" } as never);

    mockedSendPasswordResetEmail.mockRejectedValueOnce(new Error("mailer down"));

    const req = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: "user2@example.com",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await forgotPasswordPost(req)) as Response;
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    // token creation still attempted
    expect(prisma.passwordResetToken.create).toHaveBeenCalled();
    // email attempt was made and rejected, but endpoint returns generic success
    expect(mockedSendPasswordResetEmail).toHaveBeenCalled();
  });

  it("rejects reset-password when token is invalid", async () => {
    vi.spyOn(prisma.passwordResetToken, "findUnique").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "some-reset-token",
        password: "StrongP@ssw0rd",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await resetPasswordPost(req)) as Response;
    expect(res.status).toBe(400);
  });

  it("rejects reset-password when token is expired", async () => {
    vi.spyOn(prisma.passwordResetToken, "findUnique").mockResolvedValue({
      id: "prt_1",
      token: "hashed-token",
      userId: "user_1",
      usedAt: null,
      invalidatedAt: null,
      expiresAt: new Date(Date.now() - 5 * 60 * 1000),
      user: {
        id: "user_1",
        isActive: true,
      },
    } as never);

    const req = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "some-reset-token",
        password: "StrongP@ssw0rd",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await resetPasswordPost(req)) as Response;
    expect(res.status).toBe(400);
  });

  it("rejects reset-password when token has already been used", async () => {
    vi.spyOn(prisma.passwordResetToken, "findUnique").mockResolvedValue({
      id: "prt_2",
      token: "hashed-token",
      userId: "user_1",
      usedAt: new Date(),
      invalidatedAt: null,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      user: {
        id: "user_1",
        isActive: true,
      },
    } as never);

    const req = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "some-reset-token",
        password: "StrongP@ssw0rd",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await resetPasswordPost(req)) as Response;
    expect(res.status).toBe(400);
  });

  it("resets password successfully and invalidates other active tokens", async () => {
    vi.spyOn(prisma.passwordResetToken, "findUnique").mockResolvedValue({
      id: "prt_3",
      token: "hashed-token",
      userId: "user_1",
      usedAt: null,
      invalidatedAt: null,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      user: {
        id: "user_1",
        isActive: true,
      },
    } as never);
    vi.spyOn(authHelpers, "hashPassword").mockResolvedValue("new-hashed-password" as never);
    vi.spyOn(prisma.user, "update").mockResolvedValue({ id: "user_1" } as never);
    vi.spyOn(prisma.passwordResetToken, "update").mockResolvedValue({ id: "prt_3" } as never);
    vi.spyOn(prisma.passwordResetToken, "updateMany").mockResolvedValue({ count: 2 } as never);

    const req = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "some-reset-token",
        password: "StrongP@ssw0rd",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await resetPasswordPost(req)) as Response;
    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: { password: "new-hashed-password" },
    });
    expect(prisma.passwordResetToken.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "prt_3" },
        data: expect.objectContaining({
          usedAt: expect.any(Date),
        }),
      }),
    );
    expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user_1",
          usedAt: null,
          invalidatedAt: null,
        }),
        data: expect.objectContaining({
          invalidatedAt: expect.any(Date),
        }),
      }),
    );
  });

  describe("Concurrency & Lockout Defenses", () => {
    it("Concurrency Defense - Parallel auth sweeps do not exhaust server capacity", async () => {
      let callCount = 0;
      vi.mocked(rateLimitByKey).mockImplementation(async (key) => {
        if (key.includes("volumetric")) {
          callCount++;
          return callCount > 5;
        }
        return false;
      });

      const requests = Array.from({ length: 10 }, () =>
        loginPost(
          new Request("http://localhost/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: "user@example.com", password: "BadPassword123!" }),
            headers: { "Content-Type": "application/json" },
          }),
        ),
      );

      const responses = await Promise.all(requests);
      const rateLimitedCount = responses.filter((r) => r.status === 429).length;
      expect(rateLimitedCount).toBeGreaterThan(0);
    });

    it("Registration Abuse & Order of Operations - blocks abuse upfront without parsing", async () => {
      vi.mocked(isRateLimited).mockImplementation(async (key) => {
        if (key.includes("abuse")) {
          return true;
        }
        return false;
      });

      const req = new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: "faulty json string ...",
        headers: { "Content-Type": "application/json" },
      });

      const res = await registerPost(req);
      expect(res.status).toBe(429);
    });
  });
});
