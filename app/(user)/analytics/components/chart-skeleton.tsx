"use client";

import React from "react";

export function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[150px] flex items-center justify-center bg-muted/30 animate-pulse rounded-lg border border-border/50">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground">Loading chart...</span>
      </div>
    </div>
  );
}

export default ChartSkeleton;
