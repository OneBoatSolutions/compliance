import { withErrorHandler } from "@/lib/api-handler";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-helpers";

interface RouteContext {
  params: {
    id: string;
    itemId: string;
  };
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAuth();

  const item = await prisma.assessmentItem.findUnique({
    where: { id: params.itemId },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!item) {
    throw new Error("Assessment item not found");
  }

  const evidence = await prisma.evidence.findMany({
    where: { assessmentItemId: params.itemId },
    select: {
      id: true,
      filename: true,
      uploadedAt: true,
      userId: true,
    },
  });

  const comments = await prisma.comment.findMany({
    where: { assessmentItemId: params.itemId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userName: true,
    },
  });

  const timeline = [
    {
      id: `created-${params.itemId}`,
      type: "CREATED",
      date: item.createdAt,
      user: "System",
      details: "Control item created",
    },
    ...evidence.map((e: { id: string; filename: string; uploadedAt: Date; userId: string }) => ({
      id: `evidence-${e.id}`,
      type: "EVIDENCE",
      date: e.uploadedAt,
      user: e.userId || "Uploader",
      details: `Uploaded evidence: ${e.filename}`,
    })),
    ...comments.map((c: { id: string; content: string; createdAt: Date; userName: string }) => ({
      id: `comment-${c.id}`,
      type: "COMMENT",
      date: c.createdAt,
      user: c.userName,
      details: c.content,
    })),
  ];

  // Sort descending by date
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return successResponse(timeline);
});
