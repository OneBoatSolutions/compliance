import { forgotPasswordSchema } from "@/lib/validations/auth";
import { successResponse, validationErrorResponse } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  // In a future task, this will create a reset token
  // and email it to the user through the configured email service.
  return successResponse({
    message: "If an account with that email exists, password reset instructions have been sent.",
  });
}
