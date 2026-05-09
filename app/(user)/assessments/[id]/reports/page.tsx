"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ExecutiveSummary, { ExecutiveSummarySkeleton } from "@/components/report/ExecutiveSummary";

import Cover from "@/components/report/Cover";

import OrganizationProfile from "@/components/report/OrganizationProfile";
import RiskAnalysis from "@/components/report/RiskAnalysis";

import { mockReportData } from "@/lib/report-mockData";
import Roadmap from "@/components/report/Roadmap";

import { generateReport, downloadReport } from "@/lib/report-api";
import { toast } from "sonner";

export default function ReportPage() {
  const { id } = useParams();
  const isLoading = false; // later from useQuery
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 🔹 Handlers
  const handleGenerate = async () => {
    const toastId = toast.loading("Generating report...");

    try {
      await generateReport(id as string);
      toast.success("Report generated successfully", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report", { id: toastId });
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

  const data = mockReportData;

  // 🔹 MOCK DATA (temporary)

  return (
    <div className="space-y-10">
      {/*  Cover Section */}
      <Cover
        appName={data.appName}
        frameworks={data.frameworks}
        generatedAt={data.generatedAt}
        preparedFor={data.preparedFor}
        version={data.version}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
      />

      {/*  Next sections will go here */}

      {isLoading ? (
        <ExecutiveSummarySkeleton />
      ) : (
        <ExecutiveSummary
          score={data.summary.score}
          findings={data.summary.findings}
          alerts={data.summary.alerts}
        />
      )}

      <div className="border-t border-gray-200 my-4" />
      <OrganizationProfile organization={data.organization} />
      <div className="border-t border-gray-200 my-4" />
      <RiskAnalysis data={data.riskAnalysis} />
      <div className="border-t border-gray-200 my-4" />
      <Roadmap roadmap={data.roadmap!} />
    </div>
  );
}
