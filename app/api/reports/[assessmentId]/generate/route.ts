import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { generateAssessmentReport } from "@/services/report-service";

interface RouteContext {
  params: {
    assessmentId: string;
  };
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const assessment = await prisma.assessment.findFirst({
    where: {
      id: params.assessmentId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!assessment) {
    return notFoundResponse("Assessment not found");
  }

  const report = await generateAssessmentReport({
    assessmentId: assessment.id,
    userId: session.user.id,
  });

  return successResponse(report, 201);
});
