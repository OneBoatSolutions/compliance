"use client";

import { PieChart, Pie, Cell } from "recharts";

interface DonutItem {
  name: string;
  value: number;
  color: string;
}

interface ComplianceDonutProps {
  data: DonutItem[];
  totalControls: number;
  onCellClick: (name: string) => void;
}

export default function ComplianceDonut({
  data,
  totalControls,
  onCellClick,
}: ComplianceDonutProps) {
  return (
    <PieChart width={180} height={150} style={{ outline: "none" }}>
      <Pie
        data={data}
        cx={90}
        cy={75}
        innerRadius={45}
        outerRadius={65}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        paddingAngle={3}
        minAngle={4}
        labelLine={false}
        isAnimationActive={false}
        stroke="none"
        label={({ cx: lx, cy: ly }) => (
          <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central">
            <tspan x={lx} dy="-5" fontSize={24} fontWeight={900}>
              {totalControls}
            </tspan>
            <tspan x={lx} dy="18" fontSize={11} fill="#6b7280">
              Total
            </tspan>
          </text>
        )}
        onClick={(clickedData: { name?: string }) => {
          if (clickedData && clickedData.name) {
            onCellClick(clickedData.name);
          }
        }}
        style={{ cursor: "pointer" }}
      >
        {data.map((d, i) => (
          <Cell key={i} fill={d.color} stroke="none" strokeWidth={0} />
        ))}
      </Pie>
    </PieChart>
  );
}
