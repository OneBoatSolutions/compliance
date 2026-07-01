"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";

interface FooterNavProps {
  onSave: (type: "draft" | "final") => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isSaving?: boolean;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function FooterNav({
  onSave,
  onPrevious,
  onNext,
  isSaving = false,
  hasPrevious = true,
  hasNext = true,
}: FooterNavProps) {
  return (
    <div className="bg-background border-t px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <Button
        aria-label="Go to previous control"
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="flex items-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition"
      >
        <ArrowLeft size={16} />
        Previous Control
      </Button>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          aria-label="Save draft"
          variant="outline"
          onClick={() => onSave("draft")}
          disabled={isSaving}
          className="flex items-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition"
        >
          <Folder size={16} />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>

        <Button
          aria-label="Save and move to next control"
          onClick={onNext}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white hover:opacity-90 transition"
        >
          {isSaving
            ? "Saving..."
            : hasNext
              ? "Save & Next Control →"
              : "Save & Return to Checklist"}
        </Button>
      </div>
    </div>
  );
}
