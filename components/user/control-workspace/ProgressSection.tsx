"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressProps {
  total: number;
  compliant: number;
  partiallyCompliant: number;
  nonCompliant: number;
  notStarted: number;
}

export default function ProgressSection({
  total = 0,
  compliant = 0,
  partiallyCompliant = 0,
  nonCompliant = 0,
  notStarted = 0,
}: ProgressProps) {
  const completed = compliant + partiallyCompliant;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white shadow-md border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      {/* LEFT */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Section Progress</p>
          <span className="font-medium text-sm text-slate-500">
            {completed}/{total} controls completed
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Progress value={percent} className="h-2.5 bg-slate-100 [&>div]:bg-purple-600" />

          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold px-2 py-0.5"
          >
            {percent}%
          </Badge>
        </div>
      </div>

      {/* RIGHT LEGEND */}
      <div className="flex flex-row items-center gap-4 text-xs text-muted-foreground">
        <Legend color="bg-green-500" label={compliant.toString()} title="Compliant" />
        <Legend
          color="bg-yellow-500"
          label={partiallyCompliant.toString()}
          title="Partially Compliant"
        />
        <Legend color="bg-red-500" label={nonCompliant.toString()} title="Non-Compliant" />
        <Legend color="bg-gray-400" label={notStarted.toString()} title="Not Started" />
      </div>
    </div>
  );
}

function Legend({ color, label, title }: { color: string; label: string; title: string }) {
  return (
    <div className="flex items-center gap-1" title={title}>
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
