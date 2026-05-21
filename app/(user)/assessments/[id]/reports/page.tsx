"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ExecutiveSummary, { ExecutiveSummarySkeleton } from "@/components/report/ExecutiveSummary";

import Cover from "@/components/report/Cover";

import OrganizationProfile from "@/components/report/OrganizationProfile";
import RiskAnalysis from "@/components/report/RiskAnalysis";
import Roadmap from "@/components/report/Roadmap";

import { generateReport, downloadReport, fetchReportView } from "@/lib/report-api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { Share2, Printer } from "lucide-react";

interface ReportHistoryItem {
  type?: string;
  format?: string;
  generatedAt?: string;
  url?: string;
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Primary data: use the rich /view endpoint introduced in feat/fe1/report-integration
  // This provides typed ReportViewResponse with real backend calculations
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reportView", id],
    queryFn: () => fetchReportView(id as string),
    enabled: !!id,
    retry: 1,
  });

  // Report history sidebar: preserved from our branch fix (investigate.md: Missing Report History)
  const { data: historyData } = useQuery({
    queryKey: ["report-history", id],
    queryFn: () => apiClient.get<ReportHistoryItem[]>(`/api/reports/${id}/history`),
    enabled: !!id,
  });

  const hasReport = Boolean(historyData && historyData.length > 0 && historyData[0].url);

  // 🔹 Generate: use dev's approach — extract fileUrl from generate response
  // and open the PDF directly (resolves race condition of separate generate + download calls)
  const handleGenerate = async () => {
    const toastId = toast.loading("Generating report...");

    try {
      setIsGenerating(true);

      // Generate report and get download URL directly from the response
      const { fileUrl: url } = await generateReport(id as string);

      // Open PDF in new tab
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Report generated successfully", { id: toastId });
      // Refetch to update history section
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  // 🔹 Download: preserved from our branch (dev's version dropped this entirely)
  const handleDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading("Preparing download...");

    try {
      const url = await downloadReport(id as string);
      window.open(url);
      toast.success("Download started", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Report not available yet", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="report-print-root space-y-10">
        <Skeleton className="h-[90vh] w-full rounded-xl" />
        <ExecutiveSummarySkeleton />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-gray-500">Failed to load report data.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-purple-600 text-white rounded">
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
  // Excludes NOT_STARTED from progress counts per dev's audit fix
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

  return (
    <div className="report-print-root space-y-10">
      {/* Share / Print bar — preserved from our branch (investigate.md: Missing share link) */}
      <div className="flex justify-end gap-4 mb-6 print:hidden">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
          }}
          className="px-4 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50 bg-white shadow-sm"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-purple-600 text-white rounded text-sm flex items-center gap-2 hover:bg-purple-700 shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <Cover
        appName={data.organization.productName}
        frameworks={data.frameworkScores.map((f) => f.frameworkCode)}
        generatedAt={data.generatedAt}
        preparedFor={data.organization.productName}
        version="1.0"
        isGenerating={isGenerating}
        isDownloading={isDownloading}
        hasReport={hasReport}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
      />

      {/* Executive Summary — uses real findings/alerts from /view endpoint */}
      <ExecutiveSummary score={data.overallScore} findings={data.findings} alerts={data.alerts} />

      <div className="border-t border-gray-200 my-4" />
      <OrganizationProfile organization={organizationUI} />
      <div className="border-t border-gray-200 my-4" />
      <RiskAnalysis data={riskUI} />
      <div className="border-t border-gray-200 my-4" />
      <Roadmap roadmap={roadmapUI} />

      {/* Report History — preserved from our branch (investigate.md: Missing Report History) */}
      <div className="border-t border-gray-200 my-4" />
      <section className="bg-white rounded-xl shadow p-8 space-y-6">
        <h2 className="text-lg font-semibold text-purple-600 uppercase">REPORT HISTORY</h2>
        {!historyData || historyData.length === 0 ? (
          <p className="text-gray-500">No previous reports found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
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
                            window.open(h.url);
                          }
                        }}
                        className="text-purple-600 hover:underline"
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
    </div>
  );
}
