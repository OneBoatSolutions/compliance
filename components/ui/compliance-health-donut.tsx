import type { CSSProperties } from "react";
import { Activity, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const defaultDashboardPurple = "#6d18ff";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export interface ComplianceHealthDonutProps {
  value: number;
  label?: string;
  subtitle?: string;
  size?: number;
  strokeWidth?: number;
  dashboardPurple?: string;
  healthyColor?: string;
  remainingColor?: string;
  className?: string;
}

export function ComplianceHealthDonut({
  value,
  label = "Compliance Health",
  subtitle = "Live readiness signal",
  size = 176,
  strokeWidth = 16,
  dashboardPurple = defaultDashboardPurple,
  healthyColor,
  remainingColor = "var(--border)",
  className,
}: ComplianceHealthDonutProps) {
  const percent = clamp(value, 0, 100);
  const roundedPercent = Math.round(percent);
  const activeColor = healthyColor ?? dashboardPurple;

  const radius = Math.max((size - strokeWidth) / 2, 0);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <section
      className={cn("inline-flex flex-col items-center gap-3 w-full max-w-[220px]", className)}
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="progressbar"
        aria-label={`${label}: ${roundedPercent}% healthy`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={roundedPercent}
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
            stroke={remainingColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          <ShieldCheck
            className="mb-1 size-4 sm:size-5"
            style={{ color: activeColor } as CSSProperties}
            aria-hidden="true"
          />
          <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
            {roundedPercent}%
          </p>
          <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">
            Healthy
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground">
          <Activity
            className="size-4"
            style={{ color: activeColor } as CSSProperties}
            aria-hidden="true"
          />
          {label}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
