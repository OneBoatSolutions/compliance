import { CheckCircle2, Circle, Clock3, ListChecks, User } from "lucide-react";

import type { RemediationStepData, RemediationStepStatus } from "@/services/types";

interface PriorityActionsProps {
  steps: RemediationStepData[];
  onStepStatusChange: (index: number, status: RemediationStepStatus) => void;
  updatingStepIndex: number | null;
}

function getNextStatus(status?: RemediationStepStatus): RemediationStepStatus {
  switch (status) {
    case "TODO":
      return "IN_PROGRESS";

    case "IN_PROGRESS":
      return "DONE";

    case "DONE":
    default:
      return "TODO";
  }
}

export default function PriorityActions({
  steps,
  onStepStatusChange,
  updatingStepIndex,
}: PriorityActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ListChecks size={20} className="text-purple-600 font-bold" />
        <h3 className="font-semibold text-lg">Priority Actions</h3>
      </div>

      {steps.map((step, index) => {
        const isUpdating = updatingStepIndex === index;

        return (
          <div
            key={step.id ?? `${step.title}-${index}`}
            className="relative overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-white
                       p-5 space-y-3 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200"
          >
            <div className="absolute left-2 top-3 bottom-3 w-1 bg-gradient-to-b from-purple-600 to-violet-400 rounded-full" />{" "}
            <div className="flex items-start gap-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onStepStatusChange(index, getNextStatus(step.status))}
                className="mt-0.5 text-purple-600 disabled:opacity-50"
                aria-label={`Next status: ${
                  getNextStatus(step.status) === "IN_PROGRESS"
                    ? "In Progress"
                    : getNextStatus(step.status) === "DONE"
                      ? "Completed"
                      : "Todo"
                }`}
                title={`Next status: ${
                  getNextStatus(step.status) === "IN_PROGRESS"
                    ? "In Progress"
                    : getNextStatus(step.status) === "DONE"
                      ? "Completed"
                      : "Todo"
                }`}
              >
                {/* icon */}
                {step.status === "DONE" ? (
                  <CheckCircle2 size={20} />
                ) : step.status === "IN_PROGRESS" ? (
                  <Clock3 size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`font-medium ${
                      step.status === "DONE"
                        ? "line-through text-muted-foreground"
                        : step.status === "IN_PROGRESS"
                          ? "text-yellow-700"
                          : ""
                    }`}
                  >
                    {step.title}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium border ${
                      step.priority === "HIGH"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : step.priority === "MEDIUM"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-blue-50 text-blue-700 border-blue-20"
                    } `}
                  >
                    {step.priority}
                  </span>

                  {step.status === "DONE" && step.completedAt && (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      ✓ Completed {new Date(step.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>

                <div className="mt-4 border-t border-purple-100 pt-3 text-xs text-muted-foreground flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-1">
                    <User size={15} className="text-purple-500 text-bold" />
                    {step.owner}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={13} className="text-purple-500" />
                    {step.estimatedHours}h
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-all duration-300 ${
                      step.status === "DONE"
                        ? "bg-green-50 text-green-700"
                        : step.status === "IN_PROGRESS"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-slate-50 text-slate-600"
                    }
                         `}
                  >
                    {step.status === "DONE"
                      ? "Completed"
                      : step.status === "IN_PROGRESS"
                        ? "In Progress"
                        : "Todo"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
