/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

interface MobileSidebarItem {
  label: string;
  href: string;
}

interface MobileSidebarProps {
  items?: MobileSidebarItem[];
}

export default function MobileSidebar({ items = [] }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-muted">
        <Menu />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-60 bg-white">
        <Sidebar items={items} isMobile />
      </SheetContent>
    </Sheet>
  );
}
