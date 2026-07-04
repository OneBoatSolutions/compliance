import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { recalculateAssessmentScore } from "@/lib/assessment-score";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateAssessmentItemSchema } from "@/lib/validations/assessment";
import { revalidateTag } from "next/cache";
import { invalidateDashboardCache } from "@/lib/dashboard-data";

interface RouteContext {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const { id: assessmentId, itemId } = await params;

  const assessmentItem = await prisma.assessmentItem.findFirst({
    where: {
      id: itemId,
      assessmentId,
      assessment: {
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      status: true,
      comments: true,
      owner: true,
      targetDate: true,
      evidence: {
        orderBy: {
          uploadedAt: "desc",
        },
        select: {
          id: true,
          originalName: true,
          fileSize: true,
          mimeType: true,
          description: true,
          uploadedAt: true,
        },
      },
    },
  });

  if (!assessmentItem) {
    return notFoundResponse("Assessment item not found");
  }

  return successResponse(
    {
      status: assessmentItem.status,
      comments: assessmentItem.comments,
      owner: assessmentItem.owner,
      targetDate: assessmentItem.targetDate ? assessmentItem.targetDate.toISOString() : null,
      evidence: assessmentItem.evidence,
    },
    200,
  );
});

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const { id: assessmentId, itemId } = await params;

  const ownedAssessmentItem = await prisma.assessmentItem.findFirst({
    where: {
      id: itemId,
      assessmentId,
      assessment: {
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      assessmentId: true,
    },
  });

  if (!ownedAssessmentItem) {
    return notFoundResponse("Assessment item not found");
  }

  const body = await req.json();
  const parsed = updateAssessmentItemSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const data = await prisma.$transaction(async (tx: typeof prisma) => {
    await tx.assessmentItem.update({
      where: {
        id: itemId,
      },
      data: parsed.data,
    });

    const score = await recalculateAssessmentScore(assessmentId, tx);

    return score;
  });

  revalidateTag("dashboard");
  await invalidateDashboardCache(session.user.id);

  return successResponse({ score: data.score }, 200);
});
