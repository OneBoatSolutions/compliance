"use client";

interface Props {
  value: number;
}

export default function ConfidenceDonut({ value }: Props) {
  const radius = 44;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value > 89) {
      return "#22c55e";
    } // green
    if (value >= 75) {
      return "#3b82f6";
    } // blue
    if (value >= 60) {
      return "#facc15";
    } // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        {/* Background circle */}
        <circle
          stroke="#f3f4f6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease",
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Center text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-xs fill-gray-700 font-semibold"
        >
          {value}%
        </text>
      </svg>
    </div>
  );
}
