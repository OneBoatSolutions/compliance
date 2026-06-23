import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{}]),
  },
}));

vi.mock("@/lib/redis", () => ({
  redis: {
    ping: vi.fn().mockResolvedValue("PONG"),
  },
}));

vi.mock("@/lib/rate-limiter", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  RATE_LIMIT_CONFIGS: {
    api: {
      name: "rl:api",
      limit: 100,
      windowSeconds: 60,
    },
  },
}));

import { GET as healthGet } from "@/app/api/health/route";
import { NextRequest } from "next/server";

describe("Health route", () => {
  it("returns ok payload", async () => {
    const req = new NextRequest("http://localhost/api/health");
    const res = (await healthGet(req)) as Response;
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.services.database).toBe("healthy");
    expect(json.services.cache).toBe("healthy");
  });
});
