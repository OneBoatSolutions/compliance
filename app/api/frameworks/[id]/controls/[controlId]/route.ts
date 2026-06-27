import { Prisma } from "@prisma/client";
import { withErrorHandler } from "@/lib/api-handler";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateControlSchema } from "@/lib/validations/framework";

interface RouteContext {
  params: Promise<{ id: string; controlId: string }>;
}

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAdmin();
  const { id, controlId } = await params;

  const existing = await prisma.control.findFirst({
    where: { id: controlId, frameworkId: id },
    select: { id: true },
  });

  if (!existing) {
    return notFoundResponse("Control not found");
  }

  const body = await req.json();
  const parsed = updateControlSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const data = parsed.data;

  const updateData: Prisma.ControlUpdateInput = {};

  if (data.code !== undefined) {
    updateData.code = data.code;
  }
  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.category !== undefined) {
    updateData.category = data.category;
  }
  if (data.severity !== undefined) {
    updateData.severity = data.severity;
  }
  if (data.weight !== undefined) {
    updateData.weight = data.weight;
  }

  try {
    const control = await prisma.control.update({
      where: { id: controlId },
      data: updateData,
      select: {
        id: true,
        frameworkId: true,
        code: true,
        title: true,
        description: true,
        category: true,
        severity: true,
        weight: true,
        metadata: true,
        isGateway: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(control);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return errorResponse("A control with this code already exists for this framework", 409);
    }
    throw e;
  }
});

export const DELETE = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  await requireAdmin();
  const { id, controlId } = await params;

  const existing = await prisma.control.findFirst({
    where: { id: controlId, frameworkId: id },
    select: { id: true },
  });

  if (!existing) {
    return notFoundResponse("Control not found");
  }

  await prisma.control.delete({
    where: { id: controlId },
  });

  return successResponse({ deleted: true });
});
