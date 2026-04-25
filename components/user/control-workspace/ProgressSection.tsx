"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ProgressSection() {
  const completed = 15;
  const total = 20;
  const percent = Math.round((completed / total) * 100);

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
        <Legend color="bg-green-500" label="12" />
        <Legend color="bg-yellow-500" label="3" />
        <Legend color="bg-red-500" label="5" />
        <Legend color="bg-gray-400" label="0" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
