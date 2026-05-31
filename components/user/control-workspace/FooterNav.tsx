"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";

interface FooterNavProps {
  onSave: (type: "draft" | "final") => void;
  isSaving?: boolean;
}

export default function FooterNav({ onSave, isSaving = false }: FooterNavProps) {
  return (
    <div className="bg-background border-t px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <Button
        variant="outline"
        className="flex items-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition"
      >
        <ArrowLeft size={16} />
        Previous Control
      </Button>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => onSave("draft")}
          disabled={isSaving}
          className="flex items-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition"
        >
          <Folder size={16} />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>

        <Button
          onClick={() => onSave("final")}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white hover:opacity-90 transition"
        >
          {isSaving ? "Saving..." : "Save & Next Control ->"}
        </Button>
      </div>
    </div>
  );
}
