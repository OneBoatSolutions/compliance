"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface TrendItem {
  day: string;
  [key: string]: string | number;
}

interface TrendLineProps {
  data: TrendItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: NameType; value?: ValueType; color?: string }>;
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <div className="font-bold mb-1.5 text-muted-foreground">{label}</div>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: e.color ?? "#000" }} />
          <span className="text-muted-foreground">{e.name}:</span>
          <span className="font-bold text-foreground">{e.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function TrendLine({ data }: TrendLineProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <ReferenceArea y1={0} y2={60} fill="#ef4444" fillOpacity={0.05} />
        <ReferenceArea y1={60} y2={80} fill="#f59e0b" fillOpacity={0.05} />
        <ReferenceArea y1={80} y2={100} fill="#22c55e" fillOpacity={0.05} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
        {data.length > 0 &&
          Object.keys(data[0])
            .filter((k) => k !== "day")
            .map((key, idx) => (
              <Line
                key={key}
                name={key}
                dataKey={key}
                stroke={["#7c3aed", "#14b8a6", "#3b82f6", "#6366f1", "#f59e0b", "#ef4444"][idx % 6]}
                strokeWidth={idx === 0 ? 3 : 2}
                dot={idx === 0 ? { r: 3, strokeWidth: 2 } : false}
                strokeDasharray={idx === 0 ? undefined : "4 2"}
              />
            ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
