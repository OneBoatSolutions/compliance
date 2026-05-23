"use client";
import DashboardHeader from "@/components/admin/dashboard/dashboard-header";
import DashboardStats from "@/components/admin/dashboard/dashboard-stats";
import FrameworkStatusTable from "@/components/admin/dashboard/framework-status-table";
import UserStatusChart from "@/components/admin/dashboard/user-status-charts";
import RecentActivity from "@/components/admin/dashboard/recent-activity";
import SystemHealth from "@/components/admin/dashboard/system-health";
import QuickActions from "@/components/admin/dashboard/quick-actions";
import DashboardCalendar from "@/components/admin/dashboard/dashboard-calendar";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <section
      className="
    relative
    min-h-screen
    space-y-6
    
  "
    >
      <DashboardHeader />

      {/* MAIN DASHBOARD GRID */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* LEFT CONTENT */}
        <div className="space-y-6 lg:col-span-3">
          <DashboardStats />

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity selectedDate={selectedDate} />

            <UserStatusChart />
          </div>

          <FrameworkStatusTable selectedDate={selectedDate} />
        </div>

        {/* RIGHT SIDEBAR */}
        {/* RIGHT SIDEBAR */}

        {/* CONTENT */}
        <div className="relative z-10 space-y-6">
          <DashboardCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <QuickActions />

          <SystemHealth />
        </div>
      </div>
    </section>
  );
}
