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

  const startedAt = Date.now();

  const data = await prisma.$transaction(async (tx) => {
    const updatedItem = await tx.assessmentItem.update({
      where: {
        id: itemId,
      },
      data: parsed.data,
      select: {
        id: true,
        assessmentId: true,
        controlId: true,
        status: true,
        comments: true,
        owner: true,
        targetDate: true,
        remarks: true,
        evidenceNotes: true,
        updatedAt: true,
      },
    });

    const score = await recalculateAssessmentScore(assessmentId, tx);

    return {
      item: updatedItem,
      score,
    };
  });

  const calculationDurationMs = Date.now() - startedAt;

  return successResponse(
    {
      assessmentId: data.score.assessmentId,
      score: data.score.score,
      numerator: data.score.numerator,
      denominator: data.score.denominator,
      item: data.item,
      calculationDurationMs,
    },
    200,
  );
});
