import {
  type Control,
  type FrameworkScore,
  type Status,
} from "@/app/(user)/assessments/[id]/checklist/types";
import { TriangleAlert } from "lucide-react";

interface StatusDistribution {
  total: number;
  compliant: number;
  partial: number;
  gap: number;
  notStarted: number;
}

interface Props {
  controls: Control[];
  overallScore?: number | null;
  frameworkScores?: FrameworkScore[];
  statusDistribution?: StatusDistribution;
  isUpdating?: boolean;
  onFilterFramework?: (fw: string) => void;
  onFilterStatus?: (status: Status) => void;
  className?: string;
}

export default function MetricsBar({
  controls,
  overallScore,
  frameworkScores,
  statusDistribution,
  isUpdating = false,
  onFilterFramework,
  onFilterStatus,
  className,
}: Props) {
  const fallbackTotal = controls.length;
  const fallbackCompliant = controls.filter((c) => c.status === "COMPLIANT").length;
  const fallbackPartial = controls.filter((c) => c.status === "PARTIALLY_COMPLIANT").length;
  const fallbackGap = controls.filter((c) => c.status === "NOT_COMPLIANT").length;
  const fallbackNotStarted = controls.filter((c) => c.status === "NOT_STARTED").length;

  const total = statusDistribution?.total ?? fallbackTotal;
  const compliant = statusDistribution?.compliant ?? fallbackCompliant;
  const partial = statusDistribution?.partial ?? fallbackPartial;
  const gap = statusDistribution?.gap ?? fallbackGap;
  const notStarted = statusDistribution?.notStarted ?? fallbackNotStarted;

  const percent =
    typeof overallScore === "number"
      ? Math.max(0, Math.min(100, Math.round(overallScore)))
      : total
        ? Math.round((compliant / total) * 100)
        : 0;

  const frameworkStats =
    frameworkScores && frameworkScores.length > 0
      ? frameworkScores.map((frameworkScore) => ({
          id: frameworkScore.frameworkId,
          fw: frameworkScore.frameworkCode,
          pct: Math.round(frameworkScore.score),
          total: controls.filter((control) => control.frameworkId === frameworkScore.frameworkId)
            .length,
        }))
      : [...new Set(controls.map((control) => control.frameworkId))].map((frameworkId) => {
          const items = controls.filter((control) => control.frameworkId === frameworkId);
          const done = items.filter((control) => control.status === "COMPLIANT").length;
          const pct = items.length ? Math.round((done / items.length) * 100) : 0;

          return {
            id: frameworkId,
            fw: items[0]?.frameworkName ?? items[0]?.framework ?? frameworkId,
            pct,
            total: items.length,
          };
        });

  const safeBarPercent = (count: number): number => {
    if (total === 0) {
      return 0;
    }

    return (count / total) * 100;
  };

  return (
    <div
      className={`sticky top-15 z-40 bg-white border rounded-xl shadow-sm grid grid-cols-4 divide-x divide-slate-100 items-stretch transition-all duration-300 ${
        isUpdating ? "ring-1 ring-purple-200" : ""
      } ${className || ""}`}
    >
      {/*  1. Overall Progress */}
      <div className="flex items-center py-3 px-6 gap-4">
        <div className="relative w-18 h-18 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r="30"
              strokeWidth="6"
              className="text-gray-200"
              stroke="currentColor"
              fill="none"
            />
            <circle
              cx="36"
              cy="36"
              r="30"
              strokeWidth="6"
              strokeDasharray="188"
              strokeDashoffset={188 - (percent / 100) * 188}
              className="text-purple-600"
              stroke="currentColor"
              fill="none"
              style={{
                transition: "stroke-dashoffset 360ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </svg>

          <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-gray-900">
            {percent}%
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[11px] tracking-wider uppercase font-semibold text-gray-500">
            Overall Compliance
          </p>
          <p className="font-extrabold text-gray-900 text-base mt-0.5">
            {compliant}/{total} items
          </p>
          {isUpdating && (
            <p className="text-[10px] text-purple-600 animate-pulse mt-0.5">Updating...</p>
          )}
        </div>
      </div>

      {/*  2. Framework Breakdown */}
      <div className="py-3 px-6 flex flex-col justify-center">
        <p className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 mb-2">
          Framework Breakdown
        </p>

        <div className="space-y-2">
          {frameworkStats.map((f) => (
            <div
              key={f.id}
              onClick={() => onFilterFramework?.(f.id)}
              className="cursor-pointer hover:opacity-80 group"
            >
              <div className="flex justify-between text-xs font-medium text-gray-700">
                <span className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                  {f.fw}
                </span>
                <span className="text-gray-500">{f.pct}%</span>
              </div>

              <div className="h-1.5 bg-gray-200 rounded mt-1 overflow-hidden">
                <div
                  className="h-1.5 bg-purple-600 rounded"
                  style={{
                    width: `${f.pct}%`,
                    transition: "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  3. Status Distribution */}
      <div className="py-3 px-6 flex flex-col justify-center">
        <p className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 mb-2">
          Status Distribution
        </p>

        <div className="h-2 flex rounded overflow-hidden">
          <div
            title={`Compliant: ${compliant}`}
            onClick={() => onFilterStatus?.("COMPLIANT")}
            className="bg-green-500 cursor-pointer"
            style={{
              width: `${safeBarPercent(compliant)}%`,
              transition: "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <div
            title={`Partial: ${partial}`}
            onClick={() => onFilterStatus?.("PARTIALLY_COMPLIANT")}
            className="bg-yellow-400 cursor-pointer"
            style={{
              width: `${safeBarPercent(partial)}%`,
              transition: "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <div
            title={`Non-compliant: ${gap}`}
            onClick={() => onFilterStatus?.("NOT_COMPLIANT")}
            className="bg-red-500 cursor-pointer"
            style={{
              width: `${safeBarPercent(gap)}%`,
              transition: "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <div
            title={`Not started: ${notStarted}`}
            className="bg-gray-300"
            style={{
              width: `${safeBarPercent(notStarted)}%`,
              transition: "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[11px] text-gray-500 mt-1.5 font-medium">
          <span
            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
            onClick={() => onFilterStatus?.("COMPLIANT")}
          >
            🟢 {compliant}
          </span>
          <span
            className="flex items-center gap-1 cursor-pointer hover:text-yellow-600 transition-colors"
            onClick={() => onFilterStatus?.("PARTIALLY_COMPLIANT")}
          >
            🟡 {partial}
          </span>
          <span
            className="flex items-center gap-1 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => onFilterStatus?.("NOT_COMPLIANT")}
          >
            🔴 {gap}
          </span>
          <span className="flex items-center gap-1">⚪ {notStarted}</span>
        </div>
      </div>

      {/* 🔹 4. Critical Issues */}
      <div
        onClick={() => onFilterStatus?.("NOT_COMPLIANT")}
        className="py-3 px-6 flex flex-col justify-center cursor-pointer hover:opacity-80 group"
      >
        <p className="text-[10px] tracking-wider uppercase font-semibold text-gray-500">
          Critical Issues
        </p>

        <div className="flex items-center justify-between mt-1">
          {/* LEFT: number + text */}
          <div className="flex items-baseline gap-2">
            <span className="text-red-500 text-3xl font-extrabold tracking-tight">{gap}</span>
            <span className="text-red-500 text-xs font-bold uppercase tracking-wider">
              Attention Required
            </span>
          </div>

          {/* RIGHT: icon */}
          <span className="bg-red-50 rounded-lg p-2 text-red-500 transition-colors group-hover:bg-red-100">
            <TriangleAlert className="w-5 h-5" />
          </span>
        </div>
      </div>
    </div>
  );
}
