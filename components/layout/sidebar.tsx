/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ComponentType, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LifeBuoy, ShieldCheck } from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
}

interface SidebarProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  isMobile?: boolean;
}

export default function Sidebar({
  items = [],
  collapsed = false,
  setCollapsed,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      } ${isMobile ? "flex w-60" : "hidden md:flex"} bg-gray-50`}
    >
      {/*  TOP */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {/*  LOGO ONLY ON MOBILE */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-semibold">Cipherion</span>
          </div>
        )}

        {/* Collapse button only desktop */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed?.(!collapsed)}
            className="text-gray-600 hover:text-primary transition"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        )}
      </div>

      {/*  NAV */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "text-primary font-semibold scale-105 underline underline-offset-4"
                  : "text-gray-600 hover:text-primary hover:font-semibold hover:scale-105 hover:underline underline-offset-4"
              } ${collapsed && !isMobile && "justify-center"}`}
            >
              {Icon && <Icon className="w-5 h-5" />}

              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/*  SUPPORT CARD */}
      {!collapsed && (
        <div className="p-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <LifeBuoy className="w-4 h-4 text-primary" />
              <span className="font-medium text-gray-800">Need help?</span>
            </div>

            <p className="text-gray-600 text-xs mb-3">
              Reach out to support or check documentation.
            </p>

            <button className="w-full text-sm bg-primary text-white rounded-md py-1.5 hover:bg-primary-dark transition">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
