import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth/providers/credentials", () => {
  return {
    default: (config: { name?: string; authorize?: unknown }) => ({
      id: "credentials",
      name: config?.name ?? "Credentials",
      type: "credentials",
      authorize: config?.authorize,
      options: config,
    }),
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("@/lib/rate-limiter", () => ({
  rateLimitByKey: vi.fn(),
  isRateLimited: vi.fn(),
  incrementFailureCount: vi.fn(),
  resetAttempts: vi.fn(),
  RATE_LIMIT_CONFIGS: {
    auth: { name: "rl:auth", limit: 10, windowSeconds: 900 },
    sensitive: { name: "rl:sensitive", limit: 5, windowSeconds: 3600 },
    loginIpVolumetric: { name: "rl:login:ip:volumetric", limit: 20, windowSeconds: 60 },
    registerIp: { name: "rl:register:ip", limit: 50, windowSeconds: 900 },
    registerEmail: { name: "rl:register:email", limit: 5, windowSeconds: 3600 },
    registerAbuse: { name: "rl:register:abuse", limit: 10, windowSeconds: 900 },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue("127.0.0.1"),
  }),
}));

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import {
  rateLimitByKey,
  isRateLimited,
  incrementFailureCount,
  resetAttempts,
} from "@/lib/rate-limiter";
import { authOptions } from "@/lib/auth";

describe("auth.ts: next-auth configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(rateLimitByKey).mockResolvedValue(false);
    vi.mocked(isRateLimited).mockResolvedValue(false);
    vi.mocked(incrementFailureCount).mockResolvedValue(undefined);
    vi.mocked(resetAttempts).mockResolvedValue(undefined);
  });

  it("configures jwt session strategy with 7-day max age", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
    expect(authOptions.session?.maxAge).toBe(60 * 60 * 24 * 7);
  });

  it("registers Credentials provider", () => {
    expect(Array.isArray(authOptions.providers)).toBe(true);
    expect(authOptions.providers.length).toBeGreaterThanOrEqual(1);
  });

  it("jwt callback copies user.id and user.role into token on first sign-in", async () => {
    const jwt = authOptions.callbacks?.jwt;
    expect(jwt).toBeDefined();

    const result = await jwt!({
      token: { sub: undefined },
      user: { id: "u1", role: "ADMIN" } as never,
    } as never);

    expect(result.userId).toBe("u1");
    expect(result.role).toBe("ADMIN");
  });

  it("jwt callback leaves token unchanged when no user is provided", async () => {
    const jwt = authOptions.callbacks?.jwt;
    expect(jwt).toBeDefined();

    const initialToken = { userId: "existing", role: "USER" };
    const result = await jwt!({ token: initialToken } as never);

    expect(result).toBe(initialToken);
  });

  it("session callback hydrates session.user from token", async () => {
    const sessionCallback = authOptions.callbacks?.session;
    expect(sessionCallback).toBeDefined();

    const session = {
      user: { id: "old", role: "USER" } as Record<string, unknown>,
    };
    const token = { userId: "u1", role: "ADMIN" } as Record<string, unknown>;

    const result = (await sessionCallback!({
      session,
      token,
    } as never)) as { user: { id: string; role: string } };

    expect(result.user.id).toBe("u1");
    expect(result.user.role).toBe("ADMIN");
  });

  it("session callback leaves session unchanged when no user", async () => {
    const sessionCallback = authOptions.callbacks?.session;
    expect(sessionCallback).toBeDefined();

    const session = {} as Record<string, unknown>;
    const token = { userId: "u1", role: "ADMIN" } as Record<string, unknown>;

    const result = (await sessionCallback!({
      session,
      token,
    } as never)) as { user?: { id: string; role: string } };

    expect(result.user).toBeUndefined();
  });

  describe("credentials authorize()", () => {
    const getAuthorize = () => {
      const provider = authOptions.providers[0] as unknown as {
        authorize?: (c: unknown, r: unknown) => Promise<unknown>;
      };
      return provider.authorize;
    };

    it("throws when credentials are missing", async () => {
      const fn = getAuthorize();
      await expect(fn!(undefined, {})).rejects.toThrow("Missing credentials");
    });

    it("throws when only email is provided", async () => {
      const fn = getAuthorize();
      await expect(fn!({ email: "a@b.com" }, {})).rejects.toThrow("Missing credentials");
    });

    it("throws when identifier is locked", async () => {
      vi.mocked(isRateLimited).mockResolvedValue(true);
      const fn = getAuthorize();

      await expect(
        fn!(
          { email: "a@b.com", password: "secret" },
          { headers: { "x-forwarded-for": "127.0.0.1" } },
        ),
      ).rejects.toThrow("Too many failed login attempts");
    });

    it("throws when user is not found", async () => {
      vi.mocked(rateLimitByKey).mockResolvedValue(false);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      const fn = getAuthorize();

      await expect(fn!({ email: "missing@b.com", password: "secret" }, {})).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("throws when user is inactive", async () => {
      vi.mocked(rateLimitByKey).mockResolvedValue(false);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "User",
        role: "USER",
        password: "hash",
        isActive: false,
      } as never);
      const fn = getAuthorize();

      await expect(fn!({ email: "a@b.com", password: "secret" }, {})).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("throws when password does not match", async () => {
      vi.mocked(rateLimitByKey).mockResolvedValue(false);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "User",
        role: "USER",
        password: "hash",
        isActive: true,
      } as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      const fn = getAuthorize();

      await expect(fn!({ email: "a@b.com", password: "wrong" }, {})).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("returns user object on valid credentials and updates lastLoginAt", async () => {
      vi.mocked(rateLimitByKey).mockResolvedValue(false);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "Alice",
        role: "ADMIN",
        password: "hash",
        isActive: true,
      } as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(prisma.user.update).mockResolvedValue({} as never);
      const fn = getAuthorize();

      const result = await fn!(
        { email: "a@b.com", password: "secret" },
        { headers: { "x-forwarded-for": "10.0.0.1, 10.0.0.2" } },
      );

      expect(result).toEqual({
        id: "u1",
        email: "a@b.com",
        name: "Alice",
        role: "ADMIN",
      });
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "u1" },
          data: { lastLoginAt: expect.any(Date) },
        }),
      );
    });

    it("falls back to unknown-ip when no x-forwarded-for header is present", async () => {
      vi.mocked(rateLimitByKey).mockResolvedValue(false);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      const fn = getAuthorize();

      await expect(fn!({ email: "a@b.com", password: "secret" }, { headers: {} })).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("throws when volumetric IP limit is exceeded", async () => {
      vi.mocked(rateLimitByKey).mockImplementation(async (key) => {
        if (key.includes("volumetric")) {
          return true;
        }
        return false;
      });
      const fn = getAuthorize();

      await expect(
        fn!(
          { email: "a@b.com", password: "secret" },
          { headers: { "x-forwarded-for": "127.0.0.1" } },
        ),
      ).rejects.toThrow("Too many login attempts");
    });

    it("increments failure count on password mismatch", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "User",
        role: "USER",
        password: "hash",
        isActive: true,
      } as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      const fn = getAuthorize();

      await expect(fn!({ email: "a@b.com", password: "wrong" }, {})).rejects.toThrow(
        "Invalid email or password",
      );
      expect(incrementFailureCount).toHaveBeenCalled();
    });

    it("resets attempts on successful authorize", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "Alice",
        role: "ADMIN",
        password: "hash",
        isActive: true,
      } as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(prisma.user.update).mockResolvedValue({} as never);
      const fn = getAuthorize();

      await fn!({ email: "a@b.com", password: "secret" }, {});
      expect(resetAttempts).toHaveBeenCalled();
    });

    it("does not increment failure count on database connection error", async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("DB Down"));
      const fn = getAuthorize();

      await expect(fn!({ email: "a@b.com", password: "secret" }, {})).rejects.toThrow(
        "Internal server error",
      );
      expect(incrementFailureCount).not.toHaveBeenCalled();
    });
  });
});
