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
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* LEFT */}
        <div>
          <p className="text-sm text-slate-500 pt-4">Assessment Progress</p>

          <p className="text-sm font-semibold text-slate-900">
            {completed}/{total} controls completed
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex items-center gap-4">
        <Progress
          aria-label="Control section progress"
          value={percent}
          className="h-3 rounded-full bg-slate-200 [&>div]:bg-purple-600"
        />

        <Badge
          className="
            bg-purple-100
            text-purple-700
            font-semibold
            rounded-full
            px-3
          "
        >
          {percent}%
        </Badge>
      </div>
    </div>
  );
}

function Legend({ color, label, title }: { color: string; label: string; title: string }) {
  return (
    <div
      className="
        flex items-center gap-1.5
        rounded-full
        border
        border-white
        bg-white/80
        px-2.5
        py-1
      "
      title={title}
    >
      <span className={`h-2 w-2 rounded-full ${color}`} />

      <span className="text-xs font-medium text-slate-700">{label}</span>
    </div>
  );
}
