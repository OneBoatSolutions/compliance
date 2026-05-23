import { withErrorHandler } from "@/lib/api-handler";
import { successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { serviceErrorResponse } from "@/lib/service-error";
import { updateAdminUserSchema } from "@/lib/validations/user";
import { updateUser } from "@/services/user-admin-service";

interface RouteContext {
  params: { id: string };
}

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAdmin();

  const body = await req.json();
  const parsed = updateAdminUserSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  try {
    const user = await updateUser(session.user.id, params.id, parsed.data);
    return successResponse(user);
  } catch (error) {
    return serviceErrorResponse(error);
  }
});
