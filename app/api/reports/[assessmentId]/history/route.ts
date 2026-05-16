import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { generateSignedDownloadUrl } from "@/services/storage-service";
import { getStorageKeyFromReportUrl } from "@/services/report-service";

interface RouteContext {
  params: {
    assessmentId: string;
  };
}

interface ReportHistoryRow {
  id: string;
  type: string;
  format: string;
  fileUrl: string | null;
  generatedAt: Date;
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const reports = (await prisma.report.findMany({
    where: {
      assessmentId: params.assessmentId,
      assessment: {
        userId: session.user.id,
      },
    },
    orderBy: {
      generatedAt: "desc",
    },
    select: {
      id: true,
      type: true,
      format: true,
      fileUrl: true,
      generatedAt: true,
    },
  })) as ReportHistoryRow[];

  const history = await Promise.all(
    reports.map(async (report) => {
      let url: string | null = null;
      const storageKey = report.fileUrl ? getStorageKeyFromReportUrl(report.fileUrl) : null;

      if (storageKey) {
        url = await generateSignedDownloadUrl(storageKey);
      }

      return {
        id: report.id,
        type: report.type,
        format: report.format,
        generatedAt: report.generatedAt,
        url,
      };
    }),
  );

  return successResponse(history, 200);
});
