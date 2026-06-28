import { withErrorHandler } from "@/lib/api-handler";
import { errorResponse, notFoundResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;

  const session = await requireAuth();
  const { id } = await params;

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
              framework: {
                select: {
                  controls: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!sourceAssessment) {
    return notFoundResponse("Assessment not found");
  }

  const controlIdSet = new Set<string>();
  for (const item of sourceAssessment.items) {
    const controlsList = item.control.framework.controls;
    for (const c of controlsList) {
      controlIdSet.add(c.id);
    }
  }

  const controls = Array.from(controlIdSet).map((id) => ({ id }));

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

  revalidateTag("dashboard");

  return successResponse(duplicated, 201);
});
