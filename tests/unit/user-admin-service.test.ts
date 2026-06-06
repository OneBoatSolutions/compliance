import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((input: unknown) => {
      if (Array.isArray(input)) {
        return Promise.all(input);
      }
      if (typeof input === "function") {
        return input(prisma);
      }
      return null;
    }),
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed-password"),
}));

vi.mock("@/services/email-service", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-helpers";
import { sendPasswordResetEmail } from "@/services/email-service";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  triggerPasswordReset,
  assertNotSelfSabotage,
  removesAdminAccess,
  hashResetToken,
} from "@/services/user-admin-service";

describe("user-admin-service: assertNotSelfSabotage", () => {
  it("throws when user tries to demote themselves", () => {
    expect(() => assertNotSelfSabotage("u1", "u1", { role: "USER" })).toThrow();
  });

  it("throws when user tries to deactivate themselves", () => {
    expect(() => assertNotSelfSabotage("u1", "u1", { isActive: false })).toThrow();
  });

  it("does not throw when actor is different from target", () => {
    expect(() => assertNotSelfSabotage("u1", "u2", { role: "USER" })).not.toThrow();
  });

  it("does not throw for non-self-sabotage fields", () => {
    expect(() => assertNotSelfSabotage("u1", "u1", {})).not.toThrow();
  });
});

describe("user-admin-service: removesAdminAccess", () => {
  it("returns true when admin is demoted to user", () => {
    expect(removesAdminAccess({ role: "ADMIN", isActive: true }, { role: "USER" })).toBe(true);
  });

  it("returns true when active admin is deactivated", () => {
    expect(removesAdminAccess({ role: "ADMIN", isActive: true }, { isActive: false })).toBe(true);
  });

  it("returns false when user role does not change", () => {
    expect(removesAdminAccess({ role: "USER", isActive: true }, { role: "USER" })).toBe(false);
  });

  it("returns false for non-admin target", () => {
    expect(removesAdminAccess({ role: "USER", isActive: true }, { isActive: false })).toBe(false);
  });
});

describe("user-admin-service: listUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated users", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: "u1",
        email: "a@b.com",
        name: "A",
        role: "USER",
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null,
      },
    ] as never);
    vi.mocked(prisma.user.count).mockResolvedValue(1);

    const result = await listUsers({ page: 1, limit: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("filters by search, role, and isActive", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.user.count).mockResolvedValue(0);

    await listUsers({ page: 1, limit: 20, search: "test", role: "ADMIN", isActive: true });
    const callArgs = vi.mocked(prisma.user.findMany).mock.calls[0][0];
    expect(callArgs).toBeDefined();
    if (callArgs) {
      const where = callArgs.where as Record<string, unknown>;
      expect(where.role).toBe("ADMIN");
      expect(where.isActive).toBe(true);
      expect(where.OR).toBeDefined();
    }
  });
});

describe("user-admin-service: createUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates user with hashed password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null as never);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "u1",
      email: "new@b.com",
      name: "New",
      role: "USER",
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: null,
    } as never);

    const result = await createUser({
      email: "new@b.com",
      name: "New",
      password: "pass",
      role: "USER",
    });
    expect(result.email).toBe("new@b.com");
    expect(hashPassword).toHaveBeenCalledWith("pass");
  });

  it("throws 409 for duplicate email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" } as never);

    await expect(
      createUser({ email: "dup@b.com", name: "Dup", password: "pass", role: "USER" }),
    ).rejects.toThrow("Email already registered");
  });
});

describe("user-admin-service: updateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects self-demotion", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: "ADMIN", isActive: true } as never);

    await expect(updateUser("u1", "u1", { role: "USER" })).rejects.toThrow();
  });

  it("rejects removing the last admin", async () => {
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce({ id: "u2", role: "ADMIN", isActive: true } as never)
      .mockResolvedValueOnce({ role: "ADMIN", isActive: true } as never);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: unknown) => {
      if (typeof fn === "function") {
        const tx = {
          user: {
            findUnique: vi.fn().mockResolvedValue({ role: "ADMIN", isActive: true }),
            count: vi.fn().mockResolvedValue(1),
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return fn(tx);
      }
      return null;
    });

    await expect(updateUser("u1", "u2", { role: "USER" })).rejects.toThrow(
      "Cannot remove the last admin",
    );
  });
});

describe("user-admin-service: deleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects self-deletion", async () => {
    await expect(deleteUser("u1", "u1")).rejects.toThrow("You cannot delete your own account");
  });

  it("rejects deleting the last admin", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u2",
      role: "ADMIN",
      isActive: true,
    } as never);
    vi.mocked(prisma.user.count).mockResolvedValue(1);

    await expect(deleteUser("u1", "u2")).rejects.toThrow("Cannot delete the last admin");
  });

  it("deletes user successfully", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u2",
      role: "USER",
      isActive: true,
    } as never);
    vi.mocked(prisma.user.count).mockResolvedValue(2);
    vi.mocked(prisma.user.delete).mockResolvedValue({} as never);

    await expect(deleteUser("u1", "u2")).resolves.toBe(true);
  });
});

describe("user-admin-service: triggerPasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates token, invalidates old ones, sends email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      name: "Test",
    } as never);
    vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({ id: "prt1" } as never);

    await triggerPasswordReset("u1");
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledTimes(2);
    expect(prisma.passwordResetToken.create).toHaveBeenCalled();
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "a@b.com" }));
  });

  it("throws 404 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null as never);

    await expect(triggerPasswordReset("missing")).rejects.toThrow("User not found");
  });
});

describe("user-admin-service: hashResetToken", () => {
  it("returns a sha256 hex string", () => {
    const hash = hashResetToken("some-token");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
