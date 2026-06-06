"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ExecutiveSummary, { ExecutiveSummarySkeleton } from "@/components/report/ExecutiveSummary";

import Cover from "@/components/report/Cover";

import OrganizationProfile from "@/components/report/OrganizationProfile";
import RiskAnalysis from "@/components/report/RiskAnalysis";
import Roadmap from "@/components/report/Roadmap";

import { fetchReportView } from "@/lib/report-api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();

  // Primary data: use the rich /view endpoint
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reportView", id],
    queryFn: () => fetchReportView(id as string),
    enabled: !!id,
    retry: 1,
  });

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
      <Cover
        appName={data.organization.productName}
        frameworks={data.frameworkScores.map((f) => f.frameworkCode)}
        generatedAt={data.generatedAt}
        preparedFor={data.organization.productName}
        version="1.0"
      />

      {/* Executive Summary — uses real findings/alerts from /view endpoint */}
      <ExecutiveSummary score={data.overallScore} findings={data.findings} alerts={data.alerts} />

      <div className="border-t border-gray-200 my-4" />
      <OrganizationProfile organization={organizationUI} />
      <div className="border-t border-gray-200 my-4" />
      <RiskAnalysis data={riskUI} />
      <div className="border-t border-gray-200 my-4" />
      <Roadmap roadmap={roadmapUI} />
    </div>
  );
}
