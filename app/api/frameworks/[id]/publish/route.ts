import { FrameworkStatus } from "@prisma/client";
import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  await requireAdmin();

  const framework = await prisma.framework.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!framework) {
    return notFoundResponse("Framework not found");
  }

  const controlCount = await prisma.control.count({
    where: { frameworkId: params.id },
  });

  if (controlCount === 0) {
    return validationErrorResponse({
      controls: ["Framework must have at least one control before it can be published"],
    });
  }

  const updated = await prisma.framework.update({
    where: { id: params.id },
    data: {
      status: FrameworkStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      region: true,
      category: true,
      version: true,
      effectiveDate: true,
      sourceLink: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return successResponse(updated);
});
