"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useAssessmentStore } from "@/stores/assessment-store";

const ActiveDashboard = dynamic(() => import("./components/active-dashboard"), {
  loading: () => <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>,
});

const EmptyDashboard = dynamic(() => import("./components/empty-dashboard"), {
  loading: () => <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>,
});

export default function DashboardPage() {
  const reset = useAssessmentStore((s) => s.reset);

  useEffect(() => {
    reset(); // reset AFTER navigation
  }, [reset]);
  // TODO: Replace with actual data fetch when assessments API is ready
  const hasAssessments = false;

  return hasAssessments ? <ActiveDashboard /> : <EmptyDashboard />;
}
