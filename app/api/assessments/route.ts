import { withErrorHandler } from "@/lib/api-handler";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createAssessmentSchema } from "@/lib/validations/assessment";

export const POST = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();

  const body = await req.json();
  const parsed = createAssessmentSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const { organizationId, frameworkIds } = parsed.data;
  const uniqueFrameworkIds = [...new Set(frameworkIds)];

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!organization) {
    return notFoundResponse("Organization not found");
  }

  if (organization.userId !== session.user.id) {
    throw new Error("403: Forbidden");
  }

  const frameworks = await prisma.framework.findMany({
    where: {
      id: {
        in: uniqueFrameworkIds,
      },
      status: "PUBLISHED",
    },
    select: {
      id: true,
    },
  });

  if (frameworks.length !== uniqueFrameworkIds.length) {
    return errorResponse("One or more frameworks were not found or are not published", 400);
  }

  const controls = await prisma.control.findMany({
    where: {
      frameworkId: {
        in: uniqueFrameworkIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (controls.length === 0) {
    return errorResponse("No controls found for selected frameworks", 400);
  }

  const created = await prisma.$transaction(async (tx) => {
    const assessment = await tx.assessment.create({
      data: {
        userId: session.user.id,
        organizationId,
      },
      select: {
        id: true,
      },
    });

    const itemResult = await tx.assessmentItem.createMany({
      data: controls.map((control) => ({
        assessmentId: assessment.id,
        controlId: control.id,
      })),
    });

    return {
      assessmentId: assessment.id,
      totalItems: itemResult.count,
    };
  });

  return successResponse(created, 201);
});

export const GET = withErrorHandler(async () => {
  const session = await requireAuth();

  const assessments = await prisma.assessment.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      score: true,
      createdAt: true,
      organizationId: true,
    },
  });

  return successResponse(assessments, 200);
});
