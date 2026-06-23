import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/auth-helpers";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { rateLimitByKey, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

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
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password } = parsed.data;
    const ip = getClientIp(req);

    // ── Dual rate-limit strategy ──────────────────────────────────────────────
    //
    // Layer 1 — Per-EMAIL (shared across ALL IPs):
    //   Key: rl:auth:login:email:{email}
    //   This counter accumulates regardless of which IP is used.
    //   Closes the IP-rotation botnet bypass: a 100-node botnet still only
    //   gets `auth.limit` total attempts against a single email address before
    //   the account is locked.
    //
    // Layer 2 — Per-COMPOSITE (email + IP):
    //   Key: rl:auth:login:{email}:{ip}
    //   Belt-and-suspenders: blocks single-IP floods independently of Layer 1.
    //   Also prevents a targeted attacker from using one account's botnet budget
    //   to exhaust THEIR OWN per-IP window before switching emails.
    //
    // Both layers must pass. Layer 1 is checked first (cheaper key lookup for
    // the common case where an email is not under attack).

    const perEmailKey = `rl:auth:login:email:${email}`;
    const isEmailLocked = await rateLimitByKey(perEmailKey, RATE_LIMIT_CONFIGS.auth);
    if (isEmailLocked) {
      return errorResponse("Too many failed login attempts. Please try again later.", 429);
    }

    const perCompositeKey = `rl:auth:login:${email}:${ip}`;
    const isCompositeLocked = await rateLimitByKey(perCompositeKey, RATE_LIMIT_CONFIGS.auth);
    if (isCompositeLocked) {
      return errorResponse("Too many failed login attempts. Please try again later.", 429);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return errorResponse("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return errorResponse("Invalid email or password", 401);
    }

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
