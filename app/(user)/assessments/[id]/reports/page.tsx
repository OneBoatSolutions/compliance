"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ExecutiveSummary, { ExecutiveSummarySkeleton } from "@/components/report/ExecutiveSummary";
import AssessmentScope from "@/components/report/AssessmentScope";
import FrameworkComparison from "@/components/report/FrameworkComparision";
import Cover from "@/components/report/Cover";
import OrganizationProfile from "@/components/report/OrganizationProfile";
import RiskAnalysis from "@/components/report/RiskAnalysis";
import Roadmap from "@/components/report/Roadmap";
import Methodology from "@/components/report/Methodology";
import FrameworkReference from "@/components/report/FrameworkReference";
import { toast } from "sonner";
import {
  fetchReportView,
  fetchReportHistory,
  generateReport,
  downloadReport,
  type ReportHistoryItem,
} from "@/lib/report-api";
import { Skeleton } from "@/components/ui/skeleton";

import { ArrowLeft, Download, Share2, Printer, FileDown } from "lucide-react";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Primary data: use the rich /view endpoint
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reportView", id],
    queryFn: () => fetchReportView(id as string),
    enabled: !!id,
    retry: 1,
  });

  const { data: historyData = [], refetch: refetchHistory } = useQuery({
    queryKey: ["report-history", id],
    queryFn: () => fetchReportHistory(id as string),
    enabled: !!id,
  });

  const hasReport = historyData.length > 0 && historyData[0]?.url !== null;

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      await generateReport(id as string);

      toast.success("Report generated");

      await Promise.all([refetch(), refetchHistory()]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const url = await downloadReport(id as string);

      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="report-print-root space-y-10">
        <Skeleton className="h-[90vh] w-full rounded-xl" aria-label="Loading compliance report" />
        <ExecutiveSummarySkeleton aria-label="Loading executive summary" />
        <Skeleton className="h-32 w-full rounded-xl" aria-label="Loading report section" />
        <Skeleton className="h-32 w-full rounded-xl" aria-label="Loading report section" />
        <Skeleton className="h-32 w-full rounded-xl" aria-label="Loading report section" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 space-y-4"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-gray-500">Failed to load report data.</p>
        <button
          aria-label="Retry loading compliance report"
          onClick={() => refetch()}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Data mapping: transform ReportViewResponse into component prop shapes ──

  // OrganizationProfile shape — maps risk strings including CRITICAL → HIGH
  const organizationUI = {
    name: data.organization.productName,
    systems: data.organization.services,
    reportId: data.assessment.id,
    dataInventory: data.evidenceRows.map((e) => ({
      category: e.code,
      inScope: e.count > 0,
      examples: e.examples,
      risk: (["CRITICAL", "HIGH"].includes(e.risk.toUpperCase())
        ? "HIGH"
        : e.risk.toUpperCase() === "MEDIUM"
          ? "MED"
          : e.risk.toUpperCase() === "LOW"
            ? "LOW"
            : "HIGH") as "LOW" | "MED" | "HIGH",
    })),
    frameworks: data.frameworkScores.map((f) => ({
      name: f.frameworkName,
      score: f.score,
      controls: 0,
      minorGaps: 0,
      highRisk: 0,
    })),
  };

  // RiskAnalysis shape — uses real backend heatmap (2D severity × status matrix)
  const riskUI = {
    total: data.riskSummary.totalRiskScore,
    distribution: data.distribution,
    heatmap: data.heatmap,
    remediation: data.controlRows.map((c) => ({
      id: c.code,
      action: c.title,
      owner: c.owner,
      dueDate: c.targetDate,
      progress: c.progress,
    })),
  };

  // Roadmap shape — uses uiStatus from backend (COMPLETED/IN_PROGRESS/OVERDUE)
  const roadmapUI = {
    summary: {
      total: data.controlRows.length,
      completed: data.controlRows.filter((c) => c.status === "COMPLIANT").length,
      inProgress: data.controlRows.filter((c) => c.status === "PARTIALLY_COMPLIANT").length,
      overdue: data.controlRows.filter((c) => c.uiStatus === "OVERDUE").length,
    },
    items: data.controlRows.map((c) => ({
      id: c.code || "",
      title: c.title || "",
      owner: c.owner || "",
      dueDate: c.targetDate || "",
      status: (c.uiStatus || "IN_PROGRESS") as "COMPLETED" | "IN_PROGRESS" | "OVERDUE",
      priority: (c.priority || "LOW") as "HIGH" | "MED" | "LOW",
    })),
  };

  const frameworkComparisonUI = data.frameworkScores.map((f) => ({
    name: f.frameworkName,
    score: f.score,
  }));

  return (
    <main className="report-print-root space-y-10" aria-labelledby="report-page-title">
      {/* Share / Print bar — preserved from our branch (investigate.md: Missing share link) */}
      <div className="print:hidden bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 ">
          {/* LEFT */}
          <div>
            <button
              aria-label="Go back to assessment checklist"
              onClick={() => router.push(`/assessments/${id}/checklist`)}
              className=" group flex items-center gap-2 text-sm font-medium  text-slate-600 hover:text-purple-700 transition-all duration-200"
            >
              <ArrowLeft className=" w-5 h-5 text-purple-600 transition-transform duration-200 group-hover:scale-125 group-hover:-translate-x-0.5" />

              <span>Back to Assessment</span>
            </button>

            <h1 id="report-page-title" className="mt-3 text-2xl font-semibold text-slate-900">
              Compliance Readiness Report
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {data.organization.productName}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <p className="text-sm  text-slate-500">
              Last generated: {new Date(data.generatedAt).toLocaleDateString()}
            </p>

            <div className="flex flex-wrap gap-2">
              {/* Share */}
              <button
                aria-label="Copy shareable report link"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="px-4 py-2 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Report
              </button>

              {/* Print */}
              <button
                aria-label="Print compliance report"
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>

              {/* Generate */}
              <button
                aria-label={
                  isGenerating ? "Generating compliance report" : "Generate compliance report"
                }
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50 flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                {isGenerating ? "Generating..." : "Generate Report"}
              </button>

              {/* Download */}
              <button
                aria-label={
                  isDownloading
                    ? "Downloading compliance report"
                    : "Download compliance report as PDF"
                }
                onClick={handleDownload}
                disabled={isDownloading || !hasReport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Cover
        aria-labelledby="report-page-title"
        appName={data.organization.productName}
        frameworks={data.frameworkScores.map((f) => f.frameworkCode)}
        generatedAt={data.generatedAt}
        preparedFor={data.organization.productName}
        version="1.0"
      />

      <div className="border-t border-gray-200 mb-8" />

      {/* Executive Summary — uses real findings/alerts from /view endpoint */}
      <ExecutiveSummary
        score={data.overallScore}
        findings={data.findings}
        alerts={data.alerts}
        appName={data.organization.productName}
      />

      <div className="border-t border-gray-200 mb-8 " />

      <OrganizationProfile organization={organizationUI} />
      <div className="border-t border-gray-200 my-4" />

      <AssessmentScope appName={data.organization.productName} organization={data.organization} />

      <FrameworkComparison
        appName={data.organization.productName}
        frameworks={frameworkComparisonUI}
      />

      <RiskAnalysis data={riskUI} appName={data.organization.productName} />

      <div className="border-t border-gray-200 my-4" />
      <Roadmap roadmap={roadmapUI} appName={data.organization.productName} />

      <Methodology appName={data.organization.productName} />

      <div className="border-t border-gray-200 my-4" />

      <FrameworkReference appName={data.organization.productName} />

      {/* Report History — preserved from our branch (investigate.md: Missing Report History) */}
      <div className="border-t border-gray-200 my-4" />
      <section
        aria-labelledby="report-history-heading"
        className="
    bg-white
    rounded-xl
    shadow
    p-8
    space-y-6
    border-t-2
    border-[#7C3AED]
  "
      >
        <div
          className="
        pb-4"
          aria-hidden="true"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            {data.organization.productName}
          </p>

          <p className="mt-1 text-sm text-slate-500">Compliance Readiness Report • Section 09</p>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <h2
            id="report-history-heading"
            className="text-xl font-bold text-slate-900 tracking-wide uppercase"
          >
            Report History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Historical assessments, generated reports, and compliance progress over time
          </p>
        </div>
        {!historyData || historyData.length === 0 ? (
          <p className="text-gray-500">No previous reports found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table aria-label="Compliance report history" className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs text-left">
                <tr>
                  <th className="p-3">Report Type</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Generated At</th>
                  <th className="p-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((h: ReportHistoryItem, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{h.type || "Compliance Report"}</td>
                    <td className="p-3">{h.format || "PDF"}</td>
                    <td className="p-3">
                      {h.generatedAt ? new Date(h.generatedAt).toLocaleDateString() : "Unknown"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          if (h.url) {
                            window.open(h.url, "_blank", "noopener,noreferrer");
                          }
                        }}
                        className="text-purple-600 hover:underline"
                        aria-label={`Download ${h.type ?? "compliance"} report generated on ${
                          h.generatedAt
                            ? new Date(h.generatedAt).toLocaleDateString()
                            : "unknown date"
                        }`}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
