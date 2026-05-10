import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { getLatestReportForAssessment } from "@/services/report-service";

interface RouteContext {
  params: {
    assessmentId: string;
  };
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const report = await getLatestReportForAssessment({
    assessmentId: params.assessmentId,
    userId: session.user.id,
  });

  if (!report) {
    return notFoundResponse("Report not found");
  }

  return successResponse(report, 200);
});
