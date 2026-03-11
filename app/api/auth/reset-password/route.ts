import { resetPasswordSchema } from "@/lib/validations/auth";
import { successResponse, validationErrorResponse } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  // In a future update, this will verify the provided token,
  // find the associated user account, and then update the user's password.
  return successResponse({
    message: "Password has been reset (stub implementation).",
  });
}
