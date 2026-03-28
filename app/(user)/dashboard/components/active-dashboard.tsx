import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  FolderKanban,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { ComplianceHealthDonut } from "@/components/ui/compliance-health-donut";
import { CircularProgress } from "@/components/ui/circular-progress";
import { FrameworkBadge, type FrameworkVariant } from "@/components/ui/framework-badge";

type TrendDirection = "up" | "down" | "neutral";
type Urgency = "high" | "medium" | "low";

interface MetricCardData {
  title: string;
  value: string;
  trend: string;
  direction: TrendDirection;
  icon: LucideIcon;
}

interface ActivityItem {
  title: string;
  detail: string;
  timestamp: string;
  icon: LucideIcon;
  tone: "purple" | "indigo" | "emerald" | "amber";
}

interface AssessmentItem {
  name: string;
  framework: FrameworkVariant;
  completion: number;
  lastUpdated: string;
  owner: string;
}

interface PriorityRiskItem {
  title: string;
  detail: string;
  urgency: Urgency;
}

interface TaskItem {
  title: string;
  due: string;
  urgency: Urgency;
}

const metricCards: MetricCardData[] = [
  {
    title: "Total Assessments",
    value: "12",
    trend: "+2 this week",
    direction: "up",
    icon: FolderKanban,
  },
  {
    title: "Avg Score",
    value: "86%",
    trend: "+4.3% from last month",
    direction: "up",
    icon: TrendingUp,
  },
  {
    title: "Critical Gaps",
    value: "3",
    trend: "-1 resolved today",
    direction: "down",
    icon: AlertTriangle,
  },
  {
    title: "Reports",
    value: "7",
    trend: "2 pending review",
    direction: "neutral",
    icon: FileText,
  },
];

const activeAssessments: AssessmentItem[] = [
  {
    name: "Vendor Access Governance Review",
    framework: "SOC2",
    completion: 92,
    lastUpdated: "2 hours ago",
    owner: "Risk Team",
  },
  {
    name: "Cloud Security Baseline Audit",
    framework: "ISO27001",
    completion: 81,
    lastUpdated: "Yesterday",
    owner: "Platform Ops",
  },
  {
    name: "PHI Data Handling Controls",
    framework: "HIPAA",
    completion: 74,
    lastUpdated: "Today, 08:40 AM",
    owner: "Security Office",
  },
];

const recentActivity: ActivityItem[] = [
  {
    title: "SOC2 Assessment Updated",
    detail: "Encryption control evidence was uploaded successfully.",
    timestamp: "Today, 09:42 AM",
    icon: ShieldCheck,
    tone: "purple",
  },
  {
    title: "ISO27001 Gap Closed",
    detail: "Access review policy marked as compliant after remediation.",
    timestamp: "Today, 08:11 AM",
    icon: FileCheck2,
    tone: "emerald",
  },
  {
    title: "Critical Gap Detected",
    detail: "Backup retention mismatch found in production environment.",
    timestamp: "Yesterday, 06:23 PM",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    title: "Audit Report Generated",
    detail: "Q1 readiness report exported and shared with leadership.",
    timestamp: "Yesterday, 03:50 PM",
    icon: FileText,
    tone: "indigo",
  },
];

const priorityRisks: PriorityRiskItem[] = [
  {
    title: "MFA exemption policy drift",
    detail: "Two privileged accounts still bypass MFA enforcement.",
    urgency: "high",
  },
  {
    title: "Third-party encryption attestation",
    detail: "Vendor evidence is 18 days overdue.",
    urgency: "medium",
  },
  {
    title: "Incident response runbook refresh",
    detail: "Last tabletop simulation was over one quarter ago.",
    urgency: "low",
  },
];

const upcomingTasks: TaskItem[] = [
  {
    title: "Finalize Q2 control owner sign-off",
    due: "Due in 6 hours",
    urgency: "high",
  },
  {
    title: "Publish access recertification summary",
    due: "Due tomorrow",
    urgency: "medium",
  },
  {
    title: "Review weekly evidence sync report",
    due: "Due in 3 days",
    urgency: "low",
  },
];

const timelineToneClasses: Record<ActivityItem["tone"], string> = {
  purple: "bg-[#6d18ff] text-white",
  indigo: "bg-indigo-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
};

const urgencyChipClasses: Record<Urgency, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

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

export default function ActiveDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-24">
        <section className="mb-8 rounded-2xl border border-[#6d18ff]/15 bg-gradient-to-br from-[#f1eaff] via-white to-[#efe3ff] p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Dashboard - Active State
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Monitor compliance momentum in real time, track critical gaps, and keep your team
            audit-ready with a single purple-powered command center.
          </p>
        </section>

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
            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Active Assessments</h2>
                  <p className="text-sm text-slate-500">
                    Current compliance workstreams with progress and ownership.
                  </p>
                </div>
                <span className="rounded-full bg-[#6d18ff]/10 px-3 py-1 text-xs font-semibold text-[#6d18ff]">
                  3 assessments running
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {activeAssessments.map((assessment) => (
                  <div
                    key={assessment.name}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 md:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{assessment.name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <FrameworkBadge framework={assessment.framework} size="sm" />
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                            {assessment.owner}
                          </span>
                        </div>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Clock3 className="size-3.5" />
                          Last Updated: {assessment.lastUpdated}
                        </p>
                      </div>

                      <CircularProgress
                        value={assessment.completion}
                        label="Completion"
                        size={84}
                        strokeWidth={8}
                        className="w-[84px] shrink-0"
                        labelClassName="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest compliance events from your team.
              </p>

              <div className="relative mt-6 space-y-5">
                <div className="absolute bottom-2 left-[19px] top-2 w-0.5 bg-gradient-to-b from-[#6d18ff] to-[#6d18ff]/20" />

                {recentActivity.map((event) => {
                  const Icon = event.icon;

                  return (
                    <div key={event.title} className="relative flex gap-4">
                      <div
                        className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow ${timelineToneClasses[event.tone]}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.detail}</p>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">
                          {event.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <aside className="space-y-4 lg:col-span-3">
            <article className="rounded-xl bg-gradient-to-br from-[#7b2cff] via-[#6d18ff] to-[#4d0fad] p-5 text-white shadow-lg shadow-[#6d18ff]/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Quick Actions
              </p>
              <h3 className="mt-1 text-lg font-bold">Audit Sprint Window</h3>
              <p className="mt-2 text-sm text-white/90">
                9 controls are due this week. Prioritize remediations to stay on track.
              </p>

              <div className="mt-4 space-y-2">
                <button className="w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#5b14d8] transition hover:bg-white/90">
                  Create New Assessment
                </button>
                <button className="w-full rounded-lg border border-white/45 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                  <span className="inline-flex items-center gap-1.5">
                    <PlayCircle className="size-4" />
                    Start Guided Remediation
                  </span>
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Compliance Health
              </h3>
              <div className="mt-4 flex justify-center">
                <ComplianceHealthDonut
                  value={84}
                  label="Compliance Health"
                  subtitle="Based on active assessments"
                  size={160}
                  className="max-w-none"
                />
              </div>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Top Priority Risks
              </h3>
              <ul className="mt-4 space-y-2.5">
                {priorityRisks.map((risk) => (
                  <li
                    key={risk.title}
                    className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{risk.title}</p>
                      <p className="text-[11px] text-slate-500">{risk.detail}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${urgencyChipClasses[risk.urgency]}`}
                    >
                      {risk.urgency}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Upcoming Tasks
              </h3>
              <ul className="mt-4 space-y-2.5">
                {upcomingTasks.map((task) => (
                  <li
                    key={task.title}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div className="inline-flex items-center gap-2">
                      {task.urgency === "high" ? (
                        <ShieldAlert className="size-4 text-rose-600" />
                      ) : (
                        <CheckCircle2
                          className={`size-4 ${task.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}`}
                        />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{task.title}</p>
                        <p className="text-[11px] text-slate-500">{task.due}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${urgencyChipClasses[task.urgency]}`}
                    >
                      {task.urgency}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                Auto-refreshed from weekly compliance plan.
              </p>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
