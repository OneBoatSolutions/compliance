import { CheckCircle2, Circle, Clock3, ListChecks } from "lucide-react";

import type { RemediationStepData, RemediationStepStatus } from "@/services/types";

interface PriorityActionsProps {
  steps: RemediationStepData[];
  onStepStatusChange: (index: number, status: RemediationStepStatus) => void;
  updatingStepIndex: number | null;
}

function getNextStatus(status?: RemediationStepStatus): RemediationStepStatus {
  return status === "DONE" ? "TODO" : "DONE";
}

export default function PriorityActions({
  steps,
  onStepStatusChange,
  updatingStepIndex,
}: PriorityActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ListChecks size={16} className="text-purple-600" />
        <h3 className="font-semibold">Priority Actions</h3>
      </div>

      {steps.map((step, index) => {
        const isDone = step.status === "DONE";
        const isUpdating = updatingStepIndex === index;

        return (
          <div
            key={step.id ?? `${step.title}-${index}`}
            className="border rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStepStatusChange(index, getNextStatus(step.status))}
                className="mt-0.5 text-purple-600 disabled:opacity-50"
                aria-label={isDone ? "Mark step incomplete" : "Mark step complete"}
              >
                {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}
                  >
                    {step.title}
                  </p>

                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    {step.priority}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>

                <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-4">
                  <span>Owner: {step.owner}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={13} />
                    {step.estimatedHours}h
                  </span>
                  <span>Status: {(step.status ?? "TODO").replaceAll("_", " ")}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
