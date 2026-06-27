import { withErrorHandler } from "@/lib/api-handler";
import {
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateOrganizationSchema } from "@/lib/validations/organization";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}
export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const { id } = await params;

  const organization = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
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

  if (!organization) {
    return notFoundResponse("Organization not found");
  }

  if (organization.userId !== session.user.id) {
    return forbiddenResponse();
  }

  return successResponse(organization);
});

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const { id } = await params;

  const organization = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!organization) {
    return notFoundResponse("Organization not found");
  }

  if (organization.userId !== session.user.id) {
    return forbiddenResponse();
  }

  const body = await req.json();
  const parsed = updateOrganizationSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data: parsed.data,
  });

  return successResponse(updatedOrganization);
});
