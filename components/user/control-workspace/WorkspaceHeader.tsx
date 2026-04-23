"use client";

import { CheckCircle } from "lucide-react";
export default function WorkspaceHeader() {
  return (
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* 🔹 LEFT: Breadcrumb + Title */}
      <div className="py-5" >
        {/* Breadcrumb */}
<p className="text-[10px] sm:text-xs text-muted-foreground">Assessment &gt; HealthTrack App &gt; HIPAA Administrative Safeguards
        </p>

        {/* Title */}
        <h1 className="text-xl font-semibold">
          Control Assessment Workspace
        </h1>
      </div>

      {/* 🔹 RIGHT: Status + Icons */}
      <div className="flex items-center gap-4">

        {/* ✅ Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <CheckCircle size={14} />
          Secure Controls
        </div>

        {/* 🔔 Notification */}

        {/* 👤 Avatar */}
        
      </div>
    </div>
  );
}
