import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { recalculateAssessmentScore } from "@/lib/assessment-score";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateAssessmentItemSchema } from "@/lib/validations/assessment";

interface RouteContext {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

export const GET = withErrorHandler(async (req: Request, context: RouteContext) => {
  const params = await context.params;
  void req;

  const session = await requireAuth();
  const { id: assessmentId, itemId } = params;

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

  return successResponse({ evidence: assessmentItem.evidence }, 200);
});

export const PATCH = withErrorHandler(async (req: Request, context: RouteContext) => {
  const params = await context.params;
  const session = await requireAuth();
  const { id: assessmentId, itemId } = params;

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

  const startTime = Date.now();
  const data = await prisma.$transaction(async (tx: typeof prisma) => {
    const updatedItem = await tx.assessmentItem.update({
      where: {
        id: itemId,
      },
      data: parsed.data,
    });

    const scoreResult = await recalculateAssessmentScore(assessmentId, tx);

    return {
      item: updatedItem,
      score: scoreResult.score,
    };
  });
  const calculationDurationMs = Date.now() - startTime;

  return successResponse(
    {
      assessmentId,
      score: data.score,
      item: data.item,
      calculationDurationMs,
    },
    200,
  );
});
