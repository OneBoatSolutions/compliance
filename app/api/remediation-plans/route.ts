import { z } from "zod";

import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { withErrorHandler } from "@/lib/api-handler";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { RemediationPlanData, RemediationPlanStep } from "@/types/remediation";

const remediationStepSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  owner: z.string().trim().min(1).max(120),
  estimatedHours: z.coerce.number().int().min(1).max(1000),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
});

const saveRemediationPlanSchema = z
  .object({
    assessmentItemId: z.string().trim().min(1),
    controlId: z.string().trim().min(1),
    controlTitle: z.string().trim().min(1).max(200),
    controlDescription: z.string().trim().min(1).max(4000),
    frameworkName: z.string().trim().min(1).max(200),
    currentStatus: z.string().trim().min(1).max(80),
    severity: z.string().trim().min(1).max(40),
    title: z.string().trim().min(1).max(200).optional(),
    summary: z.string().trim().max(4000).optional(),
    steps: z.array(remediationStepSchema).min(1).max(20),
    policies: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
    technicalControls: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  })
  .strict();

interface PersistedPlan {
  id: string;
  assessmentId: string;
  assessmentItemId: string;
  controlId: string;
  title: string;
  summary: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  policies: string[];
  technicalControls: string[];
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  assessmentItem: {
    status: string;
    control: {
      title: string;
      description: string;
      severity: string;
      framework: {
        name: string;
      };
    };
  };
  steps: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    owner: string;
    estimatedHours: number;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    sortOrder: number;
    completedAt: Date | null;
  }>;
}

function mapPlan(plan: PersistedPlan): RemediationPlanData {
  return {
    id: plan.id,
    assessmentId: plan.assessmentId,
    assessmentItemId: plan.assessmentItemId,
    controlId: plan.controlId,
    controlTitle: plan.assessmentItem.control.title,
    controlDescription: plan.assessmentItem.control.description,
    frameworkName: plan.assessmentItem.control.framework.name,
    currentStatus: plan.assessmentItem.status,
    severity: plan.assessmentItem.control.severity,
    title: plan.title,
    summary: plan.summary,
    status: plan.status,
    policies: plan.policies,
    technicalControls: plan.technicalControls,
    generatedAt: plan.generatedAt.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    steps: plan.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      priority: step.priority as RemediationPlanStep["priority"],
      owner: step.owner,
      estimatedHours: step.estimatedHours,
      status: step.status,
      sortOrder: step.sortOrder,
      completedAt: step.completedAt?.toISOString() ?? null,
    })),
  };
}

function planInclude() {
  return {
    assessmentItem: {
      select: {
        status: true,
        control: {
          select: {
            title: true,
            description: true,
            severity: true,
            framework: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    },
    steps: {
      orderBy: {
        sortOrder: "asc" as const,
      },
    },
  };
}

async function findOwnedAssessmentItem(assessmentItemId: string, userId: string) {
  return prisma.assessmentItem.findFirst({
    where: {
      id: assessmentItemId,
      assessment: {
        userId,
      },
    },
    select: {
      id: true,
      assessmentId: true,
      controlId: true,
    },
  });
}

export const GET = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();
  const assessmentItemId = new URL(req.url).searchParams.get("assessmentItemId");

  if (!assessmentItemId) {
    return errorResponse("assessmentItemId is required", 400);
  }

  const plan = await prisma.remediationPlan.findFirst({
    where: {
      assessmentItemId,
      userId: session.user.id,
    },
    include: planInclude(),
  });

  return successResponse(plan ? mapPlan(plan as PersistedPlan) : null, 200);
});

export const POST = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();
  const body = await req.json();
  const parsed = saveRemediationPlanSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const assessmentItem = await findOwnedAssessmentItem(
    parsed.data.assessmentItemId,
    session.user.id,
  );

  if (!assessmentItem) {
    return notFoundResponse("Assessment item not found");
  }

  if (assessmentItem.controlId !== parsed.data.controlId) {
    return errorResponse("Control does not match assessment item", 400);
  }

  const steps = parsed.data.steps.map((step, index) => ({
    title: step.title,
    description: step.description,
    priority: step.priority,
    owner: step.owner,
    estimatedHours: step.estimatedHours,
    status: step.status ?? "TODO",
    completedAt: step.status === "DONE" ? new Date() : null,
    sortOrder: index,
  }));

  const plan = await prisma.$transaction(async (tx: typeof prisma) => {
    const saved = await tx.remediationPlan.upsert({
      where: {
        assessmentItemId: parsed.data.assessmentItemId,
      },
      update: {
        title: parsed.data.title ?? `Remediation plan for ${parsed.data.controlTitle}`,
        summary: parsed.data.summary ?? parsed.data.controlDescription,
        status: steps.every((step) => step.status === "DONE") ? "COMPLETED" : "ACTIVE",
        policies: parsed.data.policies,
        technicalControls: parsed.data.technicalControls,
        generatedAt: new Date(),
        steps: {
          deleteMany: {},
          create: steps,
        },
      },
      create: {
        assessmentId: assessmentItem.assessmentId,
        assessmentItemId: assessmentItem.id,
        controlId: assessmentItem.controlId,
        userId: session.user.id,
        title: parsed.data.title ?? `Remediation plan for ${parsed.data.controlTitle}`,
        summary: parsed.data.summary ?? parsed.data.controlDescription,
        status: steps.every((step) => step.status === "DONE") ? "COMPLETED" : "ACTIVE",
        policies: parsed.data.policies,
        technicalControls: parsed.data.technicalControls,
        steps: {
          create: steps,
        },
      },
      include: planInclude(),
    });

    return saved;
  });

  return successResponse(mapPlan(plan as PersistedPlan), 201);
});
