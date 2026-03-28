import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { BarChart3 } from "lucide-react";

import { cn } from "@/lib/utils";

const defaultDashboardPurple = "#6d18ff";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export interface StackedMiniBarSegment {
  label: string;
  value: number;
  color?: string;
  icon?: LucideIcon;
}

export interface StackedMiniBarProps {
  segments: StackedMiniBarSegment[];
  dashboardPurple?: string;
  height?: number;
  showLegend?: boolean;
  rounded?: boolean;
  className?: string;
  barClassName?: string;
}

export function StackedMiniBar({
  segments,
  dashboardPurple = defaultDashboardPurple,
  height = 10,
  showLegend = true,
  rounded = true,
  className,
  barClassName,
}: StackedMiniBarProps) {
  const fallbackColors = [dashboardPurple, "#2563eb", "#f59e0b", "#ef4444", "#10b981"];

  const normalized = segments.map((segment, index) => ({
    ...segment,
    safeValue: Math.max(segment.value, 0),
    resolvedColor: segment.color ?? fallbackColors[index % fallbackColors.length],
  }));

  const total = normalized.reduce((sum, item) => sum + item.safeValue, 0);

  return (
    <section className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full overflow-hidden bg-muted",
          rounded ? "rounded-full" : "rounded-md",
          barClassName,
        )}
        style={{ height }}
        role="img"
        aria-label="Assessment gaps stacked distribution"
      >
        {normalized.map((segment, index) => {
          const widthPercent = total > 0 ? clamp((segment.safeValue / total) * 100, 0, 100) : 0;

          return (
            <div
              key={`${segment.label}-${index}`}
              className="h-full transition-[width] duration-500"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: segment.resolvedColor,
              }}
              title={`${segment.label}: ${segment.safeValue}`}
            />
          );
        })}
      </div>

      {showLegend ? (
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Gap segment legend">
          {normalized.map((segment, index) => {
            const Icon = segment.icon ?? BarChart3;
            const percent = total > 0 ? Math.round((segment.safeValue / total) * 100) : 0;

            return (
              <li
                key={`${segment.label}-legend-${index}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
              >
                <Icon
                  className="size-3.5 shrink-0"
                  style={{ color: segment.resolvedColor } as CSSProperties}
                  aria-hidden="true"
                />
                <span className="truncate">
                  {segment.label} ({percent}%)
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
