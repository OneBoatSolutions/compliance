"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CategoryItem {
  name: string;
  compliant: number;
  partial: number;
  nonCompliant: number;
  notApplicable: number;
}

interface CategoryBarProps {
  data: CategoryItem[];
}

export default function CategoryBar({ data }: CategoryBarProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="compliant"
          name="Compliant"
          fill="#22c55e"
          radius={[0, 4, 4, 0]}
          stackId="a"
        />
        <Bar dataKey="partial" name="Partial" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
        <Bar
          dataKey="nonCompliant"
          name="Non-Compliant"
          fill="#ef4444"
          radius={[0, 0, 0, 0]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
