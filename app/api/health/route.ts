import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

// NOTE: Do NOT add `export const revalidate` here.
// Caching this route freezes the `timestamp` field in the response body.
// Monitoring tools (Datadog, Route53, Uptime Robot) that compare the
// timestamp to wall-clock time will read a stale value and fire false
// "server stuck / not responding" alerts.
// The Redis rate limiter below is the correct DDoS protection layer.

export async function GET(req: NextRequest) {
  // ── Rate limiting (10 req / min per IP via Redis sliding window) ──────────
  // Applied BEFORE any DB/Redis ping so a flood never touches the connection pool.
  const limited = await rateLimit(req, {
    ...RATE_LIMIT_CONFIGS.api,
    // Tighter limit than the general API — legitimate monitors call this
    // endpoint at most once every few seconds, not 100 times per minute.
    name: "rl:health",
    limit: 10,
    windowSeconds: 60,
  });
  if (limited) {
    return limited;
  }

  try {
    // 1. Verify Database
    await prisma.$queryRaw`SELECT 1`;

    // 2. Verify Redis
    await redis.ping();

    const response = NextResponse.json({
      status: "ok",
      services: {
        database: "healthy",
        cache: "healthy",
      },
      // Monitors compare this timestamp against wall-clock time to detect hangs.
      // Must be fresh on every request — never cached.
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });

    // Explicitly forbid all caching layers (CDN, browser, proxy) from storing
    // this response. A stale health response is worse than no response at all.
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

    return response;
  } catch (error) {
    console.error("Health check failure:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Service Unavailable",
      },
      { status: 503 },
    );
  }
}
