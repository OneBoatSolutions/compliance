import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { getCachedDashboardData } from "@/lib/dashboard-data";

export const GET = withErrorHandler(async (_req: Request) => {
  const session = await requireAuth();
  const data = await getCachedDashboardData(session.user.id);
  return successResponse(data);
});
