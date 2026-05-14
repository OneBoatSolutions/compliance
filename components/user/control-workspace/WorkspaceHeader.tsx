"use client";

import { CheckCircle } from "lucide-react";
export default function WorkspaceHeader({
  control,
}: {
  control?: { framework?: string; id?: string; title?: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      {/* 🔹 LEFT: Breadcrumb + Title */}
      <div className="py-5">
        {/* Breadcrumb */}
        <p className="text-sm font-medium text-purple-600 mb-1">
          Assessment / {control?.framework || "Framework"} / {control?.id || "Control"}
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {control?.title || "Control Assessment Workspace"}
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
