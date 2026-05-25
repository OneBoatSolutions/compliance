interface StatusBadgeProps {
  label: string;
  variant?: "success" | "danger" | "purple";
}

export default function StatusBadge({ label, variant = "success" }: StatusBadgeProps) {
  const styles = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    purple: "bg-violet-100 text-violet-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}>{label}</span>
  );
}
