import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { getCachedAnalyticsData } from "@/lib/analytics-data";

export const GET = withErrorHandler(async (req: Request) => {
  void req;
  const session = await requireAuth();
  const data = await getCachedAnalyticsData(session.user.id);
  return successResponse(data);
});
