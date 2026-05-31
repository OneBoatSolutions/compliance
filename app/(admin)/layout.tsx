"use client";
// app/(admin)/layout.tsx
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

//  Icons
import { Layers, Users, LayoutDashboard } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

//  ADMIN NAV ITEMS
const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Frameworks",
    href: "/frameworks",
    icon: Layers,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminLayout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/*  Sidebar */}
      <Sidebar items={adminNavItems} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/*  Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-60"
        }`}
      >
        <Header items={adminNavItems} />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 xl:p-10 pt-16">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
