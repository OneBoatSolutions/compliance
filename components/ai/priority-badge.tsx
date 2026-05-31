export default function PriorityBadge({ level }: { level: string }) {
  const colors = {
    HIGH: "bg-red-100 text-red-600",
    MEDIUM: "bg-yellow-100 text-yellow-600",
    LOW: "bg-green-100 text-green-600",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${colors[level as keyof typeof colors]}`}>
      {level} PRIORITY
    </span>
  );
}
