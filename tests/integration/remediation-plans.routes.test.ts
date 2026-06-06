import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as remediationPlanPost } from "@/app/api/remediation-plans/route";
import { PATCH as remediationStepPatch } from "@/app/api/remediation-plans/[planId]/steps/[stepId]/route";
import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";

vi.mock("@/lib/prisma", () => {
  const prismaMock = {
    assessmentItem: {
      findFirst: vi.fn(),
    },
    remediationPlan: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
    remediationStep: {
      findFirst: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prismaMock)),
  };

  return {
    prisma: prismaMock,
  };
});

const savedPlan = {
  id: "plan_1",
  assessmentId: "asm_1",
  assessmentItemId: "item_1",
  controlId: "ctrl_1",
  title: "Remediation plan for Access Control",
  summary: "Fix access control",
  status: "ACTIVE",
  policies: ["Access Control Policy"],
  technicalControls: ["MFA"],
  generatedAt: new Date("2026-01-01T00:00:00.000Z"),
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  assessmentItem: {
    status: "NOT_COMPLIANT",
    control: {
      title: "Access Control",
      description: "Restrict access",
      severity: "HIGH",
      framework: {
        name: "HIPAA",
      },
    },
  },
  steps: [
    {
      id: "step_1",
      title: "Enable MFA",
      description: "Enable MFA for all users",
      priority: "HIGH",
      owner: "IT Security",
      estimatedHours: 8,
      status: "TODO",
      sortOrder: 0,
      completedAt: null,
    },
  ],
};

describe("Remediation plan routes", () => {
  const session = { user: { id: "user_1", role: "USER" as const } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
  });

  it("saves a generated remediation plan as relational steps", async () => {
    vi.spyOn(prisma.assessmentItem, "findFirst").mockResolvedValue({
      id: "item_1",
      assessmentId: "asm_1",
      controlId: "ctrl_1",
    } as never);
    vi.spyOn(prisma.remediationPlan, "upsert").mockResolvedValue(savedPlan as never);

    const req = new Request("http://localhost/api/remediation-plans", {
      method: "POST",
      body: JSON.stringify({
        assessmentItemId: "item_1",
        controlId: "ctrl_1",
        controlTitle: "Access Control",
        controlDescription: "Restrict access",
        frameworkName: "HIPAA",
        currentStatus: "NOT_COMPLIANT",
        severity: "HIGH",
        steps: [
          {
            title: "Enable MFA",
            description: "Enable MFA for all users",
            priority: "HIGH",
            owner: "IT Security",
            estimatedHours: 8,
          },
        ],
        policies: ["Access Control Policy"],
        technicalControls: ["MFA"],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await remediationPlanPost(req)) as Response;
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.steps[0].id).toBe("step_1");
    expect(prisma.remediationPlan.upsert).toHaveBeenCalled();
  });

  it("updates a remediation step status", async () => {
    vi.spyOn(prisma.remediationStep, "findFirst").mockResolvedValue({
      id: "step_1",
      status: "TODO",
    } as never);
    vi.spyOn(prisma.remediationStep, "update").mockResolvedValue({
      ...savedPlan.steps[0],
      status: "DONE",
      completedAt: new Date("2026-01-02T00:00:00.000Z"),
    } as never);
    vi.spyOn(prisma.remediationStep, "count").mockResolvedValue(0 as never);
    vi.spyOn(prisma.remediationPlan, "update").mockResolvedValue({} as never);

    const req = new Request("http://localhost/api/remediation-plans/plan_1/steps/step_1", {
      method: "PATCH",
      body: JSON.stringify({
        status: "DONE",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await remediationStepPatch(req, {
      params: { planId: "plan_1", stepId: "step_1" },
    })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("DONE");
    expect(prisma.remediationPlan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          status: "COMPLETED",
        },
      }),
    );
  });
});
