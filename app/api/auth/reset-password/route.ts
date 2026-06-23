import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-helpers";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const rateLimited = await rateLimit(req, RATE_LIMIT_CONFIGS.sensitive);
    if (rateLimited) {
      return rateLimited;
    }

    const body = await req.json();

    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { token, password } = parsed.data;
    const tokenHash = hashResetToken(token);
    const now = new Date();

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token: tokenHash },
      include: {
        user: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (!passwordResetToken) {
      return errorResponse("Invalid or expired password reset token", 400);
    }

    if (passwordResetToken.usedAt || passwordResetToken.invalidatedAt) {
      return errorResponse("Invalid or expired password reset token", 400);
    }

    if (passwordResetToken.expiresAt.getTime() <= now.getTime()) {
      return errorResponse("Invalid or expired password reset token", 400);
    }

    if (!passwordResetToken.user.isActive) {
      return errorResponse("Invalid or expired password reset token", 400);
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: passwordResetToken.userId },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.update({
        where: { id: passwordResetToken.id },
        data: { usedAt: now },
      });

      await tx.passwordResetToken.updateMany({
        where: {
          userId: passwordResetToken.userId,
          id: {
            not: passwordResetToken.id,
          },
          usedAt: null,
          invalidatedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        data: {
          invalidatedAt: now,
        },
      });
    });

    return successResponse({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error", 500);
  }
}
