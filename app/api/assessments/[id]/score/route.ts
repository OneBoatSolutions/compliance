import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { getFrameworkScoresForAssessment } from "@/lib/assessment-score";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  const session = await requireAuth();
  const { id } = await params;

  const ownedAssessment = await prisma.assessment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      score: true,
    },
  });

  if (!ownedAssessment) {
    return notFoundResponse("Assessment not found");
  }

  const frameworkScores = await getFrameworkScoresForAssessment(id);

  return successResponse(
    {
      assessmentId: ownedAssessment.id,
      score: roundScore(Number(ownedAssessment.score ?? 0)),
      frameworkScores,
    },
    200,
  );
});
