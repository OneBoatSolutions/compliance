import { describe, it, expect, vi } from "vitest";

// Mock prisma to prevent DATABASE_URL check
vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: { findMany: vi.fn() },
    aIInteraction: { create: vi.fn() },
  },
}));

import { parseRemediationResponse } from "@/services/ai-service";

const valid = {
  steps: [
    { title: "A", description: "do A", priority: "HIGH", owner: "IT", estimatedHours: 4 },
    { title: "B", description: "do B", priority: "MEDIUM", owner: "Ops", estimatedHours: 2 },
    { title: "C", description: "do C", priority: "LOW", owner: "Dev", estimatedHours: 1 },
  ],
  policies: ["P1", "P2"],
  technicalControls: ["T1", "T2"],
};

describe("parseRemediationResponse", () => {
  it("parses pure JSON", () => {
    const text = JSON.stringify(valid);
    const parsed = parseRemediationResponse(text);
    expect(parsed.steps.length).toBe(3);
    expect(parsed.policies.length).toBe(2);
  });

  it("parses JSON embedded in text", () => {
    const text = `Some intro text... ${JSON.stringify(valid)} end`;
    const parsed = parseRemediationResponse(text);
    expect(parsed.technicalControls).toEqual(valid.technicalControls);
  });

  it("accepts legacy policySuggestions field", () => {
    const legacy = { ...valid, policySuggestions: valid.policies };
    delete (legacy as Record<string, unknown>).policies;
    const text = JSON.stringify(legacy);
    const parsed = parseRemediationResponse(text);
    expect(parsed.policies).toEqual(valid.policies);
  });

  it("throws for invalid input", () => {
    expect(() => parseRemediationResponse("no json here")).toThrow();
    expect(() => parseRemediationResponse("{ bad json }")).toThrow();
  });
});
