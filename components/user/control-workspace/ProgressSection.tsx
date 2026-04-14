"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ProgressSection() {
  const completed = 15;
  const total = 20;
  const percent = Math.round((completed / total) * 100);

  return (
<div className="bg-card border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">      
      {/* LEFT */}
      <div className="w-full">
        <p className="text-sm mb-3 text-muted-foreground">
          Section Progress:{" "}
          <span className="font-medium text-foreground">
            {completed}/{total} controls completed
          </span>
        </p>

        <div className="flex items-center gap-2">
          <Progress value={percent} className="h-2" />

          <Badge variant="secondary" className="text-primary font-large">
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

function Legend({ color, label }: any) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
