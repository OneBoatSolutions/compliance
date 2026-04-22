import { withErrorHandler } from "@/lib/api-handler";
import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { parseMultipartRequest } from "@/lib/multipart";
import { prisma } from "@/lib/prisma";
import {
  evidenceUploadFieldsSchema,
  MAX_EVIDENCE_FILES_PER_ITEM,
  MAX_EVIDENCE_FILE_SIZE_BYTES,
} from "@/lib/validations/evidence";
import { uploadFileToStorage } from "@/services/storage-service";

async function scanFileBuffer(_fileBuffer: Buffer): Promise<void> {
  // ClamAV integration stub (fail-open for now).
}

export const POST = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();
  const parsed = await parseMultipartRequest(req);

  if (parsed.response) {
    return parsed.response;
  }

  if (parsed.files.length === 0) {
    return errorResponse("At least one file is required", 400);
  }

  const fieldsResult = evidenceUploadFieldsSchema.safeParse(parsed.fields);
  if (!fieldsResult.success) {
    return validationErrorResponse(fieldsResult.error.format());
  }

  for (const file of parsed.files) {
    if (file.size > MAX_EVIDENCE_FILE_SIZE_BYTES) {
      return errorResponse("File too large. Maximum supported size is 10MB", 413);
    }
  }

  const { assessmentItemId, description } = fieldsResult.data;

  const assessmentItem = await prisma.assessmentItem.findFirst({
    where: {
      id: assessmentItemId,
      assessment: {
        userId: session.user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!assessmentItem) {
    return notFoundResponse("Assessment item not found");
  }

  const existingFileCount = await prisma.evidence.count({
    where: { assessmentItemId },
  });

  if (existingFileCount + parsed.files.length > MAX_EVIDENCE_FILES_PER_ITEM) {
    return errorResponse(`Maximum ${MAX_EVIDENCE_FILES_PER_ITEM} files are allowed per assessment item`, 400);
  }

  const created = [];
  for (const file of parsed.files) {
    await scanFileBuffer(file.buffer);

    const uploaded = await uploadFileToStorage({
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    const evidence = await prisma.evidence.create({
      data: {
        assessmentItemId,
        userId: session.user.id,
        filename: uploaded.key,
        originalName: file.originalname,
        fileUrl: uploaded.url,
        fileSize: file.size,
        mimeType: file.mimetype,
        description: description || null,
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

  return successResponse({ evidence: created }, 201);
});
