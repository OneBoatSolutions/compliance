import { Card } from "@/components/ui/card";
import { Clock3, User, ClipboardList } from "lucide-react";

import type { RemediationPlanStep } from "@/types/remediation";

import PriorityBadge from "./priority-badge";

interface RemediationStepProps {
  step: RemediationPlanStep;
  index: number;
}

export default function RemediationStep({ step, index }: RemediationStepProps) {
  return (
    <Card
      className="
    relative
    overflow-hidden
    p-6
    border
    border-purple-100
    bg-gradient-to-br
    from-purple-50/60
    via-white
    to-white
    shadow-sm
    hover:shadow-md
    hover:border-purple-200
    transition-all
    duration-200
  "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-purple-600
              to-violet-500
              text-sm
              font-semibold
              text-white
              shadow-sm
            "
          >
            {index + 1}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
            <div className="mt-5 border-t border-purple-100 pt-4">
              <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-purple-500" />
                  {step.owner}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-purple-500" />
                  {step.estimatedHours} hrs
                </span>

                {step.status && (
                  <span className="flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-purple-500" />
                    {step.status.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <PriorityBadge level={step.priority} />
      </div>

      <div className="mt-5 rounded-xl border border-purple-100 bg-white/80 p-4">
        <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
      </div>
    </Card>
  );
}
