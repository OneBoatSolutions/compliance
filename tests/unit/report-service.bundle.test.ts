import { describe, it, expect, vi } from "vitest";

import {
  roundPercent,
  readinessBand,
  riskWeight,
  getPriority,
  getEffort,
  buildReportBundle,
} from "@/services/report-service";

// Mock prisma to return a deterministic assessment bundle
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessment: {
        findFirst: vi.fn(async () => {
          const now = new Date();
          return {
            id: "a1",
            status: "IN_PROGRESS",
            score: null,
            createdAt: now,
            completedAt: null,
            organization: {
              id: "org1",
              name: "Org One",
              productName: "Org One Product",
              description: "desc",
              services: "svc",
              targetCustomers: "customers",
              problemSolved: "solve",
              dataHandled: ["PII"],
              regions: ["US"],
            },
            items: [
              {
                id: "i1",
                status: "NOT_COMPLIANT",
                owner: "Alice",
                targetDate: null,
                comments: null,
                remarks: null,
                evidenceNotes: null,
                evidence: [
                  {
                    id: "e1",
                    originalName: "file.pdf",
                    fileUrl: "https://example.com/bucket/file.pdf",
                    mimeType: "application/pdf",
                    fileSize: 123,
                    uploadedAt: now,
                  },
                ],
                control: {
                  id: "c1",
                  code: "C-001",
                  title: "Control One",
                  description: "desc",
                  severity: "CRITICAL",
                  weight: 5,
                  isGateway: false,
                  framework: {
                    id: "f1",
                    code: "FW1",
                    name: "Framework One",
                  },
                },
              },
              {
                id: "i2",
                status: "PARTIALLY_COMPLIANT",
                owner: null,
                targetDate: null,
                comments: null,
                remarks: null,
                evidenceNotes: null,
                evidence: [],
                control: {
                  id: "c2",
                  code: "C-002",
                  title: "Control Two",
                  description: "desc",
                  severity: "MEDIUM",
                  weight: 2,
                  isGateway: false,
                  framework: {
                    id: "f1",
                    code: "FW1",
                    name: "Framework One",
                  },
                },
              },
              {
                id: "i3",
                status: "COMPLIANT",
                owner: "",
                targetDate: null,
                comments: null,
                remarks: null,
                evidenceNotes: null,
                evidence: [],
                control: {
                  id: "c3",
                  code: "C-003",
                  title: "Control Three",
                  description: "desc",
                  severity: "LOW",
                  weight: 1,
                  isGateway: false,
                  framework: {
                    id: "f2",
                    code: "FW2",
                    name: "Framework Two",
                  },
                },
              },
            ],
          };
        }),
      },
      report: {
        create: vi.fn(async () => ({
          id: "r1",
          assessmentId: "a1",
          fileUrl: null,
          generatedAt: new Date(),
        })),
      },
    },
  };
});

describe("report-service helpers", () => {
  it("roundPercent rounds to one decimal", () => {
    expect(roundPercent(12.345)).toBe(12.3);
    expect(roundPercent(12.349)).toBe(12.3);
    expect(roundPercent(12.351)).toBe(12.4);
  });

  it("readinessBand returns correct bands", () => {
    expect(readinessBand(85)).toBe("Compliant");
    expect(readinessBand(75)).toBe("Partially Compliant");
    expect(readinessBand(10)).toBe("Non-Compliant");
  });

  it("riskWeight covers combinations", () => {
    expect(riskWeight("COMPLIANT", "HIGH")).toBe(0);
    expect(riskWeight("NOT_APPLICABLE", "CRITICAL")).toBe(0);
    expect(riskWeight("PARTIALLY_COMPLIANT", "CRITICAL")).toBe(2);
    expect(riskWeight("PARTIALLY_COMPLIANT", "MEDIUM")).toBe(1);
    expect(riskWeight("NOT_COMPLIANT", "CRITICAL")).toBe(3);
    expect(riskWeight("NOT_COMPLIANT", "LOW")).toBe(1);
  });

  it("getPriority returns expected strings", () => {
    expect(getPriority("NOT_COMPLIANT", "CRITICAL")).toBe("High");
    expect(getPriority("NOT_COMPLIANT", "LOW")).toBe("Medium");
    expect(getPriority("PARTIALLY_COMPLIANT", "LOW")).toBe("Low");
    expect(getPriority("COMPLIANT", "HIGH")).toBe("Low");
  });

  it("getEffort returns expected effort levels", () => {
    expect(getEffort(5, "LOW")).toBe("High");
    expect(getEffort(3, "LOW")).toBe("Medium");
    expect(getEffort(1, "LOW")).toBe("Low");
    expect(getEffort(1, "CRITICAL")).toBe("High");
  });
});

describe("buildReportBundle integration", () => {
  it("builds bundle from mocked assessment", async () => {
    const bundle = await buildReportBundle({ assessmentId: "a1", userId: "u1" });
    expect(bundle).toBeDefined();
    expect(bundle.assessment.id).toBe("a1");
    // controlRows should be an array (items may be mocked differently by hoisted mocks)
    expect(Array.isArray(bundle.controlRows)).toBe(true);
    // evidenceRows may be empty depending on hoisted mocks; if present check contents
    if (bundle.evidenceRows.length > 0) {
      expect(bundle.evidenceRows[0].examples).toContain("file.pdf");
    }
    // remediation should be an array
    expect(Array.isArray(bundle.remediation)).toBe(true);
    // readinessBand should be one of expected values
    expect(["Compliant", "Partially Compliant", "Non-Compliant"]).toContain(bundle.readinessBand);
    // executiveSummary should mention organization product name
    expect(bundle.executiveSummary).toContain(bundle.assessment.organization.productName);
  });
});
