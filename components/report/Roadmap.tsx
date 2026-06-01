"use client";
import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
interface Props {
  appName: string;
  roadmap: {
    summary: {
      total: number;
      completed: number;
      inProgress: number;
      overdue: number;
    };
    items: {
      id: string;
      title: string;
      owner: string;
      dueDate: string;
      status: "COMPLETED" | "IN_PROGRESS" | "OVERDUE";
      priority: "HIGH" | "MED" | "LOW";
    }[];
  };
}
export function RoadmapSkeleton() {
  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-10">
      {/* Title */}
      <SkeletonBlock className="h-6 w-64" />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((unusedItem, i) => (
          <div key={i} className="p-4 rounded-lg border bg-gray-50 space-y-3">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-8 w-14" />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative border-l border-gray-200 pl-6 space-y-8">
        {Array.from({ length: 5 }).map((unusedItem, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div className="absolute -left-5 top-2">
              <SkeletonBlock className="h-5 w-5 rounded-full" />
            </div>

            {/* Card */}
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <SkeletonBlock className="h-5 w-56" />
                <SkeletonBlock className="h-6 w-24 rounded-full" />
              </div>

              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-4 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Roadmap({ roadmap, appName }: Props) {
  const summary = roadmap?.summary ?? {
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  };

  const items = roadmap?.items ?? [];

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") {
      return "bg-green-100 text-green-600";
    }
    if (status === "IN_PROGRESS") {
      return "bg-yellow-100 text-yellow-600";
    }
    return "bg-red-100 text-red-600";
  };

  return (
    <section
      className="
    bg-white
    rounded-xl
    shadow
    p-8
    space-y-6
    border-t-2
    border-primary
  "
    >
      {" "}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {appName}
        </p>

        <p className="mt-1 text-sm text-slate-500">Compliance Readiness Report • Section 06</p>
      </div>
      {/* 🔹 Title */}
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-wide uppercase">
          Remediation Roadmap
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Prioritized actions, ownership, and implementation progress to improve compliance
          readiness
        </p>
      </div>
      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Actions */}
        <div
          className="
    rounded-2xl
    p-6

    bg-gradient-to-br
    from-slate-50
    via-white
    to-slate-100

    border border-slate-200

    shadow-[0_10px_24px_rgba(15,23,42,0.08)]
  "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Actions</p>

          <p className="mt-3 text-4xl font-bold text-slate-900">{summary.total}</p>
        </div>

        {/* Completed */}
        <div
          className="
    rounded-2xl
    p-6

    bg-gradient-to-br
    from-green-50
    via-white
    to-green-100

    border border-green-200

    shadow-[0_10px_24px_rgba(34,197,94,0.10)]
  "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-green-600">Completed</p>

          <p className="mt-3 text-4xl font-bold text-green-700">{summary.completed}</p>
        </div>

        {/* In Progress */}
        <div
          className="
    rounded-2xl
    p-6

    bg-gradient-to-br
    from-yellow-50
    via-white
    to-yellow-100

    border border-yellow-200

    shadow-[0_10px_24px_rgba(234,179,8,0.10)]
  "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-600">In Progress</p>

          <p className="mt-3 text-4xl font-bold text-yellow-700">{summary.inProgress}</p>
        </div>

        {/* Overdue */}
        <div
          className="
    rounded-2xl
    p-6

    bg-gradient-to-br
    from-red-50
    via-white
    to-red-100

    border border-red-200

    shadow-[0_10px_24px_rgba(239,68,68,0.10)]
  "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-red-600">Overdue</p>

          <p className="mt-3 text-4xl font-bold text-red-700">{summary.overdue}</p>
        </div>
      </div>
      {/* 🔹 Timeline */}
      <div className="relative border-l border-gray-200 pl-6 space-y-6">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">No roadmap items available</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <div className="absolute -left-5 top-2">
                {item.status === "COMPLETED" && <CheckCircle className="text-green-500 w-5 h-5" />}
                {item.status === "IN_PROGRESS" && <Clock className="text-yellow-500 w-5 h-5" />}
                {item.status === "OVERDUE" && <AlertTriangle className="text-red-500 w-5 h-5" />}
              </div>

              {/* Card */}
              <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">{item.title}</h4>

                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                    {item.status?.replaceAll("_", " ") ?? "UNKNOWN"}
                  </span>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  <p>Owner: {item.owner}</p>
                  <p>Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
