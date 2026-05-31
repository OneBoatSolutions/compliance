"use client";

import { useState } from "react";
import DashboardHeader from "./dashboard-header";
import DashboardStats from "./dashboard-stats";
import FrameworkStatusTable from "./framework-status-table";
import UserStatusChart from "./user-status-charts";
import RecentActivity from "./recent-activity";
import SystemHealth from "./system-health";
import QuickActions from "./quick-actions";
import DashboardCalendar from "./dashboard-calendar";

interface DashboardClientProps {
  stats: {
    totalUsers: number;
    publishedFrameworks: number;
    draftFrameworks: number;
    totalAssessments: number;
  };
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <section className="relative min-h-screen space-y-6">
      <DashboardHeader />

      {/* MAIN DASHBOARD GRID */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* LEFT CONTENT */}
        <div className="space-y-6 lg:col-span-3">
          <DashboardStats {...stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity selectedDate={selectedDate} />

            <UserStatusChart />
          </div>

          <FrameworkStatusTable selectedDate={selectedDate} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="relative z-10 space-y-6">
          <DashboardCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <QuickActions />

          <SystemHealth />
        </div>
      </div>
    </section>
  );
}
