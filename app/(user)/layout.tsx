"use client";

import { useState } from "react";
import { LayoutDashboard, ClipboardList, FileText, Settings } from "lucide-react";
/* eslint-disable @typescript-eslint/no-require-imports */

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface LayoutProps {
  children: React.ReactNode;
}

const userNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Assessments",
    href: "/assessments",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AppLayout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar items={userNavItems} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-60"
        }`}
      >
        <Header items={userNavItems} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 xl:p-10 pt-16">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
