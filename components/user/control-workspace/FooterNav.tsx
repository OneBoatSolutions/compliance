"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";

interface FooterNavProps {
  onSave: (type: "draft" | "final") => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isSaving?: boolean;
  isLoading?: boolean;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function FooterNav({
  onSave,
  onPrevious,
  onNext,
  isSaving = false,
  isLoading = false,
  hasPrevious = true,
  hasNext = true,
}: FooterNavProps) {
  return (
    <div className="bg-background border-t px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <Button
        aria-label="Go to previous control"
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPrevious || isLoading}
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
          disabled={isSaving || isLoading}
          className="relative flex items-center justify-center gap-2 border-muted text-muted-foreground hover:bg-muted/50 transition min-w-[130px]"
        >
          {isSaving && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-muted-foreground border-t-transparent" />
              <span>Saving...</span>
            </div>
          )}
          <span
            className={`flex items-center gap-2 transition-opacity duration-200 ${isSaving ? "opacity-0" : ""}`}
          >
            <Folder size={16} />
            Save Draft
          </span>
        </Button>

        <Button
          aria-label="Save and move to next control"
          onClick={onNext}
          disabled={isSaving || isLoading}
          className="relative flex items-center justify-center gap-2 bg-primary text-white hover:opacity-90 transition min-w-[240px]"
        >
          {(isSaving || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>{isSaving ? "Saving..." : "Loading..."}</span>
            </div>
          )}
          <span
            className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${isSaving || isLoading ? "opacity-0" : ""}`}
          >
            {hasNext ? "Save & Next Control →" : "Save & Return to Checklist"}
          </span>
        </Button>
      </div>
    </div>
  );
}
