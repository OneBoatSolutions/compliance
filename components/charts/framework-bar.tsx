"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface FrameworkBarItem {
  framework: string;
  score: number;
}

interface FrameworkBarProps {
  data: FrameworkBarItem[];
}

export default function FrameworkBar({ data }: FrameworkBarProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis dataKey="framework" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />

        <Tooltip />

        <Legend />

        <ReferenceLine
          y={85}
          stroke="#22c55e"
          strokeDasharray="4 4"
          label={{
            value: "Target (85%)",
            position: "top",
            fill: "#22c55e",
            fontSize: 11,
          }}
        />

        <Bar dataKey="score" name="Score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
