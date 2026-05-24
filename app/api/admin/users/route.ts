import { withErrorHandler } from "@/lib/api-handler";
import { successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { serviceErrorResponse } from "@/lib/service-error";
import { adminUserListQuerySchema, createAdminUserSchema } from "@/lib/validations/user";
import { createUser, listUsers } from "@/services/user-admin-service";

export const GET = withErrorHandler(async (req: Request) => {
  await requireAdmin();

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = adminUserListQuerySchema.safeParse(raw);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const result = await listUsers(parsed.data);
  return successResponse(result);
});

export const POST = withErrorHandler(async (req: Request) => {
  await requireAdmin();

  const body = await req.json();
  const parsed = createAdminUserSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  try {
    const user = await createUser(parsed.data);
    return successResponse(user, 201);
  } catch (error) {
    return serviceErrorResponse(error);
  }
});
