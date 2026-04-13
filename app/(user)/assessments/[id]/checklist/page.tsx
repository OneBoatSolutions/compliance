"use client";

import { useEffect, useMemo, useState } from "react";
import { Control } from "./types";
import MetricsBar from "@/components/assessment-checklist/MetricsBar";
import FilterBar from "@/components/assessment-checklist/FilterBar";
import ChecklistGroup from "@/components/assessment-checklist/ChecklistGroup";
import Pagination from "@/components/assessment-checklist/Pagination";
import Skeleton from "@/components/assessment-checklist/Skeleton";
import EmptyState from "@/components/assessment-checklist/EmptyState";
import MoreActionsDropdown from "@/components/assessment-checklist/MoreActionsDropdown";
import { FileText } from "lucide-react";

export default function ChecklistPage() {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string[]>([]);
  const [sort, setSort] = useState("severity");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  // MOCK DATA (replace with API)
  useEffect(() => {
    setTimeout(() => {
      setControls([
        {
          id: "HIPAA-AS-01",
          title: "Access Control Policy",
          description: "Ensure policies exist...",
          framework: "HIPAA",
          severity: "MEDIUM",
          status: "COMPLIANT",
          evidenceCount: 3,
          updatedAt: "2h ago",
        },
        {
          id: "HIPAA-AS-02",
          title: "Risk Assessment & Management",
          description: "Conduct risk assessments...",
          framework: "HIPAA",
          severity: "HIGH",
          status: "NON_COMPLIANT",
          evidenceCount: 0,
          updatedAt: "1d ago",
        },
        {
          id: "ISO-27001-01",
          title: "Information Security Policy",
          description: "Define security policies...",
          framework: "ISO27001",
          severity: "LOW",
          status: "COMPLIANT",
          evidenceCount: 4,
          updatedAt: "1d ago",
        },
        {
          id: "ISO-27001-02",
          title: "Asset Management",
          description: "Maintain asset inventory...",
          framework: "ISO27001",
          severity: "HIGH",
          status: "NON_COMPLIANT",
          evidenceCount: 0,
          updatedAt: "6h ago",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // FILTERING
  const filtered = useMemo(() => {
    return controls
      .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
      .filter((c) => (frameworks.length ? frameworks.includes(c.framework) : true))
      .filter((c) => (status.length ? status.includes(c.status) : true))
      .filter((c) => (severity.length ? severity.includes(c.severity) : true));
  }, [controls, search, frameworks, status, severity]);

  useEffect(() => {
    setPage(1);
  }, [search, frameworks, status, severity]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "severity") {
        const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return order[b.severity] - order[a.severity];
      }

      if (sort === "status") {
        const order = {
          NOT_STARTED: 1,
          PARTIAL: 2,
          NON_COMPLIANT: 3,
          COMPLIANT: 4,
        };
        return order[a.status] - order[b.status];
      }

      if (sort === "updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sort === "id") {
        return a.id.localeCompare(b.id);
      }

      return 0;
    });
  }, [filtered, sort]);

  // PAGINATION
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return <Skeleton />;
  }

  if (!filtered.length) {
    return (
      <EmptyState
        onClear={() => {
          setSearch("");
          setFrameworks([]);
          setStatus([]);
          setSeverity([]);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-2 p-6">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 hover:text-purple-600 cursor-pointer">
          Assessments / <span className="text-gray-800 font-">HealthTrack App Compliance</span>
        </p>

        {/* Title Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">HealthTrack App Compliance</h1>

            <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
              In Progress
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-gray-100">
              ← Back to Dashboard
            </button>

            <button className="flex items-center gap-2 px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-purple-50">
              <FileText className="w-4 h-4" /> Generate Report
            </button>
            <MoreActionsDropdown />
          </div>
        </div>

        {/* Last updated */}
        <p className="text-sm text-gray-500">Last updated: 2 hours ago by Sarah Chen</p>
        {/*replace with username*/}
      </div>
      <MetricsBar
        controls={controls}
        onFilterFramework={(fw) => setFrameworks([fw])}
        onFilterStatus={(s) => setStatus([s])}
      />

      <FilterBar
        search={search}
        setSearch={setSearch}
        frameworks={frameworks}
        setFrameworks={setFrameworks}
        status={status}
        setStatus={setStatus}
        severity={severity}
        setSeverity={setSeverity}
        sort={sort}
        setSort={setSort}
      />

      {/* GROUPS */}
      {Object.entries(
        paginated.reduce<Record<string, Control[]>>((acc, curr) => {
          if (!acc[curr.framework]) {
            acc[curr.framework] = [];
          }
          acc[curr.framework].push(curr);
          return acc;
        }, {}),
      ).map(([framework, items]) => (
        <ChecklistGroup key={framework} framework={framework} controls={items} />
      ))}

      <Pagination
        total={filtered.length}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </div>
  );
}
