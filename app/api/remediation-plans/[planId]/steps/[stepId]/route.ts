import { z } from "zod";

import { notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { withErrorHandler } from "@/lib/api-handler";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    planId: string;
    stepId: string;
  };
}

const updateStepSchema = z
  .object({
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    owner: z.string().trim().min(1).max(120).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const body = await req.json();
  const parsed = updateStepSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const existing = await prisma.remediationStep.findFirst({
    where: {
      id: params.stepId,
      planId: params.planId,
      plan: {
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    return notFoundResponse("Remediation step not found");
  }

  const updated = await prisma.$transaction(async (tx: typeof prisma) => {
    const step = await tx.remediationStep.update({
      where: {
        id: params.stepId,
      },
      data: {
        ...("owner" in parsed.data ? { owner: parsed.data.owner } : {}),
        ...("status" in parsed.data
          ? {
              status: parsed.data.status,
              completedAt: parsed.data.status === "DONE" ? new Date() : null,
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        owner: true,
        estimatedHours: true,
        status: true,
        sortOrder: true,
        completedAt: true,
      },
    });

    const remainingOpenSteps = await tx.remediationStep.count({
      where: {
        planId: params.planId,
        status: {
          not: "DONE",
        },
      },
    });

    await tx.remediationPlan.update({
      where: {
        id: params.planId,
      },
      data: {
        status: remainingOpenSteps === 0 ? "COMPLETED" : "ACTIVE",
      },
    });

    return step;
  });

  return successResponse(
    {
      ...updated,
      completedAt: updated.completedAt?.toISOString() ?? null,
    },
    200,
  );
});
