import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { requireAuth, requireAdmin, hashPassword, verifyPassword } from "@/lib/auth-helpers";

describe("auth-helpers: requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns session when authenticated", async () => {
    const mockSession = { user: { id: "u1", role: "USER" } };
    vi.mocked(getServerSession).mockResolvedValue(mockSession as never);

    const session = await requireAuth();
    expect(session).toEqual(mockSession);
  });

  it("throws 401 when not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as never);

    await expect(requireAuth()).rejects.toThrow("401: Unauthorized");
  });
});

describe("auth-helpers: requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns session when user is ADMIN", async () => {
    const mockSession = { user: { id: "u1", role: "ADMIN" } };
    vi.mocked(getServerSession).mockResolvedValue(mockSession as never);

    const session = await requireAdmin();
    expect(session).toEqual(mockSession);
  });

  it("throws 403 when user is not ADMIN", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1", role: "USER" } } as never);

    await expect(requireAdmin()).rejects.toThrow("403: Forbidden");
  });

  it("throws 401 when not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as never);

    await expect(requireAdmin()).rejects.toThrow("401: Unauthorized");
  });
});

describe("auth-helpers: password hashing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashPassword calls bcrypt with 12 salt rounds", async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
    const result = await hashPassword("mypassword");
    expect(result).toBe("hashed-password");
    expect(bcrypt.hash).toHaveBeenCalledWith("mypassword", 12);
  });

  it("verifyPassword compares password with hash", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    const result = await verifyPassword("mypassword", "hashed-password");
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("mypassword", "hashed-password");
  });
});
