import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: { findMany: vi.fn() },
    aIInteraction: { create: vi.fn() },
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
import { generateText } from "ai";
import { POST } from "@/app/api/ai/remediation/route";

const validRequest = {
  frameworkName: "GDPR",
  controlId: "C-001",
  controlTitle: "Access Control",
  controlDescription: "Restrict access to data",
  currentStatus: "NOT_COMPLIANT",
  severity: "HIGH",
};

function buildRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("AI remediation API route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHelpers.requireAuth).mockResolvedValue({
      user: { id: "user_1", role: "USER" },
    } as never);
  });

  it("returns a remediation plan from the AI", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify({
        steps: [
          {
            title: "Step A",
            description: "Do A",
            priority: "HIGH",
            owner: "IT",
            estimatedHours: 4,
          },
          {
            title: "Step B",
            description: "Do B",
            priority: "MEDIUM",
            owner: "Ops",
            estimatedHours: 2,
          },
          {
            title: "Step C",
            description: "Do C",
            priority: "LOW",
            owner: "Dev",
            estimatedHours: 1,
          },
        ],
        policies: ["P1", "P2"],
        technicalControls: ["T1", "T2"],
      }),
      usage: { totalTokens: 100 },
    } as never);

    const res = (await POST(
      buildRequest("http://localhost/api/ai/remediation", validRequest),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.steps).toHaveLength(3);
  });

  it("rejects invalid payload with 400", async () => {
    const res = (await POST(
      buildRequest("http://localhost/api/ai/remediation", { frameworkName: "GDPR" }),
    )) as Response;
    expect(res.status).toBe(400);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(authHelpers.requireAuth).mockRejectedValue(new Error("401: Unauthorized"));

    const res = (await POST(
      buildRequest("http://localhost/api/ai/remediation", validRequest),
    )) as Response;
    expect(res.status).toBe(401);
  });

  it("returns 504 when AI times out", async () => {
    vi.mocked(generateText).mockRejectedValue(new Error("AI remediation request timed out"));

    const res = (await POST(
      buildRequest("http://localhost/api/ai/remediation", validRequest),
    )) as Response;
    expect(res.status).toBe(504);
  });

  it("returns fallback plan on AI parse error", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: "not-json",
      usage: { totalTokens: 5 },
    } as never);

    const res = (await POST(
      buildRequest("http://localhost/api/ai/remediation", validRequest),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.steps.length).toBeGreaterThanOrEqual(3);
  });

  it("respects ?regenerate=true query param", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify({
        steps: [
          {
            title: "A",
            description: "a",
            priority: "HIGH",
            owner: "IT",
            estimatedHours: 1,
          },
          {
            title: "B",
            description: "b",
            priority: "MEDIUM",
            owner: "IT",
            estimatedHours: 1,
          },
          {
            title: "C",
            description: "c",
            priority: "LOW",
            owner: "IT",
            estimatedHours: 1,
          },
        ],
        policies: ["P1", "P2"],
        technicalControls: ["T1", "T2"],
      }),
      usage: { totalTokens: 5 },
    } as never);

    const res = (await POST(
      buildRequest("http://localhost/api/ai/remediation?regenerate=true", validRequest),
    )) as Response;
    expect(res.status).toBe(200);
    expect(generateText).toHaveBeenCalled();
  });
});
