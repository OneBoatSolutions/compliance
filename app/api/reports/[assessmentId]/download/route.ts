import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { generateSignedDownloadUrl } from "@/services/storage-service";
import {
  getLatestReportForAssessment,
  getStorageKeyFromReportUrl,
} from "@/services/report-service";

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

  if (!report || !report.fileUrl) {
    return notFoundResponse("Report not available yet");
  }

  const storageKey = getStorageKeyFromReportUrl(report.fileUrl);
  if (!storageKey) {
    return notFoundResponse("Report file could not be resolved");
  }

  const url = await generateSignedDownloadUrl(storageKey);
  return successResponse({ url }, 200);
});
