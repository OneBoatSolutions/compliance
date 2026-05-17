"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ExecutiveSummary, { ExecutiveSummarySkeleton } from "@/components/report/ExecutiveSummary";

import Cover from "@/components/report/Cover";

import OrganizationProfile from "@/components/report/OrganizationProfile";
import RiskAnalysis from "@/components/report/RiskAnalysis";
import Roadmap from "@/components/report/Roadmap";

import { generateReport, downloadReport } from "@/lib/report-api";
import { toast } from "sonner";
import { ReportViewResponse } from "@/lib/report-types";
export async function fetchReportView(assessmentId: string): Promise<ReportViewResponse> {
  const res = await fetch(`/api/reports/${assessmentId}/view`);

  if (!res.ok) {
    throw new Error("Failed to fetch report");
  }

  return res.json();
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<ReportViewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetchReportView(id);
        setData(res);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-10">
        <ExecutiveSummarySkeleton />
      </div>
    );
  }

  if (!data) {
    return <div className="p-10 text-center text-gray-500">Report not found</div>;
  }

  // 🔹 Handlers
  const handleGenerate = async () => {
    const toastId = toast.loading("Generating report...");

    try {
      // START LOADING
      setIsGenerating(true);

      // 1. GENERATE REPORT
      await generateReport(id as string);

      // 2. GET DOWNLOAD URL
      const url = await downloadReport(id as string);

      // 3. OPEN PDF
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Report generated successfully", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to generate report", {
        id: toastId,
      });
    } finally {
      // STOP LOADING
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const toastId = toast.loading("Preparing download...");

    try {
      const url = await downloadReport(id as string);
      window.open(url);
      toast.success("Download started", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Report not available yet", { id: toastId });
    }
  };

  const organizationUI: {
    name: string;
    systems: string;
    reportId: string;
    dataInventory: {
      category: string;
      inScope: boolean;
      examples: string;
      risk: "LOW" | "MED" | "HIGH";
    }[];
    frameworks: {
      name: string;
      score: number;
      controls: number;
      minorGaps: number;
      highRisk: number;
    }[];
  } = {
    name: data.organization.productName,
    systems: data.organization.services,
    reportId: data.assessment.id,

    dataInventory: data.evidenceRows.map((e) => ({
      category: e.code,
      inScope: e.count > 0,
      examples: e.examples,

      risk:
        e.risk.toUpperCase() === "HIGH"
          ? "HIGH"
          : e.risk.toUpperCase() === "MEDIUM"
            ? "MED"
            : "LOW",
    })),

    frameworks: data.frameworkScores.map((f) => ({
      name: f.frameworkName,

      score: f.score,

      controls: 0,

      minorGaps: 0,

      highRisk: 0,
    })),
  };

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
  const roadmapUI = {
    summary: {
      total: data.controlRows.length,

      completed: data.controlRows.filter((c) => c.status === "COMPLIANT").length,

      inProgress: data.controlRows.filter(
        (c) => c.status === "PARTIALLY_COMPLIANT" || c.status === "NOT_STARTED",
      ).length,

      overdue: 0,
    },

    items: data.controlRows.map((c) => ({
      id: c.code || "",

      title: c.title || "",

      owner: c.owner || "",

      dueDate: c.targetDate || "",

      status: c.uiStatus || "IN_PROGRESS",

      priority: c.priority || "LOW",
    })),
  };

  return (
    <div className="space-y-10">
      {/*  Cover Section */}
      <Cover
        appName={data.organization.productName}
        frameworks={data.frameworkScores.map((f) => f.frameworkCode)}
        generatedAt={data.generatedAt}
        preparedFor={data.organization.productName}
        version="1.0"
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        onDownload={handleDownload}
      />

      {/*  Next sections will go here */}

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
