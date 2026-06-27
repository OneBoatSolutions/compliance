import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiClientError } from "@/lib/api-client";

interface RouteContext {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  const session = await requireAuth();
  const { id, itemId } = await params;

  const item = await prisma.assessmentItem.findFirst({
    where: {
      id: itemId,
      assessmentId: id,
      assessment: {
        userId: session.user.id,
      },
    },
  });

  if (!item) {
    return notFoundResponse("Assessment item not found");
  }

  const comments = await prisma.comment.findMany({
    where: {
      assessmentItemId: itemId,
    },
    select: {
      id: true,
      userName: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return successResponse(comments);
});

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const { id, itemId } = await params;

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiClientError({
      status: 400,
      code: "REQUEST_ERROR",
      message: parsed.error.issues[0].message,
    });
  }

  const item = await prisma.assessmentItem.findFirst({
    where: {
      id: itemId,
      assessmentId: id,
      assessment: {
        userId: session.user.id,
      },
    },
  });

  if (!item) {
    return notFoundResponse("Assessment item not found");
  }

  const comment = await prisma.comment.create({
    data: {
      assessmentItemId: itemId,
      userId: session.user.id,
      userName: session.user.name || "User",
      content: parsed.data.content,
    },
  });

  return successResponse(comment, 201);
});
