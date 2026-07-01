import { ListChecks } from "lucide-react";
import type { RemediationPlanStep } from "@/types/remediation";

import RemediationStep from "./remediation-step";

interface PriorityActionsProps {
  steps: RemediationPlanStep[];
}

export default function PriorityActions({ steps }: PriorityActionsProps) {
  const completedCount = steps.filter((step) => step.status === "DONE").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-purple-100 pb-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-purple-600" />

          <h3 className="text-xl font-semibold text-slate-900">Priority Actions</h3>
        </div>

        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          {completedCount}/{steps.length} completed
        </span>
      </div>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <RemediationStep key={step.id ?? index} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}
