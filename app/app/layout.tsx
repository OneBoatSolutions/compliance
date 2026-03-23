"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: require("lucide-react").LayoutDashboard,
    },
    {
      label: "Assessments",
      href: "/assessments",
      icon: require("lucide-react").ClipboardList,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: require("lucide-react").FileText,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: require("lucide-react").Settings,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      <Sidebar
        items={navItems}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-60"
        }`}
      >
        <Header items={navItems} />

        <main className="flex-1 overflow-auto p-4 pt-20">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}