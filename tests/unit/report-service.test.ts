import { describe, it, expect, vi } from "vitest";

// Prevent real Prisma client initialization if imported by module
vi.mock("../../lib/prisma", () => ({ prisma: {} }));

import {
  roundPercent,
  readinessBand,
  riskWeight,
  getPriority,
  getEffort,
} from "../../services/report-service";

describe("report-service helpers", () => {
  it("roundPercent rounds to one decimal", () => {
    expect(roundPercent(12.345)).toBe(12.3);
    expect(roundPercent(0)).toBe(0);
  });

  it("readinessBand returns proper band", () => {
    expect(readinessBand(85)).toBe("Compliant");
    expect(readinessBand(60)).toBe("Partially Compliant");
    expect(readinessBand(40)).toBe("Non-Compliant");
  });

  it("riskWeight computes weights correctly", () => {
    expect(riskWeight("COMPLIANT", "LOW")).toBe(0);
    expect(riskWeight("PARTIALLY_COMPLIANT", "HIGH")).toBe(2);
    expect(riskWeight("NOT_COMPLIANT", "CRITICAL")).toBe(3);
  });

  it("getPriority returns priority text", () => {
    expect(getPriority("NOT_COMPLIANT", "CRITICAL")).toBe("High");
    expect(getPriority("PARTIALLY_COMPLIANT", "LOW")).toBe("Low");
  });

  it("getEffort returns effort level", () => {
    expect(getEffort(1, "CRITICAL")).toBe("High");
    expect(getEffort(4.5, "MEDIUM")).toBe("High");
    expect(getEffort(1, "LOW")).toBe("Low");
  });
});
