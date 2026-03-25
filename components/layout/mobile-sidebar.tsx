"use client";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar({ items }: any) {
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