import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Upload,
} from "lucide-react";
import Link from "next/link";

import { ComplianceHealthDonut } from "@/components/ui/compliance-health-donut";
import { CircularProgress } from "@/components/ui/circular-progress";
import type {
  DashboardApiData,
  DashboardActivityItem,
  DashboardAssessmentSummary,
} from "@/types/dashboard";

type TrendDirection = "up" | "down" | "neutral";

interface MetricCardData {
  title: string;
  value: string;
  trend: string;
  direction: TrendDirection;
  icon: LucideIcon;
}

function TrendIndicator({ direction, text }: { direction: TrendDirection; text: string }) {
  if (direction === "up") {
    return (
      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
        <ArrowUpRight className="size-3.5" />
        {text}
      </p>
    );
  }

  if (direction === "down") {
    return (
      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
        <ArrowDownRight className="size-3.5" />
        {text}
      </p>
    );
  }

  return (
    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
      <Clock3 className="size-3.5" />
      {text}
    </p>
  );
}

function getActivityIcon(type: DashboardActivityItem["type"]): LucideIcon {
  switch (type) {
    case "report_generated":
      return FileText;
    case "assessment_created":
      return ShieldCheck;
    case "assessment_updated":
      return FileCheck2;
    case "evidence_uploaded":
      return Upload;
    default:
      return FileText;
  }
}

function getActivityTone(
  type: DashboardActivityItem["type"],
): "purple" | "indigo" | "emerald" | "amber" {
  switch (type) {
    case "report_generated":
      return "indigo";
    case "assessment_created":
      return "purple";
    case "assessment_updated":
      return "emerald";
    case "evidence_uploaded":
      return "amber";
    default:
      return "purple";
  }
}

const timelineToneClasses = {
  purple: "bg-[#6d18ff] text-white",
  indigo: "bg-indigo-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
};

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMs) < hour) {
    return formatter.format(Math.round(diffMs / minute), "minute");
  }
  if (Math.abs(diffMs) < day) {
    return formatter.format(Math.round(diffMs / hour), "hour");
  }
  return formatter.format(Math.round(diffMs / day), "day");
}

function assessmentStatusLabel(status: string): string {
  if (status === "COMPLETED") {
    return "Completed";
  }
  if (status === "DRAFT") {
    return "Draft";
  }
  return "In Progress";
}

interface Props {
  data: DashboardApiData;
}

export default function ActiveDashboard({ data }: Props) {
  const metricCards: MetricCardData[] = [
    {
      title: "Total Assessments",
      value: String(data.totalAssessments),
      trend: `${data.totalAssessments} total`,
      direction: data.totalAssessments > 0 ? "up" : "neutral",
      icon: FolderKanban,
    },
    {
      title: "Avg Score",
      value: data.averageScore > 0 ? `${data.averageScore}%` : "N/A",
      trend: data.averageScore > 0 ? "Across all assessments" : "No data yet",
      direction: data.averageScore >= 80 ? "up" : data.averageScore >= 50 ? "neutral" : "down",
      icon: TrendingUp,
    },
    {
      title: "Critical Gaps",
      value: String(data.criticalGaps),
      trend: data.criticalGaps === 0 ? "All clear" : `${data.criticalGaps} unresolved`,
      direction: data.criticalGaps === 0 ? "up" : "down",
      icon: AlertTriangle,
    },
    {
      title: "Reports",
      value: String(data.reportsGenerated),
      trend: data.reportsGenerated > 0 ? `${data.reportsGenerated} generated` : "None yet",
      direction: "neutral",
      icon: FileText,
    },
  ];

  const overallHealthScore = data.averageScore > 0 ? Math.round(data.averageScore) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-24">
        <section className="mb-8 rounded-2xl border border-[#6d18ff]/15 bg-gradient-to-br from-[#f1eaff] via-white to-[#efe3ff] p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Monitor compliance momentum in real time, track critical gaps, and keep your team
            audit-ready with a single purple-powered command center.
          </p>
        </section>

        {/* Metric cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.title}
                className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      {metric.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
                    <TrendIndicator direction={metric.direction} text={metric.trend} />
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6d18ff]/10 text-[#6d18ff]">
                    <Icon className="size-5" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          <div className="space-y-6 lg:col-span-7">
            {/* Active Assessments */}
            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Active Assessments</h2>
                  <p className="text-sm text-slate-500">
                    Current compliance workstreams with progress and ownership.
                  </p>
                </div>
                <span className="rounded-full bg-[#6d18ff]/10 px-3 py-1 text-xs font-semibold text-[#6d18ff]">
                  {data.assessments.length} assessment{data.assessments.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {data.assessments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">No assessments found.</p>
                ) : (
                  data.assessments.map((assessment: DashboardAssessmentSummary) => (
                    <Link
                      key={assessment.id}
                      href={`/assessments/${assessment.id}/checklist`}
                      className="block rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:border-[#6d18ff]/20 hover:shadow-sm transition-all md:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {assessment.organizationName ?? "Assessment"}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                assessment.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : assessment.status === "DRAFT"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {assessmentStatusLabel(assessment.status)}
                            </span>
                            {assessment.frameworkScores.map((fs) => (
                              <span
                                key={fs.frameworkCode}
                                className="rounded-full bg-[#6d18ff]/10 px-2.5 py-1 text-[11px] font-semibold text-[#6d18ff]"
                              >
                                {fs.frameworkCode}: {Math.round(fs.score)}%
                              </span>
                            ))}
                          </div>
                          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Clock3 className="size-3.5" />
                            Last Updated: {formatRelativeTime(assessment.updatedAt)}
                          </p>
                        </div>

                        {assessment.score !== null && (
                          <CircularProgress
                            value={Math.round(assessment.score)}
                            label="Score"
                            size={84}
                            strokeWidth={8}
                            className="w-[84px] shrink-0"
                            labelClassName="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                          />
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </article>

            {/* Recent Activity */}
            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest compliance events from your team.
              </p>

              {data.recentActivity.length === 0 ? (
                <p className="mt-6 py-8 text-center text-sm text-slate-400">No recent activity.</p>
              ) : (
                <div className="relative mt-6 space-y-5">
                  <div className="absolute bottom-2 left-[19px] top-2 w-0.5 bg-gradient-to-b from-[#6d18ff] to-[#6d18ff]/20" />
                  {data.recentActivity.map((event: DashboardActivityItem) => {
                    const Icon = getActivityIcon(event.type);
                    const tone = getActivityTone(event.type);

                    return (
                      <div key={event.id} className="relative flex gap-4">
                        <div
                          className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow ${timelineToneClasses[tone]}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                          <p className="text-xs text-slate-500">{event.detail}</p>
                          <p className="mt-1 text-[11px] font-medium text-slate-400">
                            {formatRelativeTime(event.occurredAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          </div>

          <aside className="space-y-4 lg:col-span-3">
            {/* Quick Actions */}
            <article className="rounded-xl bg-gradient-to-br from-[#7b2cff] via-[#6d18ff] to-[#4d0fad] p-5 text-white shadow-lg shadow-[#6d18ff]/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Quick Actions
              </p>
              <h3 className="mt-1 text-lg font-bold">Start New Assessment</h3>
              <p className="mt-2 text-sm text-white/90">
                Create a new assessment or jump into an existing checklist.
              </p>
              <div className="mt-4 space-y-2">
                <Link
                  href="/onboarding"
                  className="flex w-full items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#5b14d8] transition hover:bg-white/90"
                >
                  Create New Assessment
                </Link>
                {data.assessments.length > 0 && (
                  <Link
                    href={`/assessments/${data.assessments[0].id}/checklist`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/45 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    <PlayCircle className="size-4" />
                    Continue Latest
                  </Link>
                )}
                <Link
                  href="/analytics"
                  className="flex w-full items-center justify-center rounded-lg border border-white/45 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  View Analytics Dashboard
                </Link>
              </div>
            </article>

            {/* Compliance Health */}
            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Compliance Health
              </h3>
              <div className="mt-4 flex justify-center">
                <ComplianceHealthDonut
                  value={overallHealthScore}
                  label="Compliance Health"
                  subtitle="Based on active assessments"
                  size={160}
                  className="max-w-none"
                />
              </div>
            </article>

            {/* Critical Gaps Summary */}
            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Critical Gaps
              </h3>
              <div className="mt-4 flex items-center gap-3">
                {data.criticalGaps > 0 ? (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                      <ShieldAlert className="size-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{data.criticalGaps}</p>
                      <p className="text-xs text-slate-500">unresolved critical controls</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">All clear</p>
                      <p className="text-xs text-slate-500">No critical gaps detected</p>
                    </div>
                  </>
                )}
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
