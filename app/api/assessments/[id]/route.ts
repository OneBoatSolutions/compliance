import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    id: string;
  };
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const { id } = params;

  const assessment = await prisma.assessment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      organizationId: true,
      status: true,
      score: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          status: true,
          comments: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              evidence: true,
            },
          },
          control: {
            select: {
              id: true,
              code: true,
              title: true,
              description: true,
              severity: true,
              weight: true,
              framework: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!assessment) {
    return notFoundResponse("Assessment not found");
  }

  return successResponse(assessment, 200);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const { id } = params;

  const ownedAssessment = await prisma.assessment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!ownedAssessment) {
    return notFoundResponse("Assessment not found");
  }

  await prisma.assessment.delete({
    where: {
      id: ownedAssessment.id,
    },
  });

  return successResponse({ id: ownedAssessment.id }, 200);
});
