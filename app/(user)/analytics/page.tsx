"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
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
import {
  Download,
  Sparkles,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  FileText,
  Clock4,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
}: {
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${cls[variant]}`}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {action && (
          <a href="#" className="text-sm text-primary font-semibold hover:underline">
            {action}
          </a>
        )}
      </div>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-xl border border-border p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[220px] text-center px-6">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <FileText className="w-5 h-5 text-muted-foreground" />
      </div>

      <h4 className="text-sm font-semibold text-foreground">{title}</h4>

      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}
function GaugeChart({ value }: { value: number }) {
  const cx = 110,
    cy = 110,
    r = 85;
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
    <svg width={220} height={180} viewBox="0 0 220 180">
      <path
        d={`M ${pt(0).x} ${pt(0).y} A ${r} ${r} 0 0 1 ${pt(180).x} ${pt(180).y}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={16}
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
      <circle cx={cx} cy={cy} r={7} fill="#7c3aed" />
      <circle cx={cx} cy={cy} r={3.5} fill="white" />
      <text x={cx} y={cy + 40} textAnchor="middle" fontSize={40} fontWeight={900} fill="#7c3aed">
        {value}%
      </text>
    </svg>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: NameType; value?: ValueType; color?: string }>;
  label?: string | number;
}
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <div className="font-bold mb-1.5 text-muted-foreground">{label}</div>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: e.color ?? "#000" }} />
          <span className="text-muted-foreground">{e.name}:</span>
          <span className="font-bold text-foreground">{e.value}%</span>
        </div>
      ))}
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

  const [shareOpen, setShareOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [shareLoading, setShareLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [shareEmail, setShareEmail] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");

  // ── Fetch /api/analytics ───────────────────────────────────────────────────
  useEffect(() => {
    if (analyticsData && !animated) {
      setAnimated(true);
    }
  }, [analyticsData, animated]);

  // ── Derived data ────────────────────────
  const overallScore = getOverallScore(analyticsData);
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
      <div className="p-6 mt-1 space-y-4">
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
  const handleShareDashboard = async () => {
    try {
      setShareLoading(true);

      await navigator.clipboard.writeText(window.location.href);

      toast.success("Dashboard link copied");

      setShareOpen(false);
    } catch {
      toast.error("Failed to share dashboard");
    } finally {
      setShareLoading(false);
    }
  };
  const handleScheduleReport = async () => {
    try {
      setScheduleLoading(true);

      // BACKEND API CALL GOES HERE
      // await fetch("/api/reports/schedule", { ... })

      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast.success(`Report scheduled ${scheduleFrequency}`);

      setScheduleOpen(false);
    } catch {
      toast.error("Failed to schedule report");
    } finally {
      setScheduleLoading(false);
    }
  };
  const aiInsights = (() => {
    const insights: {
      icon: React.ReactNode;
      title: string;
      body: string;
    }[] = [];

    // ── Lowest scoring framework
    if (frameworkTable.length > 0) {
      const weakest = [...frameworkTable].sort((a, b) => a.score - b.score)[0];

      insights.push({
        icon: <TrendingDown />,
        title: `${weakest.name} requires attention`,
        body: `Compliance score is only ${weakest.score}%. Prioritize remediation in this framework.`,
      });
    }

    // ── Highest non-compliant category
    if (categoryData.length > 0) {
      const criticalCategory = [...categoryData].sort((a, b) => b.nonCompliant - a.nonCompliant)[0];

      if (criticalCategory.nonCompliant > 0) {
        insights.push({
          icon: <AlertTriangle />,
          title: `${criticalCategory.name} has most gaps`,
          body: `${criticalCategory.nonCompliant} controls are non-compliant in this category.`,
        });
      }
    }

    // ── Critical risks
    const criticalRisk = riskRows.find((r) => r.label === "CRITICAL")?.count ?? 0;

    if (criticalRisk > 0) {
      insights.push({
        icon: <Lightbulb />,
        title: `${criticalRisk} critical risks detected`,
        body: "Immediate remediation is recommended for high severity gaps.",
      });
    }

    return insights.slice(0, 3);
  })();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-foreground">Compliance Analytics</h1>
            <p className="text-base text-muted-foreground mt-1">
              Compliance Overview ·{" "}
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
                "Last updated: just now"
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground font-medium cursor-pointer focus:ring-2 focus:ring-primary/50"
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary/5 text-sm font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Dashboard
              </button>

              {exportOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleExportCSV}
                    disabled={exportLoading}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    {exportLoading ? "Exporting..." : "Export as CSV"}
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={exportLoading}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    {exportLoading ? "Preparing..." : "Export as PDF"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── TOP 4 METRIC CARDS ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ">
          {/* Card 1 – Gauge */}
          <Card className="flex flex-col items-center justify-between py-5">
            <div className="w-full flex justify-between items-center mb-2">
              <Badge
                variant={
                  overallScore >= 80 ? "success" : overallScore >= 60 ? "warning" : "destructive"
                }
              >
                {overallScore >= 80
                  ? "COMPLIANT"
                  : overallScore >= 60
                    ? "PARTIALLY COMPLIANT"
                    : "NON-COMPLIANT"}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                {analyticsData ? `${analyticsData.frameworkComparison.length} frameworks` : "—"}
              </span>
            </div>
            <div className="flex justify-center items-center py-2">
              <GaugeChart value={overallScore} />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Overall Compliance Score
            </p>
          </Card>

          {/* Card 2 – Donut — REAL: derived from averageScore + criticalGaps */}
          <Card>
            <h4 className="font-bold text-sm text-foreground mb-3">Controls Status</h4>
            {donutData.length === 0 ? (
              <EmptyState
                title="No control data"
                description="Control status distribution will appear after assessments."
              />
            ) : (
              <>
                <div className="flex justify-center">
                  <PieChart width={180} height={150} style={{ outline: "none" }}>
                    <Pie
                      data={donutData}
                      cx={90}
                      cy={75}
                      innerRadius={45}
                      outerRadius={65}
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

                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  {donutData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    >
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}:</span>
                      <span className="font-bold text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Card 3 – Risk — REAL: criticalGaps from API */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-foreground">Risk Summary</p>

                <h3 className="text-3xl font-black text-foreground mt-1">{riskTotal}</h3>

                <p className="text-xs text-success font-semibold mt-1">Active gaps identified</p>
              </div>
            </div>

            <div className="space-y-3 mt-3">
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
          <Card className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Steps Completed</p>

                <h3 className="text-3xl font-black text-foreground mt-1">
                  {remediationProgress.completedSteps}/{remediationProgress.totalSteps}
                </h3>

                <p className="text-xs text-success font-semibold mt-1">
                  {remediationProgress.activePlans} active remediation plans
                </p>
              </div>

              <CheckCircle2 className="w-9 h-9 text-muted-foreground opacity-60" />
            </div>

            {remediationProgress.totalSteps === 0 ? (
              <EmptyState
                title="No remediation steps"
                description="Saved AI remediation plans will populate this metric."
              />
            ) : (
              <div className="mt-auto space-y-3">
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{
                      width: animated ? `${remediationProgress.completionRate}%` : "0%",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {remediationProgress.completionRate}% completion across saved remediation steps.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ── FRAMEWORK PERFORMANCE + AI INSIGHTS ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Framework Bar Chart */}
          <Card className="xl:col-span-2">
            <SectionHeader
              title="Framework Performance"
              subtitle="Compare compliance across different frameworks"
            />
            {frameworkBarData.length === 0 ? (
              <EmptyState
                title="No framework data"
                description="Framework performance will appear once assessments are completed."
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={frameworkBarData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="framework"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Legend />

                  <ReferenceLine
                    y={85}
                    stroke="#22c55e"
                    strokeDasharray="4 4"
                    label={{
                      value: "Target (85%)",
                      position: "top",
                      fill: "#22c55e",
                      fontSize: 11,
                    }}
                  />

                  <Bar dataKey="score" name="Score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* AI Insights Panel */}
          <Card className="bg-gradient-to-br from-primary-pale to-primary/10 border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary">
                <Sparkles />
              </div>

              <span className="font-bold text-base text-primary">Cipherion AI Insights</span>
            </div>

            <div className="space-y-3">
              {aiInsights.length === 0 ? (
                <div className="bg-card rounded-lg p-5 border border-dashed border-border text-center">
                  <p className="text-sm font-semibold text-foreground">No insights available</p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Insights will appear once enough compliance data is collected.
                  </p>
                </div>
              ) : (
                aiInsights.map((ins, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-3 border border-primary/20 shadow-sm"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-md text-primary flex items-center justify-center text-sm shrink-0">
                        {ins.icon}
                      </div>

                      <div>
                        <p className="font-bold text-sm text-foreground mb-0.5">{ins.title}</p>

                        <p className="text-xs text-muted-foreground leading-snug mb-1.5">
                          {ins.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              Ask Cipherion AI
            </button>
          </Card>
        </div>

        {/* ── FRAMEWORK DETAILED TABLE */}
        <Card>
          <SectionHeader title="Framework Detailed Breakdown" action="View All Frameworks" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  {(
                    [
                      ["name", "FRAMEWORK"],
                      ["score", "SCORE"],
                    ] as [string, string][]
                  ).map(([col, label]) => (
                    <th
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
                      <td className="px-3.5 py-3.5 font-semibold text-sm text-foreground">
                        {row.name}
                      </td>

                      <td className="px-3.5 py-3.5 text-center">
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Compliance Trend */}
          <Card className="xl:col-span-2">
            <div className="flex items-start justify-between mb-1">
              <SectionHeader title="Compliance Trend" subtitle="Track your progress over time" />
              {trendData.length === 0 && (
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  No data yet
                </span>
              )}
            </div>
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                Trend data will appear once history is available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <ReferenceArea y1={0} y2={60} fill="#ef4444" fillOpacity={0.05} />
                  <ReferenceArea y1={60} y2={80} fill="#f59e0b" fillOpacity={0.05} />
                  <ReferenceArea y1={80} y2={100} fill="#22c55e" fillOpacity={0.05} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
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
                          dot={idx === 0 ? { r: 3, strokeWidth: 2 } : false}
                          strokeDasharray={idx === 0 ? undefined : "4 2"}
                        />
                      ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Risk Heatmap */}
          <Card>
            <SectionHeader
              title="Risk Heatmap"
              subtitle="Identify high-impact, high-severity gaps"
            />
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
                COMPLIANT: "Compliant",
                PARTIALLY_COMPLIANT: "Partial",
                NOT_COMPLIANT: "Non-Compliant",
                NOT_APPLICABLE: "Not Applicable",
                NOT_STARTED: "Not Started",
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse table-fixed text-xs">
                    <thead>
                      <tr>
                        <th className="pb-2 pr-2 text-left text-[10px] text-muted-foreground font-bold w-10" />
                        {statuses.map((s) => (
                          <th
                            key={s}
                            className="pb-2 px-1 text-center text-[10px] text-muted-foreground font-bold w-10"
                          >
                            {statusLabels[s]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {severities.map((sev) => (
                        <tr key={sev}>
                          <td className="pr-2 py-1 text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                            {sev}
                          </td>
                          {statuses.map((sta) => {
                            const count = lookup[`${sev}__${sta}`] ?? 0;
                            const intensity = count / maxCount;
                            const bg =
                              count === 0
                                ? "#ffffff"
                                : `rgba(239,68,68,${0.12 + intensity * 0.88})`;
                            return (
                              <td key={sta} className="px-1 py-1">
                                <div
                                  onClick={() => setFilters({ impact: sev, category: sta })}
                                  className="relative h-10 w-full flex items-center justify-center rounded-md cursor-pointer overflow-hidden border border-border/30"
                                  style={{ backgroundColor: bg }}
                                  title={`${sev} / ${statusLabels[sta]}: ${count}`}
                                >
                                  <span
                                    className="text-xs font-bold"
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
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] text-muted-foreground font-bold">LOW</span>
                    <div
                      className="flex-1 h-2 rounded-full"
                      style={{
                        background: "linear-gradient(to right, #fff, rgba(239,68,68,0.2), #ef4444)",
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground font-bold">HIGH</span>
                  </div>
                  {(filters.impact || filters.category) && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      Filter: {filters.impact} · {filters.category.replaceAll("_", " ")}
                      <button
                        onClick={() => setFilters({ impact: "", category: "" })}
                        className="ml-auto text-muted-foreground hover:text-foreground"
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Category Bar */}
          <Card className="xl:col-span-2 p-5">
            <div className="mb-4">
              <h3 className="text-[20px] font-semibold text-foreground">
                Top Areas Requiring Attention
              </h3>
              <p className="text-sm text-muted-foreground">Highest non-compliance categories</p>
            </div>
            {categoryData.length === 0 ||
            categoryData.every(
              (d) => d.compliant + d.partial + d.nonCompliant + d.notApplicable === 0,
            ) ? (
              <EmptyState
                title="No category breakdown available"
                description="Category analytics will appear once controls are evaluated."
              />
            ) : (
              <div className="flex justify-center mt-6 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="compliant"
                      name="Compliant"
                      fill="#22c55e"
                      radius={[0, 4, 4, 0]}
                      stackId="a"
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
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {filters.category && (
              <div className="mt-2 text-xs text-primary font-semibold">
                Filtered by: {filters.category}
              </div>
            )}
          </Card>
        </div>

        {/* ── EXPORT + SHARE ────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Clock4 className="w-4 h-4" />
            Schedule Report
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-4 h-4" />
            Share Dashboard
          </button>
        </div>
      </div>
      {shareOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Share Dashboard</h3>

            <input
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-3 py-2 border border-border rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShareOpen(false)} className="px-4 py-2 text-sm">
                Cancel
              </button>

              <button
                onClick={handleShareDashboard}
                disabled={shareLoading}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50"
              >
                {shareLoading ? "Sharing..." : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
      {scheduleOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Schedule Report</h3>

            <select
              value={scheduleFrequency}
              onChange={(e) => setScheduleFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg mb-4"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setScheduleOpen(false)} className="px-4 py-2 text-sm">
                Cancel
              </button>

              <button
                onClick={handleScheduleReport}
                disabled={scheduleLoading}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-50"
              >
                {scheduleLoading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
