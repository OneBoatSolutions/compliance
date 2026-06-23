import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withErrorHandler(async (req: Request, context: RouteContext) => {
  const params = await context.params;
  void req;

  const session = await requireAuth();
  const { id } = params;

  const assessment = await prisma.assessment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          control: {
            include: {
              framework: true,
            },
          },
          _count: {
            select: {
              evidence: true,
            },
          },
        },
      },
    },
  });

  if (!assessment) {
    return notFoundResponse("Assessment not found");
  }

  return successResponse(assessment, 200, {
    "Cache-Control": "private, no-cache",
  });
});

export const DELETE = withErrorHandler(async (req: Request, context: RouteContext) => {
  const params = await context.params;
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
