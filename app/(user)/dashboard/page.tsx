"use client";
import { useEffect } from "react";
import { useAssessmentStore } from "@/stores/assessment-store";
import ActiveDashboard from "./components/active-dashboard";
import EmptyDashboard from "./components/empty-dashboard";

export default function DashboardPage() {
  const reset = useAssessmentStore((s) => s.reset);

  useEffect(() => {
    reset(); // reset AFTER navigation
  }, [reset]);
  // TODO: Replace with actual data fetch when assessments API is ready
  const hasAssessments = false;

  return hasAssessments ? <ActiveDashboard /> : <EmptyDashboard />;
}
