"use client";

import { usePathname } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import { HelpCircle, Bell, ShieldCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Header({ items = [] }: any) {
  const pathname = usePathname();

  // Remove Settings from header
  const headerItems = items.filter(
    (item: any) => item.label !== "Settings"
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200">

      {/*  LEFT */}
      <div className="flex items-center gap-6">
        
        <MobileSidebar items={items} />

        {/* Logo (desktop only) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <span className="font-semibold text-base">
            Cipherion
          </span>
        </div>
      </div>

      {/*  CENTER NAV */}
      <nav className="hidden md:flex items-center gap-8">
        {headerItems.map((item: any) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm transition-all duration-200 ${
                isActive
                  ? "text-primary font-semibold scale-105 underline underline-offset-4"
                  : "text-gray-600 hover:text-primary hover:font-semibold hover:scale-105 hover:underline underline-offset-4"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/*  RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* Help */}
        <button className="text-gray-600 hover:text-primary hover:scale-110 transition-all duration-200">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-primary hover:scale-110 transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-8 h-8 rounded-full bg-primary cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-200">
              <span className="text-xs font-medium">U</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}