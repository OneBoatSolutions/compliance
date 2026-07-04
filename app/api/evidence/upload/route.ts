/**
 * app/api/evidence/upload/route.ts
 * --------------------------------
 * Secure file upload endpoint — Sprint 9.1 Security Hardening.
 *
 * Security layers applied (in order):
 *   1. Authentication check (requireAuth)
 *   2. Redis rate limiting (10 uploads / minute per user)
 *   3. Size limit (10 MB enforced BEFORE buffering)
 *   4. MIME type allow-list (declared type)
 *   5. File extension allow-list
 *   6. Magic-byte verification (true file type, not just header/extension)
 *   7. Filename sanitisation (path traversal prevention)
 *   8. ClamAV virus scan stub (fail-open until ClamAV is deployed)
 *   9. Ownership check (assessment item belongs to authenticated user)
 *  10. Per-item file count cap
 */

import { withErrorHandler } from "@/lib/api-handler";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { invalidateDashboardCache } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/auth-helpers";
import { sanitizeFilename, scanFileBuffer, verifyFileMagic } from "@/lib/file-validation";
import { parseMultipartRequest } from "@/lib/multipart";
import { prisma } from "@/lib/prisma";
import { rateLimitByUser, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";
import {
  allowedEvidenceMimeTypes,
  evidenceUploadFieldsSchema,
  isAllowedEvidenceExtension,
  isAllowedEvidenceMimeType,
  maxEvidenceFilesPerItem,
  maxEvidenceFileSizeBytes,
} from "@/lib/validations/evidence";
import { uploadFileToStorage } from "@/services/storage-service";

export const POST = withErrorHandler(async (req: Request) => {
  // ── 1. Authentication ─────────────────────────────────────────────────────
  const session = await requireAuth();

  // ── 2. Rate limiting (per authenticated user) ─────────────────────────────
  const rateLimited = await rateLimitByUser(req, session.user.id, RATE_LIMIT_CONFIGS.upload);
  if (rateLimited) {
    return rateLimited;
  }

  // ── 3. Parse multipart (size cap is enforced inside parseMultipartRequest) ─
  const parsed = await parseMultipartRequest(req);
  if (parsed.response) {
    return parsed.response;
  }
  if (parsed.files.length === 0) {
    return errorResponse("At least one file is required", 400);
  }

  // ── 4-5-6-7-8. Per-file security checks ──────────────────────────────────
  for (const file of parsed.files) {
    // 4. Hard size limit
    if (file.size > maxEvidenceFileSizeBytes) {
      return errorResponse(`File "${file.originalname}" exceeds the 10 MB size limit`, 413);
    }

    // 5. Declared MIME-type allow-list
    if (!isAllowedEvidenceMimeType(file.mimetype)) {
      return errorResponse(
        `File type "${file.mimetype}" is not allowed. ` +
          `Permitted types: ${allowedEvidenceMimeTypes.join(", ")}`,
        415,
      );
    }

    // 6. File extension allow-list (belt-and-suspenders with MIME check)
    if (!isAllowedEvidenceExtension(file.originalname)) {
      return errorResponse(`File extension for "${file.originalname}" is not permitted`, 415);
    }

    // 7. Magic-byte verification — confirms true file type.
    //    For text/CSV uploads the validator may also neutralise formula-
    //    injection fields and return a sanitizedBuffer; we use that for all
    //    subsequent steps so only clean content reaches storage.
    const magicCheck = verifyFileMagic(file.buffer, file.mimetype);

    // Oversized text/CSV: the file is valid UTF-8 but exceeds the in-memory
    // scanning ceiling.  Return 413 so the client knows to split the file.
    if (magicCheck.oversized) {
      return errorResponse(
        `File "${file.originalname}" is too large for content scanning: ${magicCheck.reason}`,
        413,
      );
    }

    if (!magicCheck.valid) {
      return errorResponse(
        `File "${file.originalname}" failed content verification: ${magicCheck.reason}`,
        415,
      );
    }

    // If the validator sanitised formula-injection fields, switch to the clean
    // buffer for the remainder of this file's processing pipeline.
    const effectiveBuffer = magicCheck.sanitizedBuffer ?? file.buffer;
    if (magicCheck.sanitizedBuffer) {
      // eslint-disable-next-line no-console
      console.info(
        `[upload] Neutralised ${magicCheck.neutralizedFieldCount ?? 0} formula-injection ` +
          `field(s) in "${file.originalname}" — persisting sanitised content.`,
      );
      // Update the file object in place so the storage step picks up the
      // sanitised buffer without needing extra branching below.
      file.buffer = effectiveBuffer;
      file.size = effectiveBuffer.length;
    }

    // 8. Virus scan (ClamAV stub — fail-open; set CLAMAV_FAIL_OPEN=false to harden)
    const scanResult = await scanFileBuffer(effectiveBuffer);
    if (!scanResult.clean) {
      return errorResponse(
        `File "${file.originalname}" failed virus scan: ${scanResult.threat ?? "threat detected"}`,
        422,
      );
    }
  }

  // ── Zod validation on form fields ─────────────────────────────────────────
  const fieldsResult = evidenceUploadFieldsSchema.safeParse(parsed.fields);
  if (!fieldsResult.success) {
    return validationErrorResponse(fieldsResult.error.format());
  }

  const { assessmentItemId, description } = fieldsResult.data;

  // ── 9. Ownership check ────────────────────────────────────────────────────
  const assessmentItem = await prisma.assessmentItem.findFirst({
    where: {
      id: assessmentItemId,
      assessment: { userId: session.user.id },
    },
    select: { id: true },
  });

  if (!assessmentItem) {
    return notFoundResponse("Assessment item not found");
  }

  // ── 10. Per-item file count cap ───────────────────────────────────────────
  const existingFileCount = await prisma.evidence.count({
    where: { assessmentItemId },
  });

  if (existingFileCount + parsed.files.length > maxEvidenceFilesPerItem) {
    return errorResponse(
      `Maximum ${maxEvidenceFilesPerItem} files are allowed per assessment item`,
      400,
    );
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  const created = [];
  for (const file of parsed.files) {
    // Sanitise filename before storage to prevent path traversal.
    const safeFilename = sanitizeFilename(file.originalname);

    const uploaded = await uploadFileToStorage({
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: safeFilename,
    });

    const evidence = await prisma.evidence.create({
      data: {
        assessmentItemId,
        userId: session.user.id,
        filename: uploaded.key,
        originalName: safeFilename,
        fileUrl: uploaded.url,
        fileSize: file.size,
        mimeType: file.mimetype,
        description: description ?? null,
      },
      select: {
        id: true,
        assessmentItemId: true,
        filename: true,
        originalName: true,
        fileUrl: true,
        fileSize: true,
        mimeType: true,
        description: true,
        uploadedAt: true,
      },
    });

    created.push(evidence);
  }

  await invalidateDashboardCache(session.user.id);

  return successResponse({ evidence: created }, 201);
});
