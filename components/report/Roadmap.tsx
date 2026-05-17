"use client";
import { mockReportData } from "@/lib/report-mockData";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
interface Props {
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

export default function Roadmap({ roadmap }: Props) {
  const summary = roadmap?.summary ?? {
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  };

  const items = roadmap?.items ?? [];
  const data = mockReportData;

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") {
      return "bg-green-100 text-green-600";
    }
    if (status === "IN_PROGRESS") {
      return "bg-yellow-100 text-yellow-600";
    }
    return "bg-red-100 text-red-600";
  };

  const getPriorityDot = (priority: string) => {
    if (priority === "HIGH") {
      return "bg-red-500";
    }
    if (priority === "MED") {
      return "bg-yellow-400";
    }
    return "bg-green-500";
  };

  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-10">
      {/* 🔹 Title */}
      <h2 className="text-lg font-semibold text-purple-600 uppercase">REMEDIATION ROADMAP</h2>

      {/* 🔹 Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gray-50 border">
          <p className="text-xs text-gray-400">TOTAL ACTIONS</p>
          <p className="text-xl font-bold">{summary.total}</p>
        </div>

        <div className="p-4 rounded-lg bg-green-50 border">
          <p className="text-xs text-green-500">COMPLETED</p>
          <p className="text-xl font-bold text-green-600">{summary.completed}</p>
        </div>

        <div className="p-4 rounded-lg bg-yellow-50 border">
          <p className="text-xs text-yellow-500">IN PROGRESS</p>
          <p className="text-xl font-bold text-yellow-600">{summary.inProgress}</p>
        </div>

        <div className="p-4 rounded-lg bg-red-50 border">
          <p className="text-xs text-red-500">OVERDUE</p>
          <p className="text-xl font-bold text-red-600">{summary.overdue}</p>
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
