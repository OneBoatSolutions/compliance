"use client";

import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

import { CheckCircle } from "lucide-react";
import { DataInventoryItem } from "@/lib/report-types";

interface Props {
  organization: {
    name: string;
    systems: string;
    reportId: string;

    dataInventory: DataInventoryItem[];
    frameworks: {
      name: string;
      score: number;
      controls: number;
      minorGaps: number;
      highRisk: number;
    }[];
  };
}
export function OrganizationProfileSkeleton() {
  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-8">
      {/* Title */}
      <SkeletonBlock className="h-6 w-80" />

      {/* Basic Info */}
      <div className="grid md:grid-cols-3 gap-6 py-4">
        {Array.from({ length: 3 }).map((unusedItem, i) => (
          <div key={i}>
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-3 h-5 w-40" />
          </div>
        ))}
      </div>

      {/* Data Inventory */}
      <div>
        <SkeletonBlock className="h-5 w-52 mb-4" />

        <div className="overflow-hidden rounded-lg border">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 border-b">
            {Array.from({ length: 4 }).map((unusedField, i) => (
              <SkeletonBlock key={i} className="h-4 w-24" />
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: 5 }).map((unusedItem, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-4 rounded-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Framework Performance */}
      <div>
        <SkeletonBlock className="h-5 w-64 mb-6" />

        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((unusedItem, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-4">
              <div className="flex justify-between">
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-5 w-12" />
              </div>

              <SkeletonBlock className="h-2 w-full rounded-full" />

              <SkeletonBlock className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OrganizationProfile({ organization }: Props) {
  //  Defensive defaults
  const dataInventory = organization?.dataInventory ?? [];
  const frameworks = organization?.frameworks ?? [];

  const getRiskColor = (risk: "LOW" | "MED" | "HIGH" | string) => {
    switch (risk) {
      case "HIGH":
        return "bg-red-100 text-red-600";

      case "MED":
        return "bg-yellow-100 text-yellow-600";

      case "LOW":
        return "bg-blue-100 text-blue-600";

      default:
        return "";
    }
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
      <div className="mb-6 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {organization?.name}
        </p>

        <p className="mt-1 text-sm text-slate-500">Compliance Readiness Report • Section 02</p>
      </div>
      {/*  Title */}
      <div className="border-l-4 border-[#7C3AED] pl-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-wide uppercase">
          Organization Compliance Profile
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Organizational scope, systems, and assessment identification details
        </p>
      </div>
      {/*  Basic Info */}
      <div className="grid md:grid-cols-3 gap-6 py-6">
        {/* Organization Name */}
        <div
          className="
      rounded-2xl
      p-6

      bg-gradient-to-br
      from-purple-50
      via-white
      to-purple-100

      border border-purple-100

      shadow-[0_10px_30px_rgba(124,58,237,0.10)]
    "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Organization Name</p>

          <p className="mt-3 text-xl font-semibold text-slate-900">{organization?.name || "—"}</p>
        </div>

        {/* Systems */}
        <div
          className="
      rounded-2xl
      p-6

      bg-gradient-to-br
      from-purple-50
      via-white
      to-purple-100

      border border-purple-100

      shadow-[0_10px_30px_rgba(124,58,237,0.10)]
    "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Systems In Scope</p>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {organization?.systems || "—"}
          </p>
        </div>

        {/* Report ID */}
        <div
          className="
      rounded-2xl
      p-6

      bg-gradient-to-br
      from-purple-50
      via-white
      to-purple-100

      border border-purple-100

      shadow-[0_10px_30px_rgba(124,58,237,0.10)]
    "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Report ID</p>

          <p className="mt-3 text-lg font-bold text-slate-900 break-all">
            {organization?.reportId || "—"}
          </p>
        </div>
      </div>

      {/*  Data Inventory */}
      <div>
        <h3 className="text-md font-bold mb-3 text-gray-800">Data Inventory Scoping</h3>

        {dataInventory.length === 0 ? (
          <p className="text-sm text-gray-400">No data inventory available</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 text-gray-800 text-xs">
                <tr>
                  <th className="p-3 text-left">DATA CATEGORY</th>
                  <th className="p-3 text-left">IN SCOPE</th>
                  <th className="p-3 text-left">EXAMPLES</th>
                  <th className="p-3 text-left">RISK LEVEL</th>
                </tr>
              </thead>

              <tbody>
                {dataInventory.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{item.category}</td>

                    <td className="p-3">
                      {item.inScope ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <span className="text-gray-300">●</span>
                      )}
                    </td>

                    <td className="p-3 text-gray-600">{item.examples}</td>

                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${getRiskColor(item.risk)}`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/*  Framework Performance */}
      <div className="py-8">
        <h3 className="text-md font-bold mb-3 text-gray-800">Detailed Framework Performance</h3>

        {frameworks.length === 0 ? (
          <p className="text-sm text-gray-400">No framework data available</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {frameworks.map((fw, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{fw.name}</span>
                  <span className="text-purple-600 font-semibold">{fw.score}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="bg-purple-600 h-2 rounded" style={{ width: `${fw.score}%` }} />
                </div>

                <p className="text-xs text-gray-500">
                  {fw.controls} Controls | {fw.minorGaps} Minor Gaps | {fw.highRisk} High Risk
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
