import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { invalidateDashboardCache } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const { id } = await params;

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

  return successResponse(assessment, 200);
});

export const DELETE = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const { id } = await params;

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

  // Bust the Redis dashboard cache so the next GET /api/dashboard
  // call returns fresh data without the deleted assessment.
  revalidateTag("dashboard");
  await invalidateDashboardCache(session.user.id);

  return successResponse({ id: ownedAssessment.id }, 200);
});
