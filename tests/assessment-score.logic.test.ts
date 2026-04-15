import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}));

import {
  computeFrameworkScores,
  computeOverallScore,
  roundScore,
  statusFactor,
  type ScoreItemRow,
} from "@/lib/assessment-score";

function row(
  status: ScoreItemRow["status"],
  weight: number,
  frameworkId: string,
  frameworkCode: string,
  frameworkName: string,
): ScoreItemRow {
  return {
    status,
    control: {
      weight,
      frameworkId,
      framework: {
        id: frameworkId,
        code: frameworkCode,
        name: frameworkName,
      },
    },
  };
}

describe("Assessment scoring logic", () => {
  it("maps status factors per PRD", () => {
    expect(statusFactor("COMPLIANT")).toBe(1);
    expect(statusFactor("PARTIALLY_COMPLIANT")).toBe(0.5);
    expect(statusFactor("NOT_COMPLIANT")).toBe(0);
    expect(statusFactor("NOT_STARTED")).toBe(0);
    expect(statusFactor("NOT_APPLICABLE")).toBeNull();
  });

  it("excludes NOT_APPLICABLE from denominator", () => {
    const rows: ScoreItemRow[] = [
      row("COMPLIANT", 2, "fw1", "GDPR", "GDPR"),
      row("NOT_APPLICABLE", 8, "fw1", "GDPR", "GDPR"),
    ];

    // (2*1.0)/(2) * 100 = 100
    expect(computeOverallScore(rows)).toBe(100);
  });

  it("computes weighted mixed compliance correctly", () => {
    const rows: ScoreItemRow[] = [
      row("COMPLIANT", 2, "fw1", "GDPR", "GDPR"),
      row("PARTIALLY_COMPLIANT", 4, "fw1", "GDPR", "GDPR"),
      row("NOT_COMPLIANT", 4, "fw1", "GDPR", "GDPR"),
    ];

    // numerator = 2*1 + 4*0.5 + 4*0 = 4
    // denominator = 10
    // score = 40.0
    expect(computeOverallScore(rows)).toBe(40);
  });

  it("returns 0 when denominator is zero", () => {
    const rows: ScoreItemRow[] = [
      row("NOT_APPLICABLE", 2, "fw1", "GDPR", "GDPR"),
      row("NOT_APPLICABLE", 5, "fw1", "GDPR", "GDPR"),
    ];

    expect(computeOverallScore(rows)).toBe(0);
  });

  it("rounds to 1 decimal place", () => {
    // 2/3*100 = 66.666...
    const rows: ScoreItemRow[] = [
      row("COMPLIANT", 2, "fw1", "GDPR", "GDPR"),
      row("NOT_COMPLIANT", 1, "fw1", "GDPR", "GDPR"),
    ];

    expect(computeOverallScore(rows)).toBe(66.7);
    expect(roundScore(66.666)).toBe(66.7);
  });

  it("computes per-framework scores and sorts by framework code", () => {
    const rows: ScoreItemRow[] = [
      row("PARTIALLY_COMPLIANT", 2, "fw_b", "PCI", "PCI DSS"),
      row("COMPLIANT", 2, "fw_a", "GDPR", "GDPR"),
      row("NOT_COMPLIANT", 2, "fw_a", "GDPR", "GDPR"),
    ];

    const frameworkScores = computeFrameworkScores(rows);

    expect(frameworkScores).toEqual([
      {
        frameworkId: "fw_a",
        frameworkCode: "GDPR",
        frameworkName: "GDPR",
        score: 50,
      },
      {
        frameworkId: "fw_b",
        frameworkCode: "PCI",
        frameworkName: "PCI DSS",
        score: 50,
      },
    ]);
  });
});
