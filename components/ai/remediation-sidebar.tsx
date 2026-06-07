import { Clock, ListChecks, ShieldCheck } from "lucide-react";

import type { RemediationData } from "@/services/types";

export default function RemediationSidebar({ data }: { data: RemediationData }) {
  const totalHours = data.steps.reduce((sum, step) => sum + step.estimatedHours, 0);
  const completedSteps = data.steps.filter((step) => step.status === "DONE").length;
  const completionRate =
    data.steps.length > 0 ? Math.round((completedSteps / data.steps.length) * 100) : 0;

  const inProgressSteps = data.steps.filter((step) => step.status === "IN_PROGRESS").length;

  const remainingSteps = data.steps.filter((step) => !step.status || step.status === "TODO").length;

  return (
    <div className="space-y-6 text-sm">
      <div className=" rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-white to-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks size={16} className="text-purple-600" />
          <p className="font-medium">Plan Progress</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedSteps} completed</span>
            <span>{data.steps.length} total</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 border border-purple-100">
            {" "}
            {completionRate}% complete
          </span>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="rounded-lg bg-green-50 p-2 text-center">
              <p className="text-lg font-semibold text-green-700">{completedSteps}</p>
              <p className="text-[11px] text-green-600">Done</p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-2 text-center">
              <p className="text-lg font-semibold text-yellow-700">{inProgressSteps}</p>
              <p className="text-[11px] text-yellow-600">Active</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-2 text-center">
              <p className="text-lg font-semibold text-slate-700">{remainingSteps}</p>
              <p className="text-[11px] text-slate-600">Left</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-blue-600" />
          <p className="font-medium">Estimated Effort</p>
        </div>

        <p className="text-4xl font-bold text-slate-900">{totalHours}h</p>
        <p className="text-xs text-muted-foreground mt-1">Based on AI-generated step estimates.</p>
      </div>

      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={16} />
          <p className="font-medium">Technical Controls</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.technicalControls.map((control) => (
            <span
              key={control}
              className="
        rounded-full
        border
        border-violet-100
        bg-white
        px-3
        py-1
        text-xs
        font-medium
        text-slate-600
      "
            >
              {control}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
