import ActiveDashboard from "./components/active-dashboard";
import EmptyDashboard from "./components/empty-dashboard";

export default function DashboardPage() {
  // TODO: Replace with actual data fetch when assessments API is ready
  const hasAssessments = false;

  return hasAssessments ? <ActiveDashboard /> : <EmptyDashboard />;
}
