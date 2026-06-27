"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface UserStatusPieItem {
  name: string;
  value: number;
  fill: string;
}

interface UserStatusPieProps {
  data: UserStatusPieItem[];
}

export default function UserStatusPie({ data }: UserStatusPieProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={68}
          outerRadius={95}
          paddingAngle={4}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={4}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
