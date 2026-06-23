"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface ControlsStatusChartProps {
  donutData: Array<{ name: string; value: number; color: string }>;
  totalControls: number;
  setFilters: (filters: { impact: string; category: string }) => void;
}

export function ControlsStatusChart({
  donutData,
  totalControls,
  setFilters,
}: ControlsStatusChartProps) {
  return (
    <div className="flex justify-center">
      <PieChart width={180} height={150} style={{ outline: "none" }}>
        <Pie
          data={donutData}
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
          onClick={(data: { name?: string }) =>
            setFilters({ impact: "", category: data.name ?? "" })
          }
          style={{ cursor: "pointer" }}
        >
          {donutData.map((d, i) => (
            <Cell key={i} fill={d.color} stroke="none" strokeWidth={0} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

interface FrameworkPerformanceChartProps {
  frameworkBarData: Array<{ framework: string; score: number }>;
}

export function FrameworkPerformanceChart({ frameworkBarData }: FrameworkPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={frameworkBarData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
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

interface ComplianceTrendChartProps {
  trendData: Array<{ day: string; [key: string]: string | number }>;
}

export function ComplianceTrendChart({ trendData }: ComplianceTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
        {trendData.length > 0 &&
          Object.keys(trendData[0])
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

interface TopAreasChartProps {
  categoryData: Array<{
    name: string;
    compliant: number;
    partial: number;
    nonCompliant: number;
    notApplicable: number;
  }>;
}

export function TopAreasChart({ categoryData }: TopAreasChartProps) {
  return (
    <div className="flex justify-center mt-6 h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categoryData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
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
    </div>
  );
}
