import { describe, it, expect } from "vitest";

import {
  isAllowedEvidenceExtension,
  isAllowedEvidenceMimeType,
  maxEvidenceFilesPerItem,
  maxEvidenceFileSizeBytes,
  signedDownloadUrlExpiresInSeconds,
  evidenceUploadFieldsSchema,
} from "@/lib/validations/evidence";

describe("evidence validations", () => {
  it("exports expected constants", () => {
    expect(maxEvidenceFilesPerItem).toBe(20);
    expect(maxEvidenceFileSizeBytes).toBe(10 * 1024 * 1024);
    expect(signedDownloadUrlExpiresInSeconds).toBe(7 * 24 * 60 * 60);
  });

  it("accepts allowed mime types", () => {
    expect(isAllowedEvidenceMimeType("application/pdf")).toBe(true);
    expect(isAllowedEvidenceMimeType("image/png")).toBe(true);
    expect(isAllowedEvidenceMimeType("image/jpeg")).toBe(true);
    expect(isAllowedEvidenceMimeType("text/csv")).toBe(true);
    expect(
      isAllowedEvidenceMimeType(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe(true);
  });

  it("rejects disallowed mime types", () => {
    expect(isAllowedEvidenceMimeType("application/exe")).toBe(false);
    expect(isAllowedEvidenceMimeType("")).toBe(false);
  });

  it("accepts allowed extensions", () => {
    expect(isAllowedEvidenceExtension("doc.pdf")).toBe(true);
    expect(isAllowedEvidenceExtension("image.PNG")).toBe(true);
    expect(isAllowedEvidenceExtension("file.docx")).toBe(true);
  });

  it("rejects disallowed extensions", () => {
    expect(isAllowedEvidenceExtension("script.exe")).toBe(false);
    expect(isAllowedEvidenceExtension("archive.tar")).toBe(false);
    expect(isAllowedEvidenceExtension("no-extension")).toBe(false);
  });

  it("evidenceUploadFieldsSchema accepts valid payload", () => {
    const result = evidenceUploadFieldsSchema.safeParse({
      assessmentItemId: "ckxxxxxxxxxxxxxxxxxxxxxxx",
      description: "ok",
    });
    expect(result.success).toBe(true);
  });

  it("evidenceUploadFieldsSchema rejects invalid cuid", () => {
    const result = evidenceUploadFieldsSchema.safeParse({
      assessmentItemId: "not-a-cuid",
    });
    expect(result.success).toBe(false);
  });

  it("evidenceUploadFieldsSchema enforces max description length", () => {
    const result = evidenceUploadFieldsSchema.safeParse({
      assessmentItemId: "ckxxxxxxxxxxxxxxxxxxxxxxx",
      description: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
