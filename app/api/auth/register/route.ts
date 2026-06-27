import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth-helpers";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import {
  rateLimitByKey,
  isRateLimited,
  incrementFailureCount,
  RATE_LIMIT_CONFIGS,
} from "@/lib/rate-limiter";

/**
 * Extracts the client IP from standard proxy headers.
 * Takes only the first IP in x-forwarded-for to prevent header spoofing.
 */
function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return (
    req.headers.get("x-real-ip") ||
    (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
    "unknown-ip"
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipKey = `rl:register:ip:${ip}`;
    const abuseKey = `rl:register:abuse:${ip}`;

    // ── 1. Check IP & Abuse Lockout Budgets (Read-Only) ────────────────────────
    const isLocked = await Promise.all([
      isRateLimited(ipKey, RATE_LIMIT_CONFIGS.registerIp),
      isRateLimited(abuseKey, RATE_LIMIT_CONFIGS.registerAbuse),
    ]).then(([ipLocked, abuseLocked]) => ipLocked || abuseLocked);

    if (isLocked) {
      return errorResponse("Too many registration attempts. Please try again later.", 429);
    }

    // ── 2. Parse JSON & Validate Zod Schema ────────────────────────────────────
    let body;
    try {
      body = await req.json();
    } catch {
      await incrementFailureCount(abuseKey, RATE_LIMIT_CONFIGS.registerAbuse.windowSeconds);
      return errorResponse("Invalid JSON payload", 400);
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      await incrementFailureCount(abuseKey, RATE_LIMIT_CONFIGS.registerAbuse.windowSeconds);
      return validationErrorResponse(parsed.error);
    }

    const { name, companyName, email, password } = parsed.data;

    // ── 3. Check and Increment Identity & IP Budgets ──────────────────────────
    const registerEmailKey = `rl:register:email:${email.toLowerCase().trim()}`;
    const isEmailLimited = await rateLimitByKey(registerEmailKey, RATE_LIMIT_CONFIGS.registerEmail);
    if (isEmailLimited) {
      return errorResponse(
        "Too many registration attempts for this email address. Please try again later.",
        429,
      );
    }

    const isIpLimited = await rateLimitByKey(ipKey, RATE_LIMIT_CONFIGS.registerIp);
    if (isIpLimited) {
      return errorResponse("Too many registration attempts. Please try again later.", 429);
    }

    // ── 4. Process Registration in Database ────────────────────────────────────
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return errorResponse("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizations: {
          create: {
            name: companyName,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return successResponse(user, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error", 500);
  }
}
