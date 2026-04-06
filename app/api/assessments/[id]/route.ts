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
    include: {
      items: {
        include: {
          control: {
            include: {
              framework: true,
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
