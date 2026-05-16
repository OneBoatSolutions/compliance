"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ExecutiveSummary, { ExecutiveSummarySkeleton } from "@/components/report/ExecutiveSummary";

import Cover from "@/components/report/Cover";

import OrganizationProfile from "@/components/report/OrganizationProfile";
import RiskAnalysis from "@/components/report/RiskAnalysis";
import Roadmap from "@/components/report/Roadmap";

import { generateReport, downloadReport, fetchReport } from "@/lib/report-api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
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
  const { id } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: reportData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["report", id],
    queryFn: () => fetchReport(id as string),
    enabled: !!id,
    retry: 1,
  });

  const { data: historyData } = useQuery({
    queryKey: ["report-history", id],
    queryFn: () => apiClient.get<ReportHistoryItem[]>(`/api/reports/${id}/history`),
    enabled: !!id,
  });

  // 🔹 Handlers
  const handleGenerate = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating report...");

    try {
      await generateReport(id as string);
      toast.success("Report generated successfully", { id: toastId });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

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

  if (isError || !reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-gray-500">Failed to load report data.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-purple-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="report-print-root space-y-10">
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
        appName={reportData.organization?.name || "Cipherion Report"}
        frameworks={
          reportData.organization?.frameworkScores?.map(
            (f: { name: string; score: number }) => f.name,
          ) || []
        }
        generatedAt={new Date().toISOString()}
        preparedFor={reportData.organization?.name || "Customer"}
        version="1.0"
        isGenerating={isGenerating}
        isDownloading={isDownloading}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
      />

      <ExecutiveSummary
        score={reportData.summary?.score || 0}
        findings={(reportData.summary?.keyFindings || []).map((text: string) => ({
          type: "info" as const,
          text,
        }))}
        alerts={[]}
      />

      <div className="border-t border-gray-200 my-4" />
      <OrganizationProfile
        organization={{
          name: reportData.organization?.name || "",
          systems: "All Systems",
          reportId: reportData.id,
          dataInventory: [],
          frameworks: (reportData.organization?.frameworkScores || []).map(
            (f: { name: string; score: number }) => ({
              name: f.name,
              score: f.score,
              controls: 10,
              minorGaps: 0,
              highRisk: 0,
            }),
          ),
        }}
      />

      <div className="border-t border-gray-200 my-4" />
      <RiskAnalysis
        data={{
          total: reportData.risks?.total || 0,
          distribution: {
            critical: 0,
            high: reportData.risks?.high || 0,
            medium: reportData.risks?.medium || 0,
            low: reportData.risks?.low || 0,
          },
          heatmap: [],
          remediation: (reportData.remediation?.items || []).map(
            (item: { title: string; priority: string; effort: string }, i: number) => ({
              id: `R-${i + 1}`,
              action: item.title,
              owner: "System",
              dueDate: new Date().toISOString().split("T")[0],
              progress: 0,
            }),
          ),
        }}
      />

      <div className="border-t border-gray-200 my-4" />
      <Roadmap
        roadmap={{
          summary: {
            total: reportData.remediation?.items?.length || 0,
            completed: 0,
            inProgress: reportData.remediation?.items?.length || 0,
            overdue: 0,
          },
          items: (reportData.remediation?.items || []).map(
            (item: { title: string; priority: string; effort: string }, i: number) => ({
              id: `R-${i + 1}`,
              title: item.title,
              owner: "System",
              dueDate: new Date().toISOString().split("T")[0],
              status: "IN_PROGRESS" as const,
              priority: item.priority as "HIGH" | "MED" | "LOW",
            }),
          ),
        }}
      />

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
