import type { RemediationPriority } from "@/types/remediation";

interface PriorityBadgeProps {
  level: RemediationPriority;
}

export default function PriorityBadge({ level }: PriorityBadgeProps) {
  const colors = {
    HIGH: "bg-red-50 border border-red-200 text-red-700",

    MEDIUM: "bg-yellow-50 border border-yellow-200 text-yellow-700",

    LOW: "bg-blue-50 border border-blue-200 text-blue-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        shadow-sm
        ${colors[level]}
      `}
    >
      {level}
    </span>
  );
}
