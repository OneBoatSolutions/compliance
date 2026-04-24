import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { deleteFileFromStorage, generateSignedDownloadUrl } from "@/services/storage-service";

interface RouteContext {
  params: { id: string };
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  const session = await requireAuth();

  const evidence = await prisma.evidence.findFirst({
    where: {
      id: params.id,
      assessmentItem: {
        assessment: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      filename: true,
      originalName: true,
      fileSize: true,
      mimeType: true,
      description: true,
      uploadedAt: true,
    },
  });

  if (!evidence) {
    return notFoundResponse("Evidence not found");
  }

  const downloadUrl = await generateSignedDownloadUrl(evidence.filename);

  return successResponse({
    ...evidence,
    downloadUrl,
  });
});

export const DELETE = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  const session = await requireAuth();

  const evidence = await prisma.evidence.findFirst({
    where: {
      id: params.id,
      assessmentItem: {
        assessment: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      filename: true,
    },
  });

  if (!evidence) {
    return notFoundResponse("Evidence not found");
  }

  await deleteFileFromStorage(evidence.filename);
  await prisma.evidence.delete({
    where: {
      id: evidence.id,
    },
  });

  return successResponse({
    id: evidence.id,
    deleted: true,
  });
});
