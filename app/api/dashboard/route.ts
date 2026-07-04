import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { getCachedDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(async (req: Request) => {
  void req;

  const session = await requireAuth();
  const data = await getCachedDashboardData(session.user.id);
  return successResponse(data);
});
