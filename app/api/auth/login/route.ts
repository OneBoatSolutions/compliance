import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/auth-helpers";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { isLocked, recordFailedAttempt, resetAttempts } from "@/lib/rate-limits";

function getClientIdentifier(req: Request, email: string) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown-ip";
  return `${email}:${ip}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password } = parsed.data;
    const identifier = getClientIdentifier(req, email);

    if (isLocked(identifier)) {
      return errorResponse("Too many failed login attempts. Please try again later.", 429);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      recordFailedAttempt(identifier);
      return errorResponse("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      recordFailedAttempt(identifier);
      return errorResponse("Invalid email or password", 401);
    }

    // Successful login -> reset attempt counter and update lastLoginAt
    resetAttempts(identifier);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return successResponse({
      user: responseUser,
    });
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error", 500);
  }
}
