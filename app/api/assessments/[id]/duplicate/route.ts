import { withErrorHandler } from "@/lib/api-handler";
import { errorResponse, notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const POST = withErrorHandler(async (req: Request, context: RouteContext) => {
  const params = await context.params;
  void req;

  const session = await requireAuth();
  const { id } = params;

  const sourceAssessment = await prisma.assessment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      organizationId: true,
      items: {
        select: {
          control: {
            select: {
              frameworkId: true,
            },
          },
        },
      },
    },
  });

  if (!sourceAssessment) {
    return notFoundResponse("Assessment not found");
  }

  const frameworkIds = [
    ...new Set(
      sourceAssessment.items.map(
        (item: { control: { frameworkId: string } }) => item.control.frameworkId,
      ),
    ),
  ];

  if (frameworkIds.length === 0) {
    return errorResponse("No frameworks found for this assessment", 400);
  }

  const controls = await prisma.control.findMany({
    where: {
      frameworkId: {
        in: frameworkIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (controls.length === 0) {
    return errorResponse("No controls found for selected frameworks", 400);
  }

  const duplicated = await prisma.$transaction(async (tx: typeof prisma) => {
    const assessment = await tx.assessment.create({
      data: {
        userId: session.user.id,
        organizationId: sourceAssessment.organizationId,
      },
      select: {
        id: true,
      },
    });

    const itemResult = await tx.assessmentItem.createMany({
      data: controls.map((control: { id: string }) => ({
        assessmentId: assessment.id,
        controlId: control.id,
      })),
    });

    return {
      assessmentId: assessment.id,
      totalItems: itemResult.count,
    };
  });

  return successResponse(duplicated, 201);
});
