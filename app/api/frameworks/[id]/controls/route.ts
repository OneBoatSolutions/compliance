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
import { createControlSchema } from "@/lib/validations/framework";

interface RouteContext {
  params: { id: string };
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAdmin();

  const framework = await prisma.framework.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!framework) {
    return notFoundResponse("Framework not found");
  }

  const body = await req.json();
  const parsed = createControlSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const data = parsed.data;

  try {
    const control = await prisma.control.create({
      data: {
        frameworkId: params.id,
        code: data.code,
        title: data.title,
        description: data.description,
        category: data.category ?? null,
        severity: data.severity,
        weight: data.weight,
      },
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

    return successResponse(control, 201);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return errorResponse("A control with this code already exists for this framework", 409);
    }
    throw e;
  }
});
