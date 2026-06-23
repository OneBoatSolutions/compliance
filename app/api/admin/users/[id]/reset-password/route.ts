import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { serviceErrorResponse } from "@/lib/service-error";
import { triggerPasswordReset } from "@/services/user-admin-service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (req: Request, context: RouteContext) => {
  const params = await context.params;
  void req;
  await requireAdmin();

  try {
    const { id } = await params;
    await triggerPasswordReset(id);
    return successResponse({ message: "Password reset email sent" });
  } catch (error) {
    return serviceErrorResponse(error);
  }
});
