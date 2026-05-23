import { Prisma, Role } from "@prisma/client";
import { createHash, randomBytes } from "crypto";
import { hashPassword } from "@/lib/auth-helpers";
import { ApiError } from "@/lib/app-error";
import { prisma } from "@/lib/prisma";
import type {
  AdminUserListQuery,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "@/lib/validations/user";
import { sendPasswordResetEmail } from "@/services/email-service";

const resetTokenExpiryMs = 60 * 60 * 1000;

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  lastLoginAt: true,
} satisfies Prisma.UserSelect;

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export function assertNotSelfSabotage(
  actorId: string,
  targetId: string,
  data: UpdateAdminUserInput,
): void {
  if (actorId !== targetId) {
    return;
  }

  if (data.role === Role.USER || data.isActive === false) {
    throw new ApiError("You cannot demote or deactivate your own account", 400);
  }
}

export function removesAdminAccess(
  target: { role: Role; isActive: boolean },
  data: UpdateAdminUserInput,
): boolean {
  return (
    (data.role === Role.USER && target.role === Role.ADMIN) ||
    (data.isActive === false && target.role === Role.ADMIN && target.isActive)
  );
}

export async function listUsers(query: AdminUserListQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: userPublicSelect,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    meta: { total, page, limit, totalPages },
  };
}

export async function createUser(data: CreateAdminUserInput): Promise<UserPublic> {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existing) {
    throw new ApiError("Email already registered", 409);
  }

  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      password: hashedPassword,
    },
    select: userPublicSelect,
  });
}

export async function updateUser(
  actorId: string,
  targetId: string,
  data: UpdateAdminUserInput,
): Promise<UserPublic> {
  assertNotSelfSabotage(actorId, targetId, data);

  const updateData: Prisma.UserUpdateInput = {};
  if (data.role !== undefined) {
    updateData.role = data.role;
  }
  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  const targetPreview = await prisma.user.findUnique({
    where: { id: targetId },
    select: { role: true, isActive: true },
  });

  if (!targetPreview) {
    throw new ApiError("User not found", 404);
  }

  if (!removesAdminAccess(targetPreview, data)) {
    return prisma.user.update({
      where: { id: targetId },
      data: updateData,
      select: userPublicSelect,
    });
  }

  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const target = await tx.user.findUnique({
        where: { id: targetId },
        select: { role: true, isActive: true },
      });

      if (!target) {
        throw new ApiError("User not found", 404);
      }

      if (removesAdminAccess(target, data)) {
        const activeAdminCount = await tx.user.count({
          where: { role: Role.ADMIN, isActive: true },
        });

        if (activeAdminCount <= 1) {
          throw new ApiError("Cannot remove the last admin", 400);
        }
      }

      const updated = await tx.user.update({
        where: { id: targetId },
        data: updateData,
        select: userPublicSelect,
      });

      const remaining = await tx.user.count({
        where: { role: Role.ADMIN, isActive: true },
      });

      if (remaining === 0) {
        throw new ApiError("Cannot remove the last admin", 400);
      }

      return updated;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

export async function triggerPasswordReset(targetId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + resetTokenExpiryMs);
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    }),
    prisma.passwordResetToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        expiresAt,
      },
    }),
  ]);

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    resetLink,
  });
}
