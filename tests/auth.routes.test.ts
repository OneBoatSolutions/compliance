import { describe, it, expect, vi, beforeEach } from "vitest";

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";
import { GET as meGet } from "@/app/api/auth/me/route";
import { POST as forgotPasswordPost } from "@/app/api/auth/forgot-password/route";
import { POST as resetPasswordPost } from "@/app/api/auth/reset-password/route";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => cb(mockPrisma)),
  };
  return {
    prisma: mockPrisma,
  };
});

vi.mock("@/lib/rate-limiter", () => {
  return {
    rateLimit: vi.fn().mockResolvedValue(null),
    rateLimitByUser: vi.fn().mockResolvedValue(null),
    rateLimitByKey: vi.fn().mockResolvedValue(false),
    RATE_LIMIT_CONFIGS: {
      auth: { name: "auth", limit: 10, windowSeconds: 60 },
      sensitive: { name: "sensitive", limit: 5, windowSeconds: 60 },
    },
  };
});

describe("Auth API routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
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
        companyName: "Acme Corp",
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

  it("accepts forgot-password payload", async () => {
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
  });

  it("accepts reset-password payload", async () => {
    vi.spyOn(prisma.passwordResetToken, "findUnique").mockResolvedValue({
      id: "token_1",
      userId: "user_1",
      expiresAt: new Date(Date.now() + 3600 * 1000),
      usedAt: null,
      invalidatedAt: null,
      user: {
        id: "user_1",
        isActive: true,
      },
    } as never);
    vi.spyOn(authHelpers, "hashPassword").mockResolvedValue("hashed" as never);

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
  });
});
