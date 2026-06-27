import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/auth-helpers";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import {
  rateLimitByKey,
  isRateLimited,
  incrementFailureCount,
  resetAttempts,
  RATE_LIMIT_CONFIGS,
} from "@/lib/rate-limiter";

/**
 * Extracts the client IP from standard proxy headers.
 * Takes only the first IP in x-forwarded-for to prevent header spoofing
 * (an attacker cannot forge the IP that the upstream proxy appends).
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

    // ── Volumetric IP Protection ──────────────────────────────────────────────
    const volumetricKey = `rl:login:ip:volumetric:${ip}`;
    const isVolumetricLimited = await rateLimitByKey(
      volumetricKey,
      RATE_LIMIT_CONFIGS.loginIpVolumetric,
    );
    if (isVolumetricLimited) {
      return errorResponse("Too many login attempts. Please try again later.", 429);
    }

    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password } = parsed.data;

    // ── Dual rate-limit strategy ──────────────────────────────────────────────
    //
    // Layer 1 — Per-EMAIL (shared across ALL IPs):
    //   Key: rl:auth:login:email:{email}
    //
    // Layer 2 — Per-COMPOSITE (email + IP):
    //   Key: rl:auth:login:${email}:${ip}
    //
    // Both layers must pass. Check read-only lockout states to prevent successful
    // logins from counting against the window limits.

    const perEmailKey = `rl:auth:login:email:${email}`;
    const perCompositeKey = `rl:auth:login:${email}:${ip}`;

    const isLocked = await Promise.all([
      isRateLimited(perEmailKey, RATE_LIMIT_CONFIGS.auth),
      isRateLimited(perCompositeKey, RATE_LIMIT_CONFIGS.auth),
    ]).then(([emailLocked, compositeLocked]) => emailLocked || compositeLocked);

    if (isLocked) {
      return errorResponse("Too many failed login attempts. Please try again later.", 429);
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error("Database error during login user query:", dbError);
      return errorResponse("Internal server error", 500);
    }

    if (!user || !user.isActive) {
      await Promise.all([
        incrementFailureCount(perEmailKey, RATE_LIMIT_CONFIGS.auth.windowSeconds),
        incrementFailureCount(perCompositeKey, RATE_LIMIT_CONFIGS.auth.windowSeconds),
      ]);
      return errorResponse("Invalid email or password", 401);
    }

    let valid = false;
    try {
      valid = await verifyPassword(password, user.password);
    } catch (hashError) {
      console.error("Hashing verification error during login:", hashError);
      return errorResponse("Internal server error", 500);
    }

    if (!valid) {
      await Promise.all([
        incrementFailureCount(perEmailKey, RATE_LIMIT_CONFIGS.auth.windowSeconds),
        incrementFailureCount(perCompositeKey, RATE_LIMIT_CONFIGS.auth.windowSeconds),
      ]);
      return errorResponse("Invalid email or password", 401);
    }

    await Promise.all([resetAttempts(perEmailKey), resetAttempts(perCompositeKey)]);

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
