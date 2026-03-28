import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  FileCheck2,
  FileText,
  FolderKanban,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

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

const timelineToneClasses: Record<ActivityItem["tone"], string> = {
  purple: "bg-[#6d18ff] text-white",
  indigo: "bg-indigo-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
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
    <div className="flex flex-col bg-background min-h-screen">
      <main className="flex-1 pt-24 pb-16 px-6 w-full max-w-6xl mx-auto">
        <section className="mb-8 rounded-2xl border border-[#6d18ff]/15 bg-gradient-to-br from-[#f1eaff] via-white to-[#efe3ff] p-6 md:p-8 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Dashboard - Active State
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Assessment Coverage</h2>
                  <p className="text-sm text-slate-500">Live snapshot of your active frameworks.</p>
                </div>
                <span className="rounded-full bg-[#6d18ff]/10 px-3 py-1 text-xs font-semibold text-[#6d18ff]">
                  Updated 2m ago
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SOC2 Type II
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">89%</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ISO27001
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">81%</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest compliance events from your team.
              </p>

              <div className="relative mt-6 space-y-5">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#6d18ff] to-[#6d18ff]/20" />

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
            <article className="rounded-xl bg-gradient-to-br from-[#6d18ff] to-[#5315c7] p-5 text-white shadow-lg shadow-[#6d18ff]/25">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Purple Gradient
              </p>
              <h3 className="mt-1 text-lg font-bold">Audit Sprint Window</h3>
              <p className="mt-2 text-sm text-white/90">
                9 controls are due this week. Prioritize remediations to stay on track.
              </p>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Right Column
              </h3>
              <p className="mt-2 text-2xl font-bold text-slate-900">30%</p>
              <p className="mt-1 text-xs text-slate-500">
                Reserved for detailed widgets and alerts.
              </p>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
