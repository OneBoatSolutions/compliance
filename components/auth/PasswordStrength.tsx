/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable curly */
"use client";

interface Props {
  strength: "weak" | "medium" | "strong";
}

export default function PasswordStrength({ strength }: Props) {
  // Determine styles based on strength
  const getColor = () => {
    if (strength === "weak") {
      return "bg-red-500";
    }
    if (strength === "medium") {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  const getWidth = () => {
    if (strength === "weak") {
      return "w-1/3";
    }
    if (strength === "medium") {
      return "w-2/3";
    }
    return "w-full";
  };

  const getLabel = () => {
    if (strength === "weak") {
      return "Weak password";
    }
    if (strength === "medium") {
      return "Medium strength";
    }
    return "Strong password";
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
        <div className={`h-full ${getWidth()} ${getColor()} transition-all duration-300`} />
      </div>

      {/* Text Label */}
      <p className="text-xs text-muted-foreground">{getLabel()}</p>
    </div>
  );
}
