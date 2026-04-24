type Props = {
  score: number | null;
};

export default function ProgressSection({ score }: Props) {
  const safeScore = score ?? 60;

  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground-semibold">Overall Compliance</p>
        <p className="text-sm font-medium">
          {score !== null ? `${score}%` : "--"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${safeScore}%`,
            backgroundColor: getColor(safeScore),
          }}
        />
      </div>
    </div>
  );
}

function getColor(score: number) {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 40) return "#f59e0b"; // yellow
  return "#dc2626"; // red
}
