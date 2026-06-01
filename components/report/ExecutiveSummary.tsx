"use client";
import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

import { CheckCircle, AlertTriangle, Info, BarChart3 } from "lucide-react";

import { Finding } from "@/lib/report-types";

interface Props {
  appName: string;
  score: number;
  findings: Finding[];
  alerts: {
    title: string;
    description: string;
  }[];
}

export function ExecutiveSummarySkeleton() {
  return (
    <section className="bg-white rounded-xl shadow p-6 space-y-6">
      <SkeletonBlock className="h-6 w-52" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Score */}
        <div className="bg-purple-50 rounded-xl p-6 flex flex-col items-center">
          <SkeletonBlock className="h-4 w-32" />

          <SkeletonBlock className="mt-6 h-24 w-24 rounded-full" />

          <SkeletonBlock className="mt-4 h-6 w-32 rounded-full" />
        </div>

        {/* Findings */}
        <div>
          <SkeletonBlock className="h-5 w-32" />

          <div className="mt-5 space-y-4">
            {Array.from({ length: 4 }).map((unusedItem, i) => (
              <div key={i} className="flex gap-3">
                <SkeletonBlock className="h-4 w-4 rounded-full" />
                <SkeletonBlock className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((unusedItem, i) => (
          <div key={i} className="border-l-4 border-red-200 bg-red-50 p-4 rounded">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-3 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-[80%]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ExecutiveSummary({ appName, score, findings, alerts }: Props) {
  findings = findings || [];
  alerts = alerts || [];
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={16} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case "info":
        return <Info className="text-blue-500" size={16} />;
      case "insight":
        return <BarChart3 className="text-purple-500" size={16} />;
    }
  };

  const getComplianceLabel = (score: number) => {
    if (score >= 80) {
      return "COMPLIANT";
    }
    if (score >= 50) {
      return "PARTIALLY COMPLIANT";
    }
    return "HIGH RISK";
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) {
      return "bg-green-100 text-green-600";
    }
    if (score >= 50) {
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
    border-[#7C3AED]
  "
    >
      <div className="mb-6 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {appName}
        </p>

        <p className="mt-1 text-sm text-slate-500">Compliance Readiness Report • Section 01</p>
      </div>
      {/* 🔹 Title */}
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-wide">EXECUTIVE SUMMARY</h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of compliance posture and key observations
        </p>
      </div>
      {/* 🔹 Top Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-30">
        {/* 🟣 Score Box */}
        <div
          className=" rounded-2xl p-8 flex flex-col items-center justify-center bg-gradient-to-br
           from-purple-50 via-white to-purple-100 border border-purple-100 shadow-[0_10px_40px_rgba(124,58,237,0.12)]"
        >
          <p className="text-md text-gray-800 mb-2 font-semibold">OVERALL READINESS</p>

          {/* 🔵 Donut (simple version) */}
          <div className="rounded-full bg-white p-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="#7c3aed"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (score / 100) * 251}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-purple-700">
                {score}%
              </div>
            </div>
          </div>
          <span className={`mt-3 text-xs px-3 py-1 rounded-full ${getComplianceColor(score)}`}>
            {getComplianceLabel(score)}
          </span>
        </div>

        {/* 🔹 Findings */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <h3 className="text-md font-semibold mb-3 text-gray-800">Key Findings</h3>

          {findings.length === 0 ? (
            <p className="text-sm text-gray-400">No findings available</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {findings.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3
                  rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                >
                  {getIcon(f.type)}
                  <span className="text-gray-600">{f.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 🔹 Alerts */}
      {alerts.length === 0 ? (
        <p className="text-sm text-gray-400">No major risks identified</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className=" rounded-xl bg-white border-t-4 border-red-500  p-5 shadow-[0_8px_24px_rgba(239,68,68,0.08)]"
            >
              <div className="flex items-start gap-3">
                <div className=" h-8 w-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 ">
                  <AlertTriangle size={18} className="text-white" />
                </div>
                <h4 className="text-base font-semibold text-slate-900">{alert.title}</h4>
              </div>

              <p className="text-sm text-slate-500 mt-2">{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
