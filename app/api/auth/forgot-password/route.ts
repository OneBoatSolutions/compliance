import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { isLocked, recordFailedAttempt } from "@/lib/rate-limits";
import { sendPasswordResetEmail } from "@/services/email-service";

const resetTokenTtlMs = 60 * 60 * 1000;
const genericForgotPasswordMessage =
  "If an account with that email exists, password reset instructions have been sent.";

function getClientIdentifier(req: Request, email: string) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown-ip";
  return `forgot-password:${email}:${ip}`;
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getResetUrl(req: Request, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email } = parsed.data;
    const identifier = getClientIdentifier(req, email);

    if (isLocked(identifier)) {
      return errorResponse("Too many reset requests. Please try again later.", 429);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (user) {
      const now = new Date();
      const resetToken = randomBytes(32).toString("hex");
      const resetTokenHash = hashResetToken(resetToken);
      const expiresAt = new Date(now.getTime() + resetTokenTtlMs);

      await prisma.$transaction([
        prisma.passwordResetToken.updateMany({
          where: {
            userId: user.id,
            usedAt: null,
            invalidatedAt: null,
            expiresAt: {
              gt: now,
            },
          },
          data: {
            invalidatedAt: now,
          },
        }),
        prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: resetTokenHash,
            expiresAt,
          },
        }),
      ]);

      const resetLink = getResetUrl(req, resetToken);
      try {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name,
          resetLink,
        });
      } catch (err) {
        console.error("[forgot-password] email send failed", err);
      }
    }

    recordFailedAttempt(identifier);

    return successResponse({
      message: genericForgotPasswordMessage,
    });
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error", 500);
  }
}
