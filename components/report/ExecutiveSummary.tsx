"use client";

import { CheckCircle, AlertTriangle, Info, BarChart3 } from "lucide-react";

import { Finding } from "@/lib/report-types";

interface Props {
  score: number;
  findings: Finding[];
  alerts: {
    title: string;
    description: string;
  }[];
}

export function ExecutiveSummarySkeleton() {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveSummary({ score, findings, alerts }: Props) {
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
    <section className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* 🔹 Title */}
      <h2 className="text-lg font-semibold text-purple-600 tracking-wide">EXECUTIVE SUMMARY</h2>

      {/* 🔹 Top Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 🟣 Score Box */}
        <div className="bg-purple-100 rounded-xl p-6 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-500 mb-2">OVERALL READINESS</p>

          {/* 🔵 Donut (simple version) */}
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

          <span className={`mt-3 text-xs px-3 py-1 rounded-full ${getComplianceColor(score)}`}>
            {getComplianceLabel(score)}
          </span>
        </div>

        {/* 🔹 Findings */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Key Findings</h3>

          {findings.length === 0 ? (
            <p className="text-sm text-gray-400">No findings available</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {findings.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
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
            <div key={i} className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <h4 className="text-sm font-semibold text-red-600">{alert.title}</h4>
              </div>

              <p className="text-xs text-gray-600 mt-2">{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
