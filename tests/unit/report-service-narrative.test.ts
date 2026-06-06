import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma to prevent DATABASE_URL check
vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: { findMany: vi.fn() },
    assessment: { findFirst: vi.fn() },
  },
}));

// Mock 'ai' SDK so it can be configured per-test
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { generateText } from "ai";

describe("report-service: narrative generation paths", () => {
  const originalEnv = { ...process.env } as typeof process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("uses fallback narrative when OPENAI_API_KEY is not set", async () => {
    delete process.env.OPENAI_API_KEY;
    process.env = originalEnv;
    delete (process.env as Record<string, string | undefined>).OPENAI_API_KEY;

    // Re-import fresh to pick up env
    const { buildReportBundle } = await import("@/services/report-service");

    vi.mocked(prisma.assessment.findFirst).mockResolvedValue({
      id: "asm_1",
      userId: "user_1",
      status: "IN_PROGRESS",
      score: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      completedAt: null,
      organization: {
        id: "org_1",
        name: "Org",
        productName: "Product",
        description: "Desc",
        services: "Svc",
        targetCustomers: "Cust",
        problemSolved: "Prob",
        dataHandled: ["PII"],
        regions: ["US"],
      },
      items: [
        {
          id: "i1",
          status: "NOT_COMPLIANT",
          owner: null,
          targetDate: null,
          comments: null,
          remarks: null,
          evidenceNotes: null,
          evidence: [],
          control: {
            id: "c1",
            code: "C-1",
            title: "Control",
            description: "d",
            severity: "HIGH",
            weight: 2,
            isGateway: false,
            framework: { id: "f1", code: "F1", name: "Framework 1" },
          },
        },
      ],
    } as never);

    const bundle = await buildReportBundle({ assessmentId: "asm_1", userId: "user_1" });
    expect(bundle.executiveSummary).toContain("Product");
    // generateText should NOT have been called since AI key is absent
    expect(generateText).not.toHaveBeenCalled();
  });

  it("uses AI narrative when OPENAI_API_KEY is set", async () => {
    (process.env as Record<string, string | undefined>).OPENAI_API_KEY = "test-key";
    vi.mocked(generateText).mockResolvedValue({
      text: "AI generated summary",
      usage: { totalTokens: 10 },
    } as never);

    // Re-import fresh
    const { buildReportBundle } = await import("@/services/report-service");

    vi.mocked(prisma.assessment.findFirst).mockResolvedValue({
      id: "asm_1",
      userId: "user_1",
      status: "IN_PROGRESS",
      score: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      completedAt: null,
      organization: {
        id: "org_1",
        name: "Org",
        productName: "Product",
        description: "Desc",
        services: "Svc",
        targetCustomers: "Cust",
        problemSolved: "Prob",
        dataHandled: ["PII"],
        regions: ["US"],
      },
      items: [],
    } as never);

    const bundle = await buildReportBundle({ assessmentId: "asm_1", userId: "user_1" });
    expect(bundle.executiveSummary).toBe("AI generated summary");
    expect(generateText).toHaveBeenCalled();
  });

  it("falls back to narrative when AI generateText times out", async () => {
    (process.env as Record<string, string | undefined>).OPENAI_API_KEY = "test-key";
    vi.mocked(generateText).mockRejectedValue(new Error("Executive summary generation timed out"));

    const { buildReportBundle } = await import("@/services/report-service");

    vi.mocked(prisma.assessment.findFirst).mockResolvedValue({
      id: "asm_1",
      userId: "user_1",
      status: "IN_PROGRESS",
      score: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      completedAt: null,
      organization: {
        id: "org_1",
        name: "Org",
        productName: "Product",
        description: "Desc",
        services: "Svc",
        targetCustomers: "Cust",
        problemSolved: "Prob",
        dataHandled: ["PII"],
        regions: ["US"],
      },
      items: [],
    } as never);

    const bundle = await buildReportBundle({ assessmentId: "asm_1", userId: "user_1" });
    expect(bundle.executiveSummary).toContain("Product");
  });

  it("falls back when AI returns empty narrative", async () => {
    (process.env as Record<string, string | undefined>).OPENAI_API_KEY = "test-key";
    vi.mocked(generateText).mockResolvedValue({
      text: "   ",
      usage: { totalTokens: 5 },
    } as never);

    const { buildReportBundle } = await import("@/services/report-service");

    vi.mocked(prisma.assessment.findFirst).mockResolvedValue({
      id: "asm_1",
      userId: "user_1",
      status: "IN_PROGRESS",
      score: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      completedAt: null,
      organization: {
        id: "org_1",
        name: "Org",
        productName: "Product",
        description: "Desc",
        services: "Svc",
        targetCustomers: "Cust",
        problemSolved: "Prob",
        dataHandled: ["PII"],
        regions: ["US"],
      },
      items: [],
    } as never);

    const bundle = await buildReportBundle({ assessmentId: "asm_1", userId: "user_1" });
    expect(bundle.executiveSummary).toContain("Product");
  });

  it("throws 404 when assessment not found", async () => {
    (process.env as Record<string, string | undefined>).OPENAI_API_KEY = "test-key";
    vi.mocked(prisma.assessment.findFirst).mockResolvedValue(null);

    const { buildReportBundle } = await import("@/services/report-service");

    await expect(buildReportBundle({ assessmentId: "missing", userId: "user_1" })).rejects.toThrow(
      "404: Assessment not found",
    );
  });
});
