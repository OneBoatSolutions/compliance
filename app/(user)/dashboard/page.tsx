"use client";

import { useEffect, useState } from "react";
import { useAssessmentStore } from "@/stores/assessment-store";
import ActiveDashboard from "./components/active-dashboard";
import EmptyDashboard from "./components/empty-dashboard";
import type { DashboardApiData } from "@/types/dashboard";

export default function DashboardPage() {
  const reset = useAssessmentStore((s) => s.reset);
  const [dashboardData, setDashboardData] = useState<DashboardApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reset(); // reset AFTER navigation
  }, [reset]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const json = await response.json();
        // The API wraps data in { data: ... } via successResponse
        setDashboardData(json.data ?? json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6d18ff] border-t-transparent" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">Error loading dashboard</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasAssessments = (dashboardData?.totalAssessments ?? 0) > 0;

  return hasAssessments && dashboardData ? (
    <ActiveDashboard data={dashboardData} />
  ) : (
    <EmptyDashboard />
  );
}
