"use client";

import ReportSectionHeader from "@/components/report/report-section-header";
import { CheckCircle2, Clock3, AlertTriangle, CircleDashed } from "lucide-react";

interface Props {
  appName: string;

  frameworks: {
    name: string;
    score: number;
  }[];
}

export default function FrameworkComparison({ appName, frameworks }: Props) {
  const ranked = [...frameworks].sort((a, b) => b.score - a.score);

  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-8 border-t-2 border-primary">
      <ReportSectionHeader appName={appName} sectionNumber="04" />

      <div className="border-l-4 border-purple-600 pl-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-wide uppercase">
          FRAMEWORK COMPARISON
        </h2>

        <p className="mt-2 text-slate-500 text-sm">
          Comparative compliance readiness across selected frameworks.
        </p>
      </div>

      {/* Framework Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {frameworks.map((framework) => (
          <div
            key={framework.name}
            className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-white p-6 shadow-[0_10px_30px_rgba(124,58,237,0.08)]"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">Framework</p>

            <h3 className="mt-2 text-md font-semibold text-slate-900">{framework.name}</h3>

            {/* Score */}
            <p className="mt-4 text-2xl font-bold bg-gradient-to-r from-purple-700 to-violet-500 bg-clip-text text-transparent">
              {framework.score}%
            </p>

            {/* Readiness Status */}
            <div className="mt-3">
              {framework.score >= 70 ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Compliant
                </span>
              ) : framework.score >= 40 ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm">
                  <Clock3 className="h-4 w-4" />
                  In Progress
                </span>
              ) : framework.score > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Needs Attention
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                  <CircleDashed className="h-4 w-4" />
                  Assessment Pending
                </span>
              )}
            </div>

            {/* Status Description */}
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {framework.score >= 70
                ? "Strong compliance posture with minor gaps remaining."
                : framework.score >= 40
                  ? "Moderate readiness with improvement opportunities."
                  : framework.score > 0
                    ? "Significant remediation activities are recommended."
                    : "Assessment data is not yet available for this framework."}
            </p>

            {/* Progress Bar */}
            <div className="mt-5 h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-700"
                style={{ width: `${framework.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ranking */}
      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6">
        <h3 className="text-md font-bold text-slate-900 mb-6">Framework Ranking</h3>

        <div className="space-y-5">
          {ranked.map((framework, index) => (
            <div key={framework.name}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>

                  <span className="font-xs text-base text-slate-800">{framework.name}</span>
                </div>

                <span className="font-sm text-base text-purple-700">{framework.score}%</span>
              </div>

              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full"
                  style={{ width: `${framework.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
