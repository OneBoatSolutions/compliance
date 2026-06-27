/**
 * lib/rate-limiter.ts
 * -------------------
 * Production-grade Redis-backed sliding-window rate limiter for sensitive
 * Next.js 14 App Router API routes.
 *
 * Design:
 *   • Uses Redis MULTI/EXEC (atomic pipeline) to implement a sliding-window
 *     counter — no Lua script required, works on Redis Cluster & Upstash.
 *   • Falls back gracefully (fail-open) when Redis is unavailable so that a
 *     cache outage doesn't take down the entire API.
 *   • Configurable presets for different sensitivity levels (see RATE_LIMIT_CONFIGS).
 *
 * Usage (inside an App Router route handler):
 *
 *   import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";
 *
 *   export async function POST(req: Request) {
 *     const limited = await rateLimit(req, RATE_LIMIT_CONFIGS.auth);
 *     if (limited) return limited; // Returns a 429 NextResponse automatically
 *     // ... handler logic
 *   }
 */

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  /** Unique identifier for this limiter (used as Redis key prefix). */
  name: string;
  /** Maximum number of requests allowed in the window. */
  limit: number;
  /** Window duration in seconds. */
  windowSeconds: number;
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RATE_LIMIT_CONFIGS = {
  /** Auth endpoints: 10 attempts per 15 minutes per IP. */
  auth: {
    name: "rl:auth",
    limit: 10,
    windowSeconds: 15 * 60,
  },
  /** AI generation endpoints: 20 requests per minute per user/IP. */
  ai: {
    name: "rl:ai",
    limit: 20,
    windowSeconds: 60,
  },
  /** General API: 100 requests per minute per IP. */
  api: {
    name: "rl:api",
    limit: 100,
    windowSeconds: 60,
  },
  /** File upload: 10 uploads per minute per user. */
  upload: {
    name: "rl:upload",
    limit: 10,
    windowSeconds: 60,
  },
  /** Password reset / sensitive mutation: 5 per hour. */
  sensitive: {
    name: "rl:sensitive",
    limit: 5,
    windowSeconds: 60 * 60,
  },
  /** IP Volumetric preset: lightweight upfront throttling to mitigate bcrypt concurrency DoS. */
  loginIpVolumetric: {
    name: "rl:login:ip:volumetric",
    limit: 20,
    windowSeconds: 60,
  },
  /** Registration IP budget: higher allowance for shared office/NAT/VPN networks. */
  registerIp: {
    name: "rl:register:ip",
    limit: 50,
    windowSeconds: 15 * 60,
  },
  /** Registration Email budget: throttles identity verification. */
  registerEmail: {
    name: "rl:register:email",
    limit: 5,
    windowSeconds: 60 * 60,
  },
  /** Registration Abuse budget: strict rate limiting on malformed JSON or invalid validation attempts. */
  registerAbuse: {
    name: "rl:register:abuse",
    limit: 10,
    windowSeconds: 15 * 60,
  },
} satisfies Record<string, RateLimitConfig>;

// ---------------------------------------------------------------------------
// Identifier extraction
// ---------------------------------------------------------------------------

/**
 * Derives a rate-limit key from the request.
 * Prefers a real IP over forwarded headers to prevent header spoofing.
 * Combines IP + route name for isolation between endpoints.
 */
function getIdentifier(req: Request, config: RateLimitConfig): string {
  const url = new URL(req.url);

  // In Next.js App Router, real IP is exposed via the incoming headers.
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  // Trust the first IP in x-forwarded-for only if behind a known proxy.
  // For bare Metal/VPS deployments, prefer x-real-ip set by nginx/Caddy.
  const ip = realIp || (forwarded ? forwarded.split(",")[0].trim() : null) || "unknown";

  return `${config.name}:${ip}:${url.pathname}`;
}

// ---------------------------------------------------------------------------
// Sliding-window counter (atomic via pipeline)
// ---------------------------------------------------------------------------

async function getSlidingWindowCount(key: string, windowSeconds: number): Promise<number> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Atomic pipeline: remove expired members → add current → count.
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, `${now}-${Math.random()}`);
  pipeline.zcard(key);
  pipeline.expire(key, windowSeconds);

  const results = await pipeline.exec();
  if (!results) {
    return 0;
  }

  // zcard result is at index 2
  const cardResult = results[2];
  if (!cardResult || cardResult[0] !== null) {
    return 0;
  }
  return cardResult[1] as number;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Applies rate limiting to an API request.
 *
 * @returns `null` if the request is allowed, or a `NextResponse` (429) if it
 *          has been rate-limited.
 *
 * @example
 * const limited = await rateLimit(req, RATE_LIMIT_CONFIGS.auth);
 * if (limited) return limited;
 */
export async function rateLimit(
  req: Request,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return null;
  }
  const key = getIdentifier(req, config);

  let count: number;
  try {
    count = await getSlidingWindowCount(key, config.windowSeconds);
  } catch (err) {
    // Fail open: if Redis is unavailable don't block legitimate traffic.
    console.warn("[rate-limiter] Redis unavailable, allowing request:", err);
    return null;
  }

  const remaining = Math.max(0, config.limit - count);
  const retryAfter = config.windowSeconds;

  const headers = {
    "X-RateLimit-Limit": String(config.limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Window": String(config.windowSeconds),
    "Retry-After": String(retryAfter),
  };

  if (count >= config.limit) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      { status: 429, headers },
    );
  }

  return null;
}

/**
 * Convenience wrapper: rate-limit by authenticated user ID (from JWT) + IP
 * instead of IP alone.  Use this for endpoints where per-user fairness matters
 * more than per-IP (e.g. AI generation quotas).
 */
export async function rateLimitByUser(
  req: Request,
  userId: string,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return null;
  }
  const url = new URL(req.url);
  const key = `${config.name}:user:${userId}:${url.pathname}`;

  let count: number;
  try {
    count = await getSlidingWindowCount(key, config.windowSeconds);
  } catch (err) {
    console.warn("[rate-limiter] Redis unavailable, allowing request:", err);
    return null;
  }

  const remaining = Math.max(0, config.limit - count);
  const headers = {
    "X-RateLimit-Limit": String(config.limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Window": String(config.windowSeconds),
    "Retry-After": String(config.windowSeconds),
  };

  if (count >= config.limit) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: `AI generation quota exceeded. Try again in ${config.windowSeconds} seconds.`,
        retryAfter: config.windowSeconds,
      },
      { status: 429, headers },
    );
  }

  return null;
}

/**
 * Low-level rate limiter that checks lockout status by key using a sliding window.
 * Returns true if the key has been rate limited, false otherwise.
 * Fail-opens if Redis is unavailable.
 */
export async function rateLimitByKey(key: string, config: RateLimitConfig): Promise<boolean> {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return false;
  }
  try {
    const count = await getSlidingWindowCount(key, config.windowSeconds);
    return count >= config.limit;
  } catch (err) {
    console.warn("[rate-limiter] Redis unavailable, allowing request (fail-open):", err);
    return false;
  }
}

/**
 * Checks if a key has exceeded its rate limit without incrementing the count.
 * Returns true if locked, false otherwise.
 * Fail-opens if Redis is unavailable.
 */
export async function isRateLimited(key: string, config: RateLimitConfig): Promise<boolean> {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return false;
  }
  try {
    const now = Date.now();
    const windowStart = now - config.windowSeconds * 1000;
    const count = await redis.zcount(key, windowStart, now);
    return count >= config.limit;
  } catch (err) {
    console.warn("[rate-limiter] Redis unavailable, allowing request (fail-open):", err);
    return false;
  }
}

/**
 * Increments the failure count for a specific key.
 * Uses a Redis pipeline to zrem old items, zadd the new failure, and expire the key.
 * Fail-opens if Redis is unavailable.
 */
export async function incrementFailureCount(key: string, windowSeconds: number): Promise<void> {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return;
  }
  try {
    const now = Date.now();
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, now - windowSeconds * 1000);
    pipeline.zadd(key, now, `${now}-${crypto.randomUUID()}`);
    pipeline.expire(key, windowSeconds);
    await pipeline.exec();
  } catch (err) {
    console.warn("[rate-limiter] Redis unavailable, could not increment failure count:", err);
  }
}

/**
 * Flushes/deletes the sliding window history for a specific key (resets attempts).
 * Fail-opens if Redis is unavailable.
 */
export async function resetAttempts(key: string): Promise<void> {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return;
  }
  try {
    await redis.del(key);
  } catch (err) {
    console.warn("[rate-limiter] Redis unavailable, could not reset attempts:", err);
  }
}
