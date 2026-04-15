import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { recalculateAssessmentScore } from "@/lib/assessment-score";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateAssessmentItemSchema } from "@/lib/validations/assessment";

interface RouteContext {
  params: {
    id: string;
    itemId: string;
  };
}

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
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

  const data = await prisma.$transaction(async (tx) => {
    await tx.assessmentItem.update({
      where: {
        id: itemId,
      },
      data: parsed.data,
    });

    const score = await recalculateAssessmentScore(assessmentId, tx);

    return score;
  });

  return successResponse({ score: data.score }, 200);
});
