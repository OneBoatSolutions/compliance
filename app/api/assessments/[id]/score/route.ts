import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { recalculateAssessmentScore } from "@/lib/assessment-score";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    id: string;
  };
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  const session = await requireAuth();
  const { id } = params;

  const ownedAssessment = await prisma.assessment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!ownedAssessment) {
    return notFoundResponse("Assessment not found");
  }

  const startedAt = Date.now();
  const scoreResult = await recalculateAssessmentScore(id);
  const calculationDurationMs = Date.now() - startedAt;

  return successResponse(
    {
      ...scoreResult,
      calculationDurationMs,
    },
    200,
  );
});
