import path from "node:path";
import { z } from "zod";

export const maxEvidenceFilesPerItem = 20;
export const maxEvidenceFileSizeBytes = 10 * 1024 * 1024; // 10MB
export const signedDownloadUrlExpiresInSeconds = 7 * 24 * 60 * 60; // 7 days

export const allowedEvidenceMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
  "text/csv",
  "application/zip",
] as const;

const allowedFileExtensions = new Set([
  ".pdf",
  ".docx",
  ".xlsx",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".csv",
  ".zip",
]);

export const evidenceUploadFieldsSchema = z.object({
  assessmentItemId: z.string().cuid(),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
});

export function isAllowedEvidenceMimeType(mimeType: string) {
  return allowedEvidenceMimeTypes.includes(mimeType as (typeof allowedEvidenceMimeTypes)[number]);
}

export function isAllowedEvidenceExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return allowedFileExtensions.has(ext);
}
