import { RemediationData } from "@/services/types";
import { ShieldAlert, CheckCircle2, TrendingUp, Layers3 } from "lucide-react";
export default function RemediationTop({ data }: { data: RemediationData }) {
  const completedSteps = data.steps.filter((step) => step.status === "DONE").length;
  const scoreImpact = Math.max(1, Math.round(data.steps.length * 1.5));

  return (
    <div
      className="
      rounded-2xl
      border
      border-purple-200
      bg-gradient-to-r
      from-purple-50
      via-violet-50
      to-white
      p-6
      shadow-sm
    "
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600">
              {data.controlId}
            </span>

            <span className="rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {data.frameworkName}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                data.severity === "HIGH"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : data.severity === "MEDIUM"
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              {data.severity} SEVERITY
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{data.controlTitle}</h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            {data.controlDescription}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
            {data.currentStatus.replaceAll("_", " ")}
          </span>

          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">Remediation Overview</p>

            <p className="text-xs text-slate-500">AI-generated compliance guidance</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-purple-100 bg-white/80 p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium uppercase tracking-wide">Progress</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {completedSteps}/{data.steps.length}
          </p>

          <p className="text-xs text-slate-500">Steps completed</p>
        </div>

        <div className="rounded-xl border border-purple-100 bg-white/80 p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <TrendingUp size={16} />
            <span className="text-xs font-medium uppercase tracking-wide">Impact</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">+{scoreImpact}%</p>

          <p className="text-xs text-slate-500">Estimated score improvement</p>
        </div>

        <div className="rounded-xl border border-purple-100 bg-white/80 p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <Layers3 size={16} />
            <span className="text-xs font-medium uppercase tracking-wide">Actions</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">{data.steps.length}</p>

          <p className="text-xs text-slate-500">Recommended actions</p>
        </div>
      </div>
    </div>
  );
}
