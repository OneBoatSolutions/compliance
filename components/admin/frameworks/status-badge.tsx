import { FrameworkStatus } from "@prisma/client";

interface Props {
  status: FrameworkStatus;
}

const styles: Record<FrameworkStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-700",

  PUBLISHED: "bg-green-100 text-green-700",

  ARCHIVED: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: Props) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
