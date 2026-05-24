import { prisma } from "@/lib/prisma";
import { createOrganizationSchema } from "@/lib/validations/organization";
import { requireAuth } from "@/lib/auth-helpers";
import { successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async () => {
  const session = await requireAuth();

  const organizations = await prisma.organization.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      productName: true,
      description: true,
      services: true,
      targetCustomers: true,
      problemSolved: true,
      dataHandled: true,
      regions: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return successResponse(organizations, 200);
});

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
