import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { serviceErrorResponse } from "@/lib/service-error";
import { triggerPasswordReset } from "@/services/user-admin-service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  await requireAdmin();

  const { id } = await params;

  try {
    await triggerPasswordReset(id);
    return successResponse({ message: "Password reset email sent" });
  } catch (error) {
    return serviceErrorResponse(error);
  }
});
