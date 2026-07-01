import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleDashed } from "lucide-react";

import { cn } from "@/lib/utils";

const defaultDashboardPurple = "#6d18ff";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export interface CircularProgressProps {
  value: number;
  label: string;
  max?: number;
  size?: number;
  strokeWidth?: number;
  dashboardPurple?: string;
  trackColor?: string;
  showPercentage?: boolean;
  centerIcon?: LucideIcon;
  className?: string;
  labelClassName?: string;
}

export function CircularProgress({
  value,
  label,
  max = 100,
  size = 120,
  strokeWidth = 10,
  dashboardPurple = defaultDashboardPurple,
  trackColor = "var(--border)",
  showPercentage = true,
  centerIcon,
  className,
  labelClassName,
}: CircularProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const progress = clamp((value / safeMax) * 100, 0, 100);
  const roundedProgress = Math.round(progress);

  const radius = Math.max((size - strokeWidth) / 2, 0);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const CenterIcon = centerIcon ?? CircleDashed;

  return (
    <div className={cn("inline-flex flex-col items-center gap-3 w-full", className)}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        role="progressbar"
        aria-label={`${label}: ${roundedProgress}%`}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamp(value, 0, safeMax)}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={dashboardPurple}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <CenterIcon
            className="mb-1 size-4 sm:size-5"
            style={{ color: dashboardPurple } as CSSProperties}
            aria-hidden="true"
          />
          {showPercentage ? (
            <span className="text-base sm:text-lg font-bold text-foreground">
              {roundedProgress}%
            </span>
          ) : null}
        </div>
      </div>

      <span
        className={cn(
          "text-sm sm:text-base font-medium text-center text-foreground",
          labelClassName,
        )}
      >
        {label}
      </span>
    </div>
  );
}
