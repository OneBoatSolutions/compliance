import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that transitively load these
// modules, so that Vitest's hoisting replaces them at module-graph resolution.
// ---------------------------------------------------------------------------

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{}]),
  },
}));

vi.mock("@/lib/redis", () => ({
  redis: {
    ping: vi.fn().mockResolvedValue("PONG"),
    pipeline: vi.fn(),
    zcount: vi.fn(),
  },
  default: {
    ping: vi.fn().mockResolvedValue("PONG"),
  },
}));

// The health route no longer imports the Redis-backed rate-limiter.
// The ready route uses an in-process limiter — no mock needed.

// ---------------------------------------------------------------------------
// Imports (after mocks are registered so the factories above take effect)
// ---------------------------------------------------------------------------

import { GET as healthGet } from "@/app/api/health/route";
import { GET as readyGet } from "@/app/api/ready/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// ---------------------------------------------------------------------------
// /api/health — liveness probe
// ---------------------------------------------------------------------------

describe("GET /api/health (liveness probe)", () => {
  it("returns 200 with status:ok and a fresh timestamp", async () => {
    const before = Date.now();
    const res = (await healthGet()) as Response;
    const after = Date.now();

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(typeof json.timestamp).toBe("string");

    const ts = new Date(json.timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it("does NOT expose a services block (dependency checks belong in /api/ready)", async () => {
    const res = (await healthGet()) as Response;
    const json = await res.json();
    // The liveness probe must remain dependency-free — no services field.
    expect(json.services).toBeUndefined();
  });

  it("sets Cache-Control: no-store", async () => {
    const res = (await healthGet()) as Response;
    expect(res.headers.get("cache-control")).toContain("no-store");
  });
});

// ---------------------------------------------------------------------------
// /api/ready — readiness / deep-dependency probe
// ---------------------------------------------------------------------------

describe("GET /api/ready (readiness probe)", () => {
  // Use unique IPs per describe-run to avoid hitting the in-process rate limit
  // from previous test runs sharing the same module-scoped Map.
  let ipCounter = 1000;
  function makeReq() {
    return new NextRequest("http://localhost/api/ready", {
      headers: { "x-real-ip": `10.0.${Math.floor(ipCounter / 256)}.${ipCounter++ % 256}` },
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    // Re-apply default happy-path mock values after clearAllMocks wipes them.
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{}]);
    vi.mocked(redis.ping).mockResolvedValue("PONG");
  });

  it("returns 200 with status:ready when DB and Redis are healthy", async () => {
    const res = (await readyGet(makeReq())) as Response;
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ready");
    expect(json.services.database.status).toBe("healthy");
    expect(json.services.cache.status).toBe("healthy");
  });

  it("returns 200 with status:degraded when only Redis is down (DB is primary)", async () => {
    vi.mocked(redis.ping).mockRejectedValue(new Error("Connection refused"));

    const res = (await readyGet(makeReq())) as Response;
    // Redis failure alone does not warrant a 503 — DB-backed features still work.
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("degraded");
    expect(json.services.database.status).toBe("healthy");
    expect(json.services.cache.status).toBe("degraded");
    expect(json.services.cache.error).toBeDefined();
  });

  it("returns 503 when the database is unreachable", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("ECONNREFUSED"));

    const res = (await readyGet(makeReq())) as Response;
    expect(res.status).toBe(503);

    const json = await res.json();
    expect(json.status).toBe("degraded");
    expect(json.services.database.status).toBe("degraded");
  });

  it("sets Cache-Control: no-store", async () => {
    const res = (await readyGet(makeReq())) as Response;
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("includes a latencyMs field for each service", async () => {
    const res = (await readyGet(makeReq())) as Response;
    const json = await res.json();
    expect(typeof json.services.database.latencyMs).toBe("number");
    expect(typeof json.services.cache.latencyMs).toBe("number");
  });
});
