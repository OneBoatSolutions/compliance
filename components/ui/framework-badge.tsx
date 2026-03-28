import type { CSSProperties, HTMLAttributes } from "react";
import { BadgeCheck, CreditCard, HeartPulse, ShieldCheck } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const defaultDashboardPurple = "#6d18ff";

function hexToRgb(hexColor: string) {
  const normalized = hexColor.trim().replace("#", "");
  const sixDigit =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(sixDigit)) {
    return null;
  }

  const asNumber = Number.parseInt(sixDigit, 16);
  return {
    r: (asNumber >> 16) & 255,
    g: (asNumber >> 8) & 255,
    b: asNumber & 255,
  };
}

function toRgba(hexColor: string, alpha: number, fallback: string) {
  const rgb = hexToRgb(hexColor);

  if (!rgb) {
    return fallback;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export type FrameworkVariant = "SOC2" | "ISO27001" | "HIPAA" | "PCI-DSS";

const frameworkBadgeVariants = cva(
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-full border font-semibold whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "px-2.5 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

const frameworkMeta: Record<
  FrameworkVariant,
  {
    label: string;
    icon: typeof ShieldCheck;
    color: string;
  }
> = {
  SOC2: {
    label: "SOC2",
    icon: ShieldCheck,
    color: defaultDashboardPurple,
  },
  ISO27001: {
    label: "ISO27001",
    icon: BadgeCheck,
    color: "#2563eb",
  },
  HIPAA: {
    label: "HIPAA",
    icon: HeartPulse,
    color: "#059669",
  },
  "PCI-DSS": {
    label: "PCI-DSS",
    icon: CreditCard,
    color: "#d97706",
  },
};

export interface FrameworkBadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof frameworkBadgeVariants> {
  framework: FrameworkVariant;
  dashboardPurple?: string;
  withIcon?: boolean;
}

export function FrameworkBadge({
  framework,
  dashboardPurple = defaultDashboardPurple,
  withIcon = true,
  size,
  className,
  ...props
}: FrameworkBadgeProps) {
  const selected = frameworkMeta[framework];
  const tone = framework === "SOC2" ? dashboardPurple : selected.color;
  const Icon = selected.icon;

  const style = {
    color: tone,
    borderColor: toRgba(tone, 0.28, "rgba(109, 24, 255, 0.28)"),
    backgroundColor: toRgba(tone, 0.12, "rgba(109, 24, 255, 0.12)"),
  } as CSSProperties;

  return (
    <span
      data-slot="framework-badge"
      data-framework={framework}
      className={cn(frameworkBadgeVariants({ size }), className)}
      style={style}
      {...props}
    >
      {withIcon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {selected.label}
    </span>
  );
}

export { frameworkBadgeVariants };
