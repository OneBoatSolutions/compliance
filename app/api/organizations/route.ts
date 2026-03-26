import { prisma } from "@/lib/prisma";
import { createOrganizationSchema } from "@/lib/validations/organization";
import { requireAuth } from "@/lib/auth-helpers";
import { successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { withErrorHandler } from "@/lib/api-handler";

export const POST = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();

  const body = await req.json();

  const parsed = createOrganizationSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const organization = await prisma.organization.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  });

  return successResponse(organization, 201);
});
