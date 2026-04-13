import { Control } from "@/app/(user)/assessments/[id]/checklist/types";
import { TriangleAlert } from "lucide-react";

interface Props {
  controls: Control[];
  onFilterFramework?: (fw: string) => void;
  onFilterStatus?: (status: string) => void;
}

export default function MetricsBar({ controls, onFilterFramework, onFilterStatus }: Props) {
  const total = controls.length;

  // STATUS COUNTS
  const compliant = controls.filter((c) => c.status === "COMPLIANT").length;
  const partial = controls.filter((c) => c.status === "PARTIAL").length;
  const gap = controls.filter((c) => c.status === "NON_COMPLIANT").length;
  const notStarted = controls.filter((c) => !c.status || c.status === "NOT_STARTED").length;

  const percent = total ? Math.round((compliant / total) * 100) : 0;

  // FRAMEWORK BREAKDOWN (dynamic)
  const frameworks = ["HIPAA", "GDPR", "PCI-DSS"];

  const frameworkStats = frameworks.map((fw) => {
    const items = controls.filter((c) => c.framework === fw);
    const done = items.filter((c) => c.status === "COMPLIANT").length;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;

    return { fw, pct, total: items.length };
  });

  return (
    <div className=" top-[80px] z-40 bg-white border rounded-xl shadow-sm grid grid-cols-4 divide-x divide-slate-100 items-stretch">
      {/*  1. Overall Progress */}
      <div className="flex items-center p-6">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              strokeWidth="6"
              className="text-gray-200"
              stroke="currentColor"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              strokeWidth="6"
              strokeDasharray="213"
              strokeDashoffset={213 - (percent / 100) * 213}
              className="text-purple-600"
              stroke="currentColor"
              fill="none"
            />
          </svg>

          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {percent}%
          </span>
        </div>

        <div>
          <p className="text-xs uppercase font-semibold text-gray-500">Overall Compliance</p>
          <p className="font-semibold text-gray-900">
            {compliant}/{total} items
          </p>
        </div>
      </div>

      {/*  2. Framework Breakdown */}
      <div className="p-6">
        <p className="text-xs uppercase font-semibold text-gray-500 mb-3">Framework Breakdown</p>

        <div className="space-y-3">
          {frameworkStats.map((f) => (
            <div
              key={f.fw}
              onClick={() => onFilterFramework?.(f.fw)}
              className="cursor-pointer hover:opacity-80"
            >
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">{f.fw}</span>
                <span className="text-gray-600">{f.pct}%</span>
              </div>

              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-2 bg-purple-600 rounded" style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  3. Status Distribution */}
      <div className="p-6 flex flex-col justify-center">
        <p className="text-xs uppercase font-semibold text-gray-500 mb-3">Status Distribution</p>

        <div className="h-3 flex rounded overflow-hidden">
          <div
            title={`Compliant: ${compliant}`}
            onClick={() => onFilterStatus?.("COMPLIANT")}
            className="bg-green-500 cursor-pointer"
            style={{ width: `${(compliant / total) * 100}%` }}
          />

          <div
            title={`Partial: ${partial}`}
            onClick={() => onFilterStatus?.("PARTIAL")}
            className="bg-yellow-400 cursor-pointer"
            style={{ width: `${(partial / total) * 100}%` }}
          />

          <div
            title={`Non-compliant: ${gap}`}
            onClick={() => onFilterStatus?.("NON_COMPLIANT")}
            className="bg-red-500 cursor-pointer"
            style={{ width: `${(gap / total) * 100}%` }}
          />

          <div
            title={`Not started: ${notStarted}`}
            className="bg-gray-300"
            style={{ width: `${(notStarted / total) * 100}%` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">🟢 {compliant}</span>
          <span className="flex items-center gap-1">🟡 {partial}</span>
          <span className="flex items-center gap-1">🔴 {gap}</span>
          <span className="flex items-center gap-1">⚪ {notStarted}</span>
        </div>
      </div>

      {/* 🔹 4. Critical Issues */}
      <div
        onClick={() => onFilterStatus?.("NON_COMPLIANT")}
        className="p-6 flex flex-col justify-center cursor-pointer hover:opacity-80"
      >
        <p className="text-xs uppercase font-semibold text-gray-500">Critical Issues</p>

        <div className="flex items-center justify-between mt-2">
          {/* LEFT: number + text */}
          <div className="flex items-baseline gap-2">
            <span className="text-red-500 text-3xl font-bold tracking-tight">{gap}</span>
            <span className="text-red-500 text-sm font-medium">Attention Required</span>
          </div>

          {/* RIGHT: icon */}
          <span className="bg-red-50 rounded-sm p-2 text-red-500 text-xl">
            <TriangleAlert />
          </span>
        </div>
      </div>
    </div>
  );
}
