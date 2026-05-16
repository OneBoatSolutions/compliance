import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { getCachedAnalyticsData, type AnalyticsRangeDays } from "@/lib/analytics-data";

function parseRange(req: Request): AnalyticsRangeDays {
  const range = new URL(req.url).searchParams.get("range")?.trim().toLowerCase();

  if (range === "last 90 days") {
    return 90;
  }

  if (range === "all time") {
    return null;
  }

  return 30;
}

export const GET = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();
  const data = await getCachedAnalyticsData(session.user.id, parseRange(req));
  return successResponse(data);
});
