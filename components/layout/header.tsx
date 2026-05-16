/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import { HelpCircle, Bell, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";

interface HeaderItem {
  label: string;
  href: string;
}

interface HeaderProps {
  items?: HeaderItem[];
}

export default function Header({ items = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  };

  // Remove Settings from header
  const headerItems = items.filter((item) => item.label !== "Settings");

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

          <span className="font-semibold text-black">Cipherion</span>
        </div>
      </div>

      {/*  CENTER NAV */}
      <nav className="hidden md:flex items-center gap-8">
        {headerItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm transition-all duration-200 ${
                isActive
                  ? "text-primary font-semibold scale-105 underline underline-offset-4"
                  : "text-gray-600 hover:text-primary hover:font-semibold hover:scale-105 hover:underline underline-offset-4"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/*  RIGHT */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLogout}
          className="hidden md:inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-primary hover:text-primary"
        >
          Logout
        </button>

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
              <span className="text-xs font-medium">{initial}</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
