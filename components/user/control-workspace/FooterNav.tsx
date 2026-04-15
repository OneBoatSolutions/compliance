"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";

export default function FooterNav({ onSave }: any) {
  return (
<div className=" bg-background border-t px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* 🔙 LEFT BUTTON */}
      <Button
        variant="outline"
        className="flex items-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition"
      >
        <ArrowLeft size={16} />
        Previous Control
      </Button>

      {/* 👉 RIGHT BUTTONS */}
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        {/* 📁 Save Draft */}
        <Button
          variant="outline"
          onClick={() => onSave("draft")}
          className="flex items-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition"
        >
          <Folder size={16} />
          Save Draft
        </Button>

        {/* 🚀 Save & Next */}
        <Button
          onClick={() => onSave("final")}
          className="flex items-center gap-2 bg-primary text-white hover:opacity-90 transition"
        >
          Save & Next Control →
        </Button>
      </div>
    </div>
  );
}
