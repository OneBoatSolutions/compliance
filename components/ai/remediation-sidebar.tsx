import { Clock, ListChecks, ShieldCheck } from "lucide-react";

import type { RemediationData } from "@/services/types";

export default function RemediationSidebar({ data }: { data: RemediationData }) {
  const totalHours = data.steps.reduce((sum, step) => sum + step.estimatedHours, 0);
  const completedSteps = data.steps.filter((step) => step.status === "DONE").length;
  const completionRate =
    data.steps.length > 0 ? Math.round((completedSteps / data.steps.length) * 100) : 0;

  return (
    <div className="space-y-6 text-sm">
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks size={16} />
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
          <p className="text-xs text-muted-foreground">{completionRate}% complete</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} />
          <p className="font-medium">Estimated Effort</p>
        </div>

        <p className="text-2xl font-semibold">{totalHours}h</p>
        <p className="text-xs text-muted-foreground mt-1">Based on AI-generated step estimates.</p>
      </div>

      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={16} />
          <p className="font-medium">Technical Controls</p>
        </div>

        <ul className="space-y-2 text-xs text-muted-foreground">
          {data.technicalControls.map((control) => (
            <li key={control}>{control}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
