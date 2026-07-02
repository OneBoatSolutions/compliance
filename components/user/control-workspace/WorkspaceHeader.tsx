"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceHeader({
  control,
}: {
  control?: {
    framework?: string;
    id?: string;
    code?: string;
    title?: string;
    severity?: string;
    status?: string;
    assessmentId?: string;
  };
}) {
  const router = useRouter();

  // Prefetch the checklist page so back navigation is instant
  useEffect(() => {
    if (control?.assessmentId) {
      router.prefetch(`/assessments/${control.assessmentId}/checklist`);
    }
  }, [control?.assessmentId, router]);

  // Use browser back when the user came from the checklist page
  const handleBack = () => {
    const cameFromChecklist =
      typeof window !== "undefined" && sessionStorage.getItem("from-checklist") === "true";

    if (cameFromChecklist) {
      sessionStorage.removeItem("from-checklist");
      router.back();
    } else if (control?.assessmentId) {
      router.push(`/assessments/${control.assessmentId}/checklist`);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        {/* Back Link */}
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          ← Back to Assessment
        </button>

        {/* Breadcrumb */}
        <p className="text-sm font-medium text-purple-600 mb-2">
          Assessment / {control?.framework || "Framework"} /{" "}
          {control?.code || control?.id || "Control"}
        </p>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {control?.title || "Control Assessment Workspace"}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        {/* Status */}
        <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          {control?.status?.replaceAll("_", " ") || "NOT STARTED"}
        </span>

        {/* Severity */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium border ${
            control?.severity === "HIGH" || control?.severity === "CRITICAL"
              ? "border-red-200 bg-red-50 text-red-700"
              : control?.severity === "MEDIUM"
                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {control?.severity || "LOW"} Severity
        </span>

        {/* Framework */}
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          {control?.framework}
        </span>

        {/* Control Code */}
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          {control?.code}
        </span>
      </div>
    </div>
  );
}
