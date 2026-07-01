"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { PieChart as PieChartIcon } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { ClipboardCheck } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { AlertOctagon } from "lucide-react";
import { TableProperties } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

import { Download, FileText } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: API TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface TrendPoint {
  [key: string]: string | number;
}

interface FrameworkComparisonItem {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

interface StatusDistributionItem {
  status: "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NOT_COMPLIANT" | "NOT_APPLICABLE" | "NOT_STARTED";

  count: number;
}

interface CategoryCompletionItem {
  category: string;

  compliant: number;

  partial: number;

  nonCompliant: number;

  notApplicable: number;
}

interface RiskHeatmapItem {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  status: "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NOT_COMPLIANT" | "NOT_APPLICABLE" | "NOT_STARTED";

  count: number;
}

interface AnalyticsApiResponse {
  trend: TrendPoint[];

  frameworkComparison: FrameworkComparisonItem[];

  statusDistribution: StatusDistributionItem[];

  categoryCompletion: CategoryCompletionItem[];

  riskHeatmap: RiskHeatmapItem[];

  remediationProgress: {
    totalSteps: number;
    completedSteps: number;
    activePlans: number;
    completionRate: number;
  };
}

const rangeOptions = ["Last 30 days", "Last 90 days", "All time", "Custom range"] as const;

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number): string {
  return toDateInputValue(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: FRONTEND DATA ADAPTERS
// ─────────────────────────────────────────────────────────────────────────────
function getOverallScore(data: AnalyticsApiResponse | null): number {
  if (!data?.frameworkComparison?.length) {
    return 0;
  }
  const total = data.frameworkComparison.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / data.frameworkComparison.length);
}

function getDonutData(data: AnalyticsApiResponse | null) {
  if (!data?.statusDistribution) {
    return [];
  }
  const colorMap: Record<string, string> = {
    COMPLIANT: "#22c55e",
    PARTIALLY_COMPLIANT: "#f59e0b",
    NOT_COMPLIANT: "#ef4444",
    NOT_APPLICABLE: "#9ca3af",
    NOT_STARTED: "#6b7280",
  };
  return data.statusDistribution.map((item) => ({
    name: item.status.replaceAll("_", " "),
    value: item.count,
    color: colorMap[item.status] ?? "#9ca3af",
  }));
}

function getFrameworkBarData(data: AnalyticsApiResponse | null) {
  if (!data?.frameworkComparison) {
    return [];
  }
  return data.frameworkComparison.map((item) => ({
    framework: item.frameworkCode,
    score: item.score,
  }));
}

function getFrameworkTableData(data: AnalyticsApiResponse | null) {
  if (!data?.frameworkComparison) {
    return [];
  }
  return data.frameworkComparison.map((item) => ({
    name: item.frameworkName,
    score: item.score,
    colorClass:
      item.score >= 80 ? "text-success" : item.score >= 60 ? "text-warning" : "text-destructive",
  }));
}

// Risk rows derived from riskHeatmap — groups by severity
function getRiskRows(data: AnalyticsApiResponse | null) {
  if (!data?.riskHeatmap?.length) {
    return { rows: [], total: 0 };
  }

  const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const colorMap: Record<string, string> = {
    CRITICAL: "bg-destructive",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-warning",
    LOW: "bg-success",
  };

  // Sum counts per severity
  const bySeverity: Record<string, number> = {};
  for (const item of data.riskHeatmap) {
    bySeverity[item.severity] = (bySeverity[item.severity] ?? 0) + item.count;
  }

  const total = Object.values(bySeverity).reduce((s, c) => s + c, 0);

  const rows = severityOrder
    .filter((s) => bySeverity[s] !== undefined)
    .map((s) => ({
      label: s,
      count: bySeverity[s],
      pct: total > 0 ? Math.round((bySeverity[s] / total) * 100) : 0,
      colorClass: colorMap[s] ?? "bg-muted",
    }));

  return { rows, total };
}

// Category bar data from categoryCompletion
function getCategoryBarData(data: AnalyticsApiResponse | null) {
  if (!data?.categoryCompletion) {
    return [];
  }
  return data.categoryCompletion.map((item) => ({
    name: item.category,
    compliant: item.compliant,
    partial: item.partial,
    nonCompliant: item.nonCompliant,
    notApplicable: item.notApplicable,
  }));
}
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Badge({
  children,
  variant = "warning",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  variant?: "warning" | "success" | "destructive" | "primary" | "muted";
}) {
  const cls = {
    warning: "bg-yellow-100 text-yellow-700",
    success: "bg-green-100 text-green-700",
    destructive: "bg-red-100 text-red-700",
    primary: "bg-purple-100 text-purple-700",
    muted: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      {...props}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${cls[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-card rounded-xl border border-border p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}
function EmptyState({ title, description, ...props }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-[180px] text-center px-6"
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <FileText className="w-5 h-5 text-muted-foreground" />
      </div>

      <h4 className="text-sm font-semibold text-foreground">{title}</h4>

      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}
function GaugeChart({ value }: { value: number }) {
  const cx = 130,
    cy = 130,
    r = 100;
  const pt = (deg: number) => ({
    x: cx - r * Math.cos((deg * Math.PI) / 180),
    y: cy - r * Math.sin((deg * Math.PI) / 180),
  });
  const arc = (a1: number, a2: number, color: string) => {
    const s = pt(a1),
      e = pt(a2);
    return (
      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x} ${e.y}`}
        fill="none"
        stroke={color}
        strokeWidth={16}
        strokeLinecap="round"
      />
    );
  };
  const needleDeg = (value / 100) * 180;
  const tip = pt(needleDeg);
  return (
    <svg
      width={260}
      height={210}
      viewBox="0 0 260 210"
      role="img"
      aria-label={`Overall compliance score ${value} percent`}
    >
      <path
        d={`M ${pt(0).x} ${pt(0).y} A ${r} ${r} 0 0 1 ${pt(180).x} ${pt(180).y}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={18}
        strokeLinecap="round"
      />
      {arc(0, 108, "#ef4444")}
      {arc(108, 144, "#f59e0b")}
      {arc(144, 180, "#22c55e")}
      <line
        x1={cx}
        y1={cy}
        x2={tip.x}
        y2={tip.y}
        stroke="#7c3aed"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={9} fill="#7c3aed" />
      <circle cx={cx} cy={cy} r={4.5} fill="white" />
      <text x={cx} y={cy + 48} textAnchor="middle" fontSize={36} fontWeight={900} fill="#7c3aed">
        {value}%
      </text>
      <text x={18} y={198} fontSize={20} fill="#ef4444">
        Low
      </text>

      <text x={130} y={198} fontSize={20} textAnchor="middle" fill="#f59e0b">
        Medium
      </text>

      <text x={242} y={198} textAnchor="end" fontSize={20} fill="#22c55e">
        High
      </text>
    </svg>
  );
}

// Tooltip content is now defined in the dynamically loaded trend-line wrapper component.
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    color?: string;
    name?: string;
    value?: number;
  }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-white px-4 py-3 shadow-xl">
      <p className="mb-2 text-sm font-semibold text-slate-700">
        {new Date(label ?? "").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}</span>
            </div>

            <span className="font-semibold">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  // ── API state ──────────────────────────────────────────────────────────────
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [customStartDate, setCustomStartDate] = useState(daysAgo(30));
  const [customEndDate, setCustomEndDate] = useState(toDateInputValue(new Date()));
  const isCustomRange = timeRange === "Custom range";
  const customRangeValid =
    !isCustomRange || (!!customStartDate && !!customEndDate && customStartDate <= customEndDate);
  const analyticsUrl = useMemo(() => {
    if (isCustomRange) {
      return `/api/analytics?startDate=${encodeURIComponent(
        customStartDate,
      )}&endDate=${encodeURIComponent(customEndDate)}`;
    }

    return `/api/analytics?range=${encodeURIComponent(timeRange)}`;
  }, [customEndDate, customStartDate, isCustomRange, timeRange]);

  const {
    data: analyticsData = null,
    isLoading: analyticsLoading,
    error,
  } = useQuery({
    queryKey: ["analytics", timeRange, customStartDate, customEndDate],
    queryFn: () => apiClient.get<AnalyticsApiResponse>(analyticsUrl),
    enabled: customRangeValid,
  });
  const analyticsError = error instanceof Error ? error.message : null;
  const rangeError = customRangeValid ? null : "Choose a valid custom start and end date range";

  // ── UI state ──────────────────────────────────────────────────────────────
  const [sortCol, setSortCol] = useState("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const [filters, setFilters] = useState({ impact: "", category: "" });
  const [exportOpen, setExportOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // ── Fetch /api/analytics ───────────────────────────────────────────────────
  useEffect(() => {
    if (analyticsData && !animated) {
      setAnimated(true);
    }
  }, [analyticsData, animated]);

  //key nav for dropdown
  useEffect(() => {
    const close = () => setExportOpen(false);

    document.addEventListener("click", close);

    return () => document.removeEventListener("click", close);
  }, []);

  // ── Derived data ────────────────────────
  const overallScore = getOverallScore(analyticsData);
  const complianceLabel =
    overallScore >= 80 ? "Healthy" : overallScore >= 60 ? "Needs Attention" : "Critical";

  const donutData = getDonutData(analyticsData);
  const frameworkBarData = getFrameworkBarData(analyticsData);
  const frameworkTable = getFrameworkTableData(analyticsData);
  const { rows: riskRows, total: riskTotal } = getRiskRows(analyticsData);
  const categoryData = getCategoryBarData(analyticsData);
  const trendData =
    analyticsData?.trend.map((point) => ({
      day: String(point.date),
      Score: Number(point.score),
    })) ?? [];
  const totalControls = donutData.reduce((s, d) => s + d.value, 0);
  const remediationProgress = analyticsData?.remediationProgress ?? {
    totalSteps: 0,
    completedSteps: 0,
    activePlans: 0,
    completionRate: 0,
  };
  const highestFramework = analyticsData?.frameworkComparison
    ?.slice()
    .sort((a, b) => b.score - a.score)[0];

  const lowestFramework = analyticsData?.frameworkComparison
    ?.slice()
    .sort((a, b) => a.score - b.score)[0];

  const sortedTable = [...frameworkTable].sort((a, b) => {
    const av =
      typeof a[sortCol as keyof typeof a] === "number"
        ? (a[sortCol as keyof typeof a] as number)
        : 0;
    const bv =
      typeof b[sortCol as keyof typeof b] === "number"
        ? (b[sortCol as keyof typeof b] as number)
        : 0;
    return sortDir === "asc" ? av - bv : bv - av;
  });
  const sortHandler = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  };
  if (analyticsLoading) {
    return (
      <div className="p-6 mt-1 space-y-6" aria-hidden="true">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((item, i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  const handleExportCSV = async () => {
    try {
      setExportLoading(true);

      const headers = ["Framework", "Score"];

      const rows = frameworkTable.map((row) => [row.name, row.score]);

      const csvContent =
        "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");

      const link = document.createElement("a");

      link.href = encodeURI(csvContent);

      link.download = "compliance-analytics.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success("CSV exported successfully");
    } catch {
      toast.error("Failed to export CSV");
    } finally {
      setExportLoading(false);
      setExportOpen(false);
    }
  };
  const handleExportPDF = async () => {
    try {
      setExportLoading(true);

      window.print();

      toast.success("PDF export started");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setExportLoading(false);
      setExportOpen(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background min-h-screen" role="main" aria-labelledby="analytics-page-title">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className=" relative overflow-hidden rounded-[32px] border border-violet-200 bg-gradient-to-br from-[#fcfbff] via-[#f8f3ff] to-[#efe3ff] px-8 py-8 shadow-lg">
          {/* Decorative Glow */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="absolute left-20 bottom-0 h-40 w-40 rounded-full bg-purple-200/20 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Link
                href="/dashboard"
                className="
    inline-flex
    items-center
    gap-2
    rounded-xl
    bg-white/10
    px-4
    py-2
    text-sm
    font-medium
    text-primary
    transition
    hover:bg-white/20
    focus:outline-none
    focus:ring-2
    focus:ring-white
  "
                aria-label="Return to Assessments Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Assessments Dashboard
              </Link>
              <h1
                className="text-4xl font-bold tracking-tight text-slate-900"
                id="analytics-page-title"
              >
                Compliance Analytics
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Comprehensive insights into compliance posture, framework performance, and
                remediation progress.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                Compliance Overview{" "}
                {analyticsLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block" />
                    <span>Loading...</span>
                  </span>
                ) : analyticsError || rangeError ? (
                  <span className="text-warning text-xs">
                    Warning: {analyticsError || rangeError}
                  </span>
                ) : (
                  ""
                )}
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span>{analyticsData?.frameworkComparison?.length ?? 0} Frameworks</span>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Select analytics time range"
                  value={timeRange}
                  onChange={(e) => {
                    setTimeRange(e.target.value);
                    setExportOpen(false);
                  }}
                  className="h-11 rounded-xl border border-violet-200 bg-white/80 px-4 text-sm font-medium shadow-sm backdrop-blur-sm focus:ring-2 focus:ring-violet-300"
                >
                  {rangeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                {isCustomRange && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(event) => setCustomStartDate(event.target.value)}
                      className="bg-transparent text-sm outline-none"
                      aria-label="Analytics start date"
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(event) => setCustomEndDate(event.target.value)}
                      className="bg-transparent text-sm outline-none"
                      aria-label="Analytics end date"
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExportOpen((prev) => !prev);
                  }}
                  aria-label="Export compliance analytics dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary hover:bg-violet-50 bg-white/70
                           shadow-sm backdrop-blur-sm hover:bg-violet-50 hover:shadow-md text-sm font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Dashboard
                </button>

                {exportOpen && (
                  <div
                    className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-xl z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleExportCSV}
                      disabled={exportLoading}
                      aria-label="Export analytics as CSV"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-violet-50 disabled:opacity-50"
                    >
                      {exportLoading ? "Exporting..." : "Export as CSV"}
                    </button>
                    <button
                      onClick={handleExportPDF}
                      disabled={exportLoading}
                      aria-label="Export analytics as PDF"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
                    >
                      {exportLoading ? "Preparing..." : "Export as PDF"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── TOP 4 METRIC CARDS ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 space-y-8 ">
          {/* Card 1 – Gauge */}
          <Card
            className="flex flex-col justify-between min-h-[340px] p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300"
            aria-label="Overall Compliance Score"
          >
            <div
              className="w-full flex items-start justify-between"
              role="region"
              aria-labelledby="overall-score-heading"
            >
              <div>
                <p className="text-sm font-bold text-slate" id="overall-score-heading">
                  Overall Compliance Score
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {analyticsData
                    ? `Average across ${analyticsData.frameworkComparison.length} frameworks`
                    : "Loading..."}
                </p>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3">
                <ShieldCheck
                  className="h-5 w-5 text-primary  rounded-2xl  bg-gradient-to-br
                      from-violet-100 to-violet-50 shadow-sm "
                />
              </div>
            </div>

            <div className="flex justify-center items-center py-4 h-[170px]">
              <GaugeChart value={overallScore} />
            </div>
            <div className="mt-3">
              <Badge
                variant={
                  overallScore >= 80 ? "success" : overallScore >= 60 ? "warning" : "destructive"
                }
                aria-label={`Compliance status ${complianceLabel}`}
              >
                {complianceLabel}
              </Badge>
            </div>
          </Card>

          {/* Card 2 – Donut — REAL: derived from averageScore + criticalGaps */}
          <Card
            className="flex flex-col justify-between min-h-[340px] p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300"
            aria-label="Controls Status Summary"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-slate">Controls Status</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {totalControls} controls evaluated
                </p>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3">
                <PieChartIcon
                  className="h-5 w-5 text-primary 
                        rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 shadow-sm"
                />
              </div>
            </div>
            {donutData.length === 0 ? (
              <EmptyState
                title="No control data"
                description="Control status distribution will appear after assessments."
              />
            ) : (
              <>
                <div className="flex justify-center h-[170px] items-center">
                  <PieChart
                    width={190}
                    height={190}
                    style={{ outline: "none" }}
                    role="img"
                    aria-label="Distribution of compliance control status"
                  >
                    <Pie
                      data={donutData}
                      cx={90}
                      cy={75}
                      innerRadius={52}
                      outerRadius={82}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={3}
                      minAngle={4}
                      labelLine={false}
                      isAnimationActive={false}
                      stroke="none"
                      label={({ cx: lx, cy: ly }) => (
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central">
                          <tspan x={lx} dy="-5" fontSize={24} fontWeight={900}>
                            {totalControls}
                          </tspan>
                          <tspan x={lx} dy="18" fontSize={11} fill="#6b7280">
                            Total
                          </tspan>
                        </text>
                      )}
                      onClick={(data: { name?: string }) =>
                        setFilters({ impact: "", category: data.name ?? "" })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {donutData.map((d, i) => (
                        <Cell key={i} fill={d.color} stroke="none" strokeWidth={0} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>

                <div className=" bg-muted px-3 py-1 flex flex-wrap gap-2 text-xs">
                  {donutData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 "
                    >
                      <div className="w-2 h-2 " style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}:</span>
                      <span className="font-bold text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Card 3 – Risk — REAL: criticalGaps from API */}
          <Card
            className="flex flex-col justify-between min-h-[340px] p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 "
            aria-label="Risk Summary"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex h-[170px] flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-slate">Risk Summary</p>

                <h3 className="mt-3 text-5xl font-black text-foreground">{riskTotal}</h3>

                <p className="text-xs text-muted-foreground">Active gaps identified</p>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3">
                <TriangleAlert
                  className="h-5 w-5 text-primary 


rounded-2xl
bg-gradient-to-br
from-violet-100
to-violet-50
shadow-sm
"
                />
              </div>
            </div>

            <div className="space-y-6 mt-8">
              {riskRows.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>

                    <span className="text-xs font-bold text-foreground">{r.count}</span>
                  </div>

                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${r.colorClass}`}
                      style={{
                        width: animated ? `${r.pct}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 4 – Velocity — REAL: totalAssessments + recentActivity */}
          <Card
            className="flex flex-col justify-between min-h-[340px] p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300"
            aria-label="Remediation Progress"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex h-[170px] flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-slate">Remediation Progress</p>

                <h3 className="mt-3 text-5xl font-black text-center">
                  {remediationProgress.completedSteps}/{remediationProgress.totalSteps}
                </h3>

                <p className="text-xs text-muted-foreground">
                  {remediationProgress.activePlans} active plans
                </p>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3">
                <ClipboardCheck className="h-5 w-5 text-primary  rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 shadow-sm " />
              </div>
            </div>

            {remediationProgress.totalSteps === 0 ? (
              <EmptyState
                title="No remediation steps"
                description="Saved AI remediation plans will populate this metric."
              />
            ) : (
              <div className="mt-8 w-full space-y-6">
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{
                      width: animated ? `${remediationProgress.completionRate}%` : "0%",
                    }}
                  />
                </div>
                <div className="mt-3">
                  <Badge
                    variant="success"
                    aria-label={`Remediation progress ${remediationProgress.completionRate} percent complete`}
                  >
                    {remediationProgress.completionRate}% Complete
                  </Badge>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── FRAMEWORK PERFORMANCE + AI INSIGHTS ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 space-y-8">
          {/* Framework Bar Chart */}
          <Card
            className="xl:col-span-3 shadow-sm
hover:shadow-xl
hover:shadow-violet-100/60
transition-all
duration-300
border-violet-100"
          >
            <div className="space-y-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-[20px] font-bold text-foreground">Framework Performance</h3>

                  <p className="text-sm text-muted-foreground">
                    Compare framework compliance scores
                  </p>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Average Score
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-violet-700">{overallScore}%</h3>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Highest Framework
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-emerald-700">
                    {highestFramework?.frameworkCode ?? "--"}
                  </h3>

                  <p className="text-sm text-slate-600">{highestFramework?.score ?? 0}%</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lowest Framework
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-amber-700">
                    {lowestFramework?.frameworkCode ?? "--"}
                  </h3>

                  <p className="text-sm text-slate-600">{lowestFramework?.score ?? 0}%</p>
                </div>
              </div>
            </div>
            {frameworkBarData.length === 0 ? (
              <EmptyState
                title="No framework data"
                description="Framework performance will appear once assessments are completed."
              />
            ) : (
              <div className="rounded-2xl bg-violet-50/40 border border-violet-100 p-4">
                <div className="rounded-xl bg-violet-80 p-4">
                  <div role="img" aria-label="Framework compliance performance chart">
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart
                        data={frameworkBarData}
                        margin={{ top: 20, right: 10, left: -15, bottom: 20 }}
                      >
                        <CartesianGrid
                          stroke="#ddd6fe"
                          strokeOpacity={0.8}
                          strokeDasharray="4 4"
                          vertical={false}
                        />

                        <ReferenceArea y1={0} y2={100} fill="#f8f5ff" fillOpacity={0.3} />

                        <XAxis
                          dataKey="framework"
                          tick={{ fontSize: 14, fontWeight: 600, fill: "#475569" }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          cursor={{
                            stroke: "#7c3aed",
                            strokeWidth: 1,
                            strokeDasharray: "4 4",
                          }}
                          contentStyle={{
                            borderRadius: 16,
                            border: "1px solid #ddd6fe",
                            boxShadow: "0 10px 25px rgba(109,24,255,.12)",
                          }}
                        />

                        <ReferenceLine
                          y={85}
                          stroke="#22c55e"
                          strokeDasharray="6 6"
                          strokeWidth={2.5}
                          label={{
                            value: "Target (85%)",
                            position: "top",
                            fill: "#22c55e",
                            fontSize: 11,
                          }}
                        />

                        <Bar
                          dataKey="score"
                          name="Score"
                          fill="#7c3aed"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={55}
                          animationDuration={1200}
                          animationEasing="ease-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex justify-center mt-5">
                  <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2">
                    <div className="w-3 h-3 rounded-full bg-violet-600" />
                    <span className="text-sm font-medium"> Compliance Score </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* AI Insights Panel */}
        </div>

        {/* ── FRAMEWORK DETAILED TABLE */}
        <Card>
          <div className="mb-5 flex items-center gap-3 space-y-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 shadow-sm">
              <TableProperties className="h-5 w-5 text-violet-600" />
            </div>

            <div>
              <h3 className="text-[20px] font-bold">Framework Scores</h3>

              <p className="text-sm text-muted-foreground">
                Performance across selected frameworks
              </p>
            </div>
          </div>
          <div className=" overflow-x-auto rounded-xl  border  border-violet-100  bg-violet-50/25  p-4">
            <table
              className="min-w-[430px] w-full table-fixed border-collapse text-xs "
              aria-label="Framework compliance scores"
            >
              <thead>
                <tr className="border-b-2 border-border">
                  {(
                    [
                      ["name", "FRAMEWORK"],
                      ["score", "SCORE"],
                    ] as [string, string][]
                  ).map(([col, label]) => (
                    <th
                      aria-sort={
                        sortCol === col ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                      }
                      key={col}
                      onClick={() => sortHandler(col)}
                      className={`px-3.5 py-2.5 text-left text-[11px] font-bold tracking-wider text-muted-foreground cursor-pointer select-none ${sortCol === col ? "bg-primary-pale" : ""}`}
                    >
                      {label} {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTable.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-10 text-center text-sm text-muted-foreground">
                      No framework assessments available yet.
                    </td>
                  </tr>
                ) : (
                  sortedTable.map((row, i) => (
                    <tr
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`border-b border-border/50 transition-colors ${
                        hoveredRow === i ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-3.5 py-3.5 font-semibold text-sm text-foreground align-middle">
                        {row.name}
                      </td>

                      <td className="px-3.5 py-3.5 text-center align-middle">
                        <span className={`font-black text-base ${row.colorClass}`}>
                          {row.score}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── COMPLIANCE TREND + RISK HEATMAP ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 space-y-8">
          {/* Compliance Trend */}
          <Card
            role="img"
            className="xl:col-span-2 h-full"
            aria-label="Compliance score trend over time"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 shadow-sm">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-[20px] font-bold text-foreground">Compliance Trend</h3>

                  <p className="text-sm text-muted-foreground">Track compliance score over time</p>
                </div>
              </div>
              {trendData.length === 0 && (
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  No data yet
                </span>
              )}
            </div>
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
                Trend data will appear once history is available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={trendData} margin={{ top: 8, right: 12, left: -18, bottom: 8 }}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e5e7eb"
                    vertical={false}
                    y1={0}
                    y2={100}
                    fill="#f8f5ff"
                    fillOpacity={1}
                  />
                  <ReferenceArea y1={0} y2={60} fill="#ef4444" fillOpacity={0.05} />
                  <ReferenceArea y1={60} y2={80} fill="#f59e0b" fillOpacity={0.05} />
                  <ReferenceArea y1={80} y2={100} fill="#22c55e" fillOpacity={0.05} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#475569" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#475569" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  {trendData.length > 0 &&
                    Object.keys(trendData[0])
                      .filter((k) => k !== "day")
                      .map((key, idx) => (
                        <Line
                          key={key}
                          name={key}
                          dataKey={key}
                          stroke={
                            ["#7c3aed", "#14b8a6", "#3b82f6", "#6366f1", "#f59e0b", "#ef4444"][
                              idx % 6
                            ]
                          }
                          strokeWidth={idx === 0 ? 3 : 2}
                          dot={idx === 0 ? { r: 5, strokeWidth: 3 } : false}
                          strokeDasharray={idx === 0 ? undefined : "4 2"}
                        />
                      ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Risk Heatmap */}
          <Card className="h-full">
            <div className="mb-5 flex items-center gap-3 space-y-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 shadow-sm">
                <TriangleAlert className="h-5 w-5 text-orange-600" />
              </div>

              <div>
                <h3 className="text-[20px] font-bold text-foreground">Risk Heatmap</h3>

                <p className="text-sm text-muted-foreground">
                  Identify high-impact compliance gaps
                </p>
              </div>
            </div>
            {(() => {
              const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
              const statuses = [
                "COMPLIANT",
                "PARTIALLY_COMPLIANT",
                "NOT_COMPLIANT",
                "NOT_APPLICABLE",
                "NOT_STARTED",
              ] as const;
              const statusLabels: Record<string, string> = {
                COMPLIANT: "✓",
                PARTIALLY_COMPLIANT: "Part",
                NOT_COMPLIANT: "Non",
                NOT_APPLICABLE: "N/A",
                NOT_STARTED: "Start",
              };
              // Build lookup: severity+status → count
              const lookup: Record<string, number> = {};
              for (const item of analyticsData?.riskHeatmap ?? []) {
                lookup[`${item.severity}__${item.status}`] = item.count;
              }
              const maxCount = Math.max(1, ...Object.values(lookup));
              if (!analyticsData?.riskHeatmap?.length) {
                return (
                  <EmptyState
                    title="No risk data"
                    description="Risk severity insights will appear after compliance scans run."
                  />
                );
              }

              return (
                <div className="rounded-xl border border-violet-200/80 shadow-sm hover:shadow-md p-4">
                  <div className="overflow-x-auto">
                    <table
                      className="w-full border-collapse table-fixed text-xs"
                      role="grid"
                      aria-label="Compliance risk heatmap"
                    >
                      <thead>
                        <tr>
                          <th className="  sticky left-0 z-30 bg-white w-24 min-w-[90px]" />
                          {statuses.map((s) => (
                            <th
                              key={s}
                              className="pb-3 px-2 text-center text-[11px] text-muted-foreground font-bold w-14"
                            >
                              <span title={s.replaceAll("_", " ")}>{statusLabels[s]}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {severities.map((sev) => (
                          <tr key={sev}>
                            <td className="  sticky left-0 z-20 bg-white w-24 min-w-[90px] pr-3 py-2 text-[11px] font-semibold whitespace-nowrap">
                              {sev}
                            </td>
                            {statuses.map((sta) => {
                              const count = lookup[`${sev}__${sta}`] ?? 0;
                              const intensity = count / maxCount;
                              const bg =
                                count === 0
                                  ? "#ffffff"
                                  : `rgba(239,68,68,${0.12 + intensity * 0.88})`;
                              const isSelected = filters.impact === sev && filters.category === sta;
                              return (
                                <td key={sta} className="px-1 py-1">
                                  <div
                                    onClick={() => setFilters({ impact: sev, category: sta })}
                                    className={`relative h-12 w-full flex items-center justify-center rounded-lg cursor-pointer
                                             overflow-hidden border border-violet-100 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:border-red-300 hover:z-10 ${
                                               isSelected
                                                 ? "ring-2 ring-violet-500 shadow-lg scale-[1.03] z-10"
                                                 : ""
                                             }
`}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setFilters({
                                          impact: sev,
                                          category: sta,
                                        });
                                      }
                                    }}
                                    aria-label={`${sev} severity, ${sta.replaceAll("_", " ")}, ${count} controls`}
                                    style={{ backgroundColor: bg }}
                                    title={`${sev} • ${sta.replaceAll("_", " ")} : ${count} controls`}
                                  >
                                    <span
                                      className="text-[11px] font-semibold leading-none"
                                      style={{ color: intensity > 0.4 ? "#fff" : "#374151" }}
                                    >
                                      {count > 0 ? count : "—"}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-3 mt-6 border-t pt-4 border-border">
                    <span className="text-[10px] text-muted-foreground font-bold">LOW</span>
                    <div
                      className="flex-1 h-2 rounded-full shadow-inner"
                      style={{
                        background: "linear-gradient(to right, #fff, rgba(239,68,68,0.2), #ef4444)",
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground font-bold">HIGH</span>
                  </div>
                  {(filters.impact || filters.category) && (
                    <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary  mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      Filter: {filters.impact} · {filters.category.replaceAll("_", " ")}
                      <button
                        onClick={() => setFilters({ impact: "", category: "" })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setFilters({ impact: "", category: "" });
                          }
                        }}
                        aria-live="polite"
                        className="ml-auto text-muted-foreground hover:text-foreground"
                        aria-label="Clear selected heatmap filters"
                      >
                        ✕ Clear
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </Card>
        </div>

        {/* ── NON-COMPLIANT CATEGORIES + RECENT ACTIVITY ───────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 space-y-8">
          {/* Category Bar */}
          <Card
            className="xl:col-span-3 rounded-3xl p-7 shadow-md shadow-violet-100/40"
            role="img"
            aria-label="Top non-compliant compliance categories"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 shadow-sm">
                <AlertOctagon className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <h3 className="text-[20px] font-bold text-foreground">
                  Top Areas Requiring Attention
                </h3>

                <p className="text-sm text-muted-foreground">Highest non-compliance categories</p>
              </div>
            </div>
            {categoryData.length === 0 ||
            categoryData.every(
              (d) => d.compliant + d.partial + d.nonCompliant + d.notApplicable === 0,
            ) ? (
              <EmptyState
                title="No category breakdown available"
                description="Category analytics will appear once controls are evaluated."
                role="status"
                aria-live="polite"
              />
            ) : (
              <div className="mt-6 h-[600px]">
                <div className="h-full rounded-2xl bg-violet-50/40 p-5 border border-violet-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                      barCategoryGap="45%"
                    >
                      <CartesianGrid
                        stroke="#dbe4f0"
                        strokeDasharray="4 4"
                        vertical
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={220}
                        interval={0}
                        tick={{ fontSize: 11, fill: "#475569" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value: string) =>
                          value.length > 28 ? `${value.slice(0, 28)}...` : value
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #E9D5FF",
                          boxShadow: "0 10px 25px rgba(109,24,255,0.08)",
                          fontSize: "13px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="compliant"
                        name="Compliant"
                        fill="#22c55e"
                        radius={[0, 8, 8, 0]}
                        stackId="a"
                        barSize={22}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                      <Bar
                        dataKey="partial"
                        name="Partial"
                        fill="#f59e0b"
                        radius={[0, 0, 0, 0]}
                        stackId="a"
                      />
                      <Bar
                        dataKey="nonCompliant"
                        name="Non-Compliant"
                        fill="#ef4444"
                        radius={[0, 0, 0, 0]}
                        stackId="a"
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {filters.category && (
              <div className="flex items-center gap-2 self-start sm:self-auto bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Filtered by: {filters.category.replaceAll("_", " ")}
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: "" }))}
                  className="ml-1.5 text-muted-foreground hover:text-foreground font-black text-xs cursor-pointer"
                  title="Clear filter"
                >
                  ✕
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
