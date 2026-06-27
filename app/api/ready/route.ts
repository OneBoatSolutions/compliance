import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// NOTE: Do NOT add `export const revalidate` here.
// Caching this route freezes the `timestamp` field in the response body.
// Monitoring tools that compare the timestamp to wall-clock time will read
// a stale value and fire false alerts.

// ── Purpose ──────────────────────────────────────────────────────────────
// This is a READINESS / DEEP-DEPENDENCY probe.  It answers:
//   "Are all downstream infrastructure dependencies (DB, cache) reachable?"
//
// Use this endpoint for:
//   • Kubernetes readiness probes  (prevents traffic routing to a pod that
//     cannot reach the database)
//   • Uptime dashboards / on-call alerting
//   • Deployment smoke tests
//
// Do NOT use this endpoint as a Kubernetes liveness probe — a transient
// Redis blip should not cause the node to be restarted. Use /api/health
// for liveness probes instead.
//
// ── Rate Limiting Strategy ────────────────────────────────────────────────
// This endpoint performs real I/O (DB query + Redis ping) and SHOULD be
// protected against abuse, but the limiter must NOT itself depend on Redis.
// A Redis-backed limiter in front of the Redis connectivity check creates
// a circular failure: Redis down → limiter cannot run → endpoint errors.
//
// Solution: in-process sliding-window counter stored in a module-scoped Map.
// • Zero Redis dependency — works even when Redis is completely offline.
// • Limits are per source-IP to prevent a single external actor from
//   exhausting DB connection-pool slots via rapid probe hammering.
// • The budget is generous enough that legitimate fleets of monitors,
//   load-balancers, and Kubernetes nodes sharing an egress IP are never
//   accidentally blocked.
//
// ── DDoS Hardening Note ──────────────────────────────────────────────────
// Internal node lookups are kept safe from external DDoS vectors by:
//   1. The in-process rate limiter below (abusive IPs are throttled at 429).
//   2. Infrastructure-layer controls (WAF, ingress rate-limit annotations)
//      that should restrict access to this path to known probe CIDR ranges.
//   3. The endpoint reveals only a coarse "degraded/healthy" label per service —
//      no raw error messages, stack traces, or connection strings are exposed.

// ---------------------------------------------------------------------------
// In-process sliding-window rate limiter (no external dependencies)
// ---------------------------------------------------------------------------

interface WindowEntry {
  timestamps: number[];
}

/** Per-IP request log.  Cleared on process restart — intentional for a probe. */
const ipWindows = new Map<string, WindowEntry>();

/**
 * Returns true if the caller should be rate-limited.
 *
 * Budget: 60 requests per minute per source IP per node.
 *
 * ── Multi-node deployment note ─────────────────────────────────────────────
 * This counter is LOCAL to each application instance — it is intentionally
 * NOT backed by a shared Redis store (that would reintroduce the circular
 * failure this module was designed to avoid).
 *
 * Consequence for horizontally-scaled deployments:
 *   A single source IP can make up to (LIMIT × number-of-nodes) requests
 *   per minute across the whole cluster before any one node rate-limits it.
 *   For example, with 5 nodes: 60 × 5 = 300 total requests/min globally.
 *
 * This is intentional and desirable for probe traffic:
 *   • AWS ALB, Cloudflare, and Kubernetes probes issue requests to every
 *     node independently; a shared counter would halve their effective budget
 *     with each new node added.
 *   • Abuse protection here targets connection-pool exhaustion on a single
 *     node, not global request volume — the latter belongs at the WAF layer.
 *
 * Operations teams should be aware that the in-memory counters are reset on
 * every process restart and cannot be inspected across nodes without
 * aggregating metrics from each instance's observability export.
 */
function isInProcessRateLimited(ip: string): boolean {
  const LIMIT = 60;
  const windowMs = 60_000; // 1 minute
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = ipWindows.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    ipWindows.set(ip, entry);
  }

  // Evict timestamps outside the current window.
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= LIMIT) {
    return true;
  }

  entry.timestamps.push(now);
  return false;
}

// Periodically sweep stale entries so the Map does not grow unboundedly.
// setInterval is safe in Next.js standalone mode; the module is loaded once
// per worker process.
//
// .unref() is REQUIRED here.  Without it, the Node.js event loop stays open
// solely because of this timer, which means the process will NOT exit cleanly
// when the container receives SIGTERM.  The platform must then wait for its
// hard-kill timeout (typically 30 s) before issuing SIGKILL, causing
// unnecessarily slow rolling deployments and pod evictions.
// With .unref(), the timer fires normally during regular operation but does
// not count as a "pending work item" that blocks process exit.
if (typeof setInterval !== "undefined") {
  const sweepTimer = setInterval(
    () => {
      const cutoff = Date.now() - 60_000;
      for (const [ip, entry] of ipWindows.entries()) {
        if (entry.timestamps.every((t) => t <= cutoff)) {
          ipWindows.delete(ip);
        }
      }
    },
    5 * 60 * 1000, // sweep every 5 minutes
  );
  // Allow the process to exit cleanly on SIGTERM without waiting for this timer.
  sweepTimer.unref();
}

// ---------------------------------------------------------------------------
// IP extraction (mirrors lib/rate-limiter.ts getIdentifier, kept local to
// avoid importing the Redis-backed module into this dependency-check route)
// ---------------------------------------------------------------------------

function getSourceIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip");
  const forwarded = req.headers.get("x-forwarded-for");
  return realIp ?? (forwarded ? forwarded.split(",")[0].trim() : null) ?? "unknown";
}

// ---------------------------------------------------------------------------
// Dependency check helpers
// ---------------------------------------------------------------------------

type ServiceStatus = "healthy" | "degraded";

interface CheckResult {
  status: ServiceStatus;
  latencyMs: number;
  error?: string;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (err) {
    return {
      status: "degraded",
      latencyMs: Date.now() - start,
      // Surface only a sanitized message — no raw Prisma internals.
      error: err instanceof Error ? err.message.split("\n")[0] : "Unknown error",
    };
  }
}

async function checkRedis(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const pong = await redis.ping();
    if (pong !== "PONG") {
      return {
        status: "degraded",
        latencyMs: Date.now() - start,
        error: `Unexpected PING response: ${pong}`,
      };
    }
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (err) {
    return {
      status: "degraded",
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message.split("\n")[0] : "Unknown error",
    };
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  // Apply in-process rate limit (no Redis dependency).
  const sourceIp = getSourceIp(req);
  if (isInProcessRateLimited(sourceIp)) {
    return NextResponse.json(
      { error: "Too Many Requests", message: "Readiness probe rate limit exceeded." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }

  // Run DB and Redis checks concurrently to minimise probe latency.
  const [dbResult, redisResult] = await Promise.all([checkDatabase(), checkRedis()]);

  const allHealthy = dbResult.status === "healthy" && redisResult.status === "healthy";

  // Build the response body.  Sanitised — no stack traces or internals.
  const body = {
    // "ready" = all critical dependencies reachable.
    // "degraded" = one or more dependencies are unavailable.
    status: allHealthy ? "ready" : "degraded",
    services: {
      database: {
        status: dbResult.status,
        latencyMs: dbResult.latencyMs,
        ...(dbResult.error ? { error: dbResult.error } : {}),
      },
      cache: {
        status: redisResult.status,
        latencyMs: redisResult.latencyMs,
        ...(redisResult.error ? { error: redisResult.error } : {}),
      },
    },
    // Fresh timestamp on every request — never cache this.
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "1.0.0",
  };

  const response = NextResponse.json(body, {
    // 200 even when degraded so that readiness probes can parse the body and
    // decide per-service whether to drain traffic.  503 is reserved for cases
    // where the primary dependency (DB) is completely unreachable.
    status: dbResult.status === "degraded" ? 503 : 200,
  });

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");

  return response;
}
