import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getAdminDashboardStats } from "@/services/admin-dashboard-service";
import DashboardClient from "@/components/admin/dashboard/dashboard-client";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stats = await getAdminDashboardStats();

  return <DashboardClient stats={stats} />;
}
