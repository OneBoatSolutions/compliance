"use client";
import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

interface Props {
  appName: string;
  data: {
    total: number;
    distribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };

    heatmap: {
      severity: string;
      status: string;
      count: number;
    }[];
    remediation: {
      id: string;
      action: string;
      owner: string;
      dueDate: string;
      progress: number;
    }[];
  };
}
export function RiskAnalysisSkeleton() {
  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-10">
      {/* Title */}
      <SkeletonBlock className="h-6 w-72" />

      {/* Top Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Donut Section */}
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center bg-gray-50/30">
          <SkeletonBlock className="h-5 w-40 mb-6" />

          <SkeletonBlock className="h-40 w-40 rounded-full" />

          <div className="mt-6 grid grid-cols-2 gap-3 w-full">
            {Array.from({ length: 4 }).map((unusedItem, i) => (
              <SkeletonBlock key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/30">
          <SkeletonBlock className="h-5 w-52 mx-auto mb-6" />

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((unusedItem, i) => (
              <SkeletonBlock key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>

          <SkeletonBlock className="mt-6 h-4 w-full" />
          <SkeletonBlock className="mt-3 h-4 w-[90%]" />
        </div>
      </div>

      {/* Table */}
      <div>
        <SkeletonBlock className="h-5 w-72 mb-5" />

        <div className="overflow-hidden rounded-lg border">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 border-b bg-gray-50 p-4">
            {Array.from({ length: 5 }).map((unusedItem, i) => (
              <SkeletonBlock key={i} className="h-4 w-20" />
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: 5 }).map((unusedItem, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 border-b p-4 items-center">
              <SkeletonBlock className="h-4 w-16" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-24" />

              <div>
                <SkeletonBlock className="h-2 w-full rounded-full" />
                <SkeletonBlock className="mt-2 h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RiskAnalysis({ appName, data }: Props) {
  const heatmap = data?.heatmap ?? [];
  const remediation = data?.remediation ?? [];

  const distribution = data?.distribution ?? {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const total = distribution.critical + distribution.high + distribution.medium + distribution.low;

  const safeTotal = total || 1;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = [
    { value: distribution.critical, color: "#ef4444" },
    { value: distribution.high, color: "#f97316" },
    { value: distribution.medium, color: "#eab308" },
    { value: distribution.low, color: "#22c55e" },
  ];
  const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const statuses = ["NOT_COMPLIANT", "PARTIALLY_COMPLIANT", "COMPLIANT"];

  return (
    <section
      className="
    bg-white
    rounded-xl
    shadow
    p-8
    space-y-6
    border-t-2
    border-primary
  "
    >
      {" "}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {appName}{" "}
        </p>

        <p className="mt-1 text-sm text-slate-500">Compliance Readiness Report • Section 05</p>
      </div>
      {/* 🔹 Title */}
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-wide uppercase">
          Risk Analysis & Visualization
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution, severity mapping, and remediation priorities
        </p>
      </div>
      {/* 🔹 Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🟣 Donut */}
        <div
          className="rounded-2xl p-8 flex flex-col items-center bg-gradient-to-br from-purple-50 via-white to-purple-100
                        border border-purple-100 shadow-[0_10px_40px_rgba(124,58,237,0.12)] "
        >
          <h3 className="text-md font-bold mb-4 text-gray-800">Risk Distribution</h3>

          {/* ✅ FIXED CONTAINER */}
          <div className="relative w-56 h-56 flex items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <svg className="w-50 h-50 -rotate-90">
              <circle cx="50%" cy="50%" r={radius} stroke="#eee" strokeWidth="10" fill="none" />

              {segments.map((seg, i) => {
                const dash = (seg.value / safeTotal) * circumference;
                const gap = circumference - dash;

                const el = (
                  <circle
                    key={i}
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={seg.color}
                    strokeWidth="15"
                    fill="none"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-offset}
                  />
                );

                offset += dash;
                return el;
              })}
            </svg>

            {/* ✅ CENTER TEXT (FIXED) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-400">Risks</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <span>🔴 Critical ({distribution.critical})</span>
            <span>🟠 High ({distribution.high})</span>
            <span>🟡 Medium ({distribution.medium})</span>
            <span>🟢 Low ({distribution.low})</span>
          </div>
        </div>

        {/* 🔹 Heatmap */}
        <div className="rounded-2xl bg-whiteborder border-slate-100 p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <h3 className="text-md font-bold mb-4 text-gray-800 text-center">
            Risk Severity Heatmap
          </h3>

          <p className="text-xs font-bold uppercase text-gray-500 text-center mb-2">
            Compliance Status →
          </p>

          <div className="flex items-center justify-start gap-3 overflow-x-auto">
            <p className="text-xs font-bold uppercase text-gray-500 -rotate-90 whitespace-nowrap">
              Severity
            </p>

            <div className="grid grid-cols-3 gap-3 min-w-[300px]">
              {severities.map((severity) =>
                statuses.map((status) => {
                  const cell = heatmap.find((h) => h.severity === severity && h.status === status);

                  const value = cell?.count ?? 0;

                  let color = "bg-gray-100";

                  if (severity === "CRITICAL") {
                    color =
                      status === "NOT_COMPLIANT"
                        ? "bg-red-500"
                        : status === "PARTIALLY_COMPLIANT"
                          ? "bg-red-400"
                          : "bg-red-300";
                  } else if (severity === "HIGH") {
                    color =
                      status === "NOT_COMPLIANT"
                        ? "bg-orange-500"
                        : status === "PARTIALLY_COMPLIANT"
                          ? "bg-orange-400"
                          : "bg-orange-300";
                  } else if (severity === "MEDIUM") {
                    color =
                      status === "NOT_COMPLIANT"
                        ? "bg-yellow-500"
                        : status === "PARTIALLY_COMPLIANT"
                          ? "bg-yellow-400"
                          : "bg-yellow-300";
                  } else {
                    color =
                      status === "NOT_COMPLIANT"
                        ? "bg-green-500"
                        : status === "PARTIALLY_COMPLIANT"
                          ? "bg-green-400"
                          : "bg-green-300";
                  }

                  return (
                    <div key={`${severity}-${status}`} className="relative group">
                      <div
                        className={`h-16 w-24 rounded flex flex-col items-center justify-center text-xs font-medium text-white ${color}`}
                      >
                        <span>{value}</span>

                        <span className="text-[10px]">{severity}</span>
                      </div>

                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                        {status} • {value} controls
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-gray-600 font-semibold uppercase mt-2 px-6">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>

          <p className="text-xs text-gray-600 mt-4 font-semibold text-center max-w-sm mx-auto">
            This heatmap represents the distribution of risks based on their impact and likelihood.
            Higher concentrations in red zones indicate critical areas requiring immediate
            attention.
          </p>
        </div>
      </div>
      {/* 🔹 Remediation Table */}
      <div>
        <h3 className="text-md font-bold mb-4 text-gray-900">Top Priority Remediation Actions</h3>

        {remediation.length === 0 ? (
          <p className="text-gray-400 text-sm">No remediation actions available</p>
        ) : (
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-purple-50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <th className="p-3 text-left">CONTROL ID</th>
                <th className="p-3 text-left">ACTION</th>
                <th className="p-3 text-left">OWNER</th>
                <th className="p-3 text-left">DUE DATE</th>
                <th className="p-3 text-left">PROGRESS</th>
              </tr>
            </thead>

            <tbody>
              {remediation.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.action}</td>
                  <td className="p-3">{r.owner}</td>
                  <td className="p-3">{r.dueDate}</td>

                  <td className="p-3 w-40">
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-purple-600 h-2 rounded"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{r.progress}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
