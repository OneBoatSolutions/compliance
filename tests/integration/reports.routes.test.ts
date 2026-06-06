import { describe, it, expect } from "vitest";

// The old /api/reports/[assessmentId] route and /generate,/download,/history
// endpoints have been removed. The report feature now relies solely on the
// /view endpoint and the browser's native print-to-PDF capability.
//
// This file is kept as a placeholder to prevent import resolution issues.
// The report-service helpers are tested in tests/unit/report-service.test.ts
// and tests/unit/report-service.bundle.test.ts.

describe("Reports feature (web-only)", () => {
  it("report service helpers are tested separately", () => {
    expect(true).toBe(true);
  });
});
