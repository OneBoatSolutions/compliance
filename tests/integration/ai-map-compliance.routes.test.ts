import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: { findMany: vi.fn() },
    aIInteraction: {
      create: vi.fn().mockReturnValue({
        catch: vi.fn(),
      }),
    },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/lib/cache", () => ({
  getCache: vi.fn().mockResolvedValue(null),
  setCache: vi.fn(),
}));

vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

vi.mock("@/lib/rate-limiter", () => ({
  rateLimitByUser: vi.fn().mockResolvedValue(null),
}));

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { POST } from "@/app/api/ai/map-compliance/route";

const validOrgProfile = {
  name: "Acme",
  description: "A test org",
  services: "Cloud",
  customers: "Enterprise",
  problem: "Compliance",
  dataHandled: ["PII"],
  regions: ["US"],
};

function buildRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("AI map-compliance API route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHelpers.requireAuth).mockResolvedValue({
      user: { id: "user_1", role: "USER" },
    } as never);
  });

  it("returns mapped frameworks from the AI", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify({
        frameworks: [
          {
            code: "GDPR",
            name: "GDPR",
            confidence: 95,
            explanation: "Recommended",
            tags: ["privacy"],
          },
        ],
      }),
      usage: { totalTokens: 100 },
    } as never);

    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      { id: "fw_1", code: "GDPR", name: "GDPR", _count: { controls: 20 } },
    ] as never);

    const res = (await POST(
      buildRequest("http://localhost/api/ai/map-compliance", validOrgProfile),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].code).toBe("GDPR");
  });

  it("rejects invalid profile payload with 400", async () => {
    const res = (await POST(
      buildRequest("http://localhost/api/ai/map-compliance", { name: "only-name" }),
    )) as Response;
    expect(res.status).toBe(400);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(authHelpers.requireAuth).mockRejectedValue(new Error("401: Unauthorized"));

    const res = (await POST(
      buildRequest("http://localhost/api/ai/map-compliance", validOrgProfile),
    )) as Response;
    expect(res.status).toBe(401);
  });

  it("returns 500 on AI service error", async () => {
    vi.mocked(generateText).mockRejectedValue(new Error("AI service exploded"));

    const res = (await POST(
      buildRequest("http://localhost/api/ai/map-compliance", validOrgProfile),
    )) as Response;
    expect(res.status).toBe(500);
  });

  it("returns fallback when AI times out", async () => {
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      { id: "fw_gdpr", code: "GDPR", name: "GDPR", _count: { controls: 24 } },
    ] as never);

    const res = (await POST(
      buildRequest("http://localhost/api/ai/map-compliance", validOrgProfile),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.source).toBeDefined();
    expect(json.source).toBe("heuristic");
  });
});
