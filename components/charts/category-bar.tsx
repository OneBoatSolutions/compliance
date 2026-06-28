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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  const total = payload.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs min-w-[200px]">
      <div className="font-bold mb-2 text-foreground">{label}</div>
      <div className="space-y-1">
        {payload.map((p, i) => {
          const val = Number(p.value) || 0;
          const pct = total > 0 ? ((val / total) * 100).toFixed(0) : "0";
          return (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-muted-foreground">{p.name}:</span>
              </div>
              <span className="font-bold text-foreground">
                {val} ({pct}%)
              </span>
            </div>
          );
        })}
        <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-1.5 mt-1.5 font-bold">
          <span className="text-foreground">Total:</span>
          <span className="text-foreground">{total}</span>
        </div>
      </div>
    </div>
  );
}

interface CustomYAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const CustomYAxisTick = (props: CustomYAxisTickProps) => {
  const { x, y, payload } = props;
  const val = payload.value;
  // Truncate only extremely long category names to make sure they are written fully
  const truncated = val.length > 60 ? `${val.substring(0, 57)}...` : val;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={4}
        textAnchor="end"
        fill="#6b7280"
        fontSize={10}
        fontWeight={500}
        style={{ fontFamily: "inherit" }}
      >
        <title>{val}</title>
        {truncated}
      </text>
    </g>
  );
};

export default function CategoryBar({ data }: CategoryBarProps) {
  // Sort data by nonCompliant descending, then partial descending, so that the top areas requiring attention are at the top
  const sortedData = [...data].sort((a, b) => {
    if (b.nonCompliant !== a.nonCompliant) {
      return b.nonCompliant - a.nonCompliant;
    }
    if (b.partial !== a.partial) {
      return b.partial - a.partial;
    }
    return a.compliant - b.compliant;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={360}
          tick={<CustomYAxisTick />}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.04)" }} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
        />
        <Bar dataKey="compliant" name="Compliant" fill="#22c55e" stackId="a" barSize={16} />
        <Bar dataKey="partial" name="Partial" fill="#f59e0b" stackId="a" barSize={16} />
        <Bar dataKey="nonCompliant" name="Non-Compliant" fill="#ef4444" stackId="a" barSize={16} />
        <Bar
          dataKey="notApplicable"
          name="Not Applicable"
          fill="#9ca3af"
          stackId="a"
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
