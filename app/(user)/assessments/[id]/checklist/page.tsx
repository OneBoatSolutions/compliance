"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteAssessment,
  duplicateAssessment,
  getAssessmentChecklist,
  getAssessmentScore,
} from "@/lib/checklist-api";
import { useAssessmentQuery } from "@/lib/hooks/use-assessment-query";
import { useUpdateAssessmentItemMutation } from "@/lib/hooks/use-update-assessment-item-mutation";
import { type AssessmentSortField, useAssessmentStore } from "@/stores/assessment-store";
import Skeleton from "@/components/assessment-checklist/Skeleton";

const MetricsBar = dynamic(() => import("@/components/assessment-checklist/MetricsBar"), {
  loading: () => <div className="h-24 animate-pulse rounded-xl bg-muted" />,
});
const FilterBar = dynamic(() => import("@/components/assessment-checklist/FilterBar"), {
  loading: () => <div className="h-12 animate-pulse rounded-xl bg-muted" />,
});
const ChecklistGroup = dynamic(() => import("@/components/assessment-checklist/ChecklistGroup"), {
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-muted" />,
});
const Pagination = dynamic(() => import("@/components/assessment-checklist/Pagination"));
const EmptyState = dynamic(() => import("@/components/assessment-checklist/EmptyState"));
const MoreActionsDropdown = dynamic(
  () => import("@/components/assessment-checklist/MoreActionsDropdown"),
);
import {
  type AssessmentDetailResponse,
  type ChecklistSort,
  type Control,
  type FrameworkFilterOption,
  type Status,
} from "./types";

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return value;
  }

  const now = Date.now();
  const diffMs = timestamp - now;

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMs) < hour) {
    return formatter.format(Math.round(diffMs / minute), "minute");
  }

  if (Math.abs(diffMs) < day) {
    return formatter.format(Math.round(diffMs / hour), "hour");
  }

  return formatter.format(Math.round(diffMs / day), "day");
}

function assessmentStatusLabel(status: "DRAFT" | "IN_PROGRESS" | "COMPLETED"): string {
  if (status === "COMPLETED") {
    return "Completed";
  }

  if (status === "DRAFT") {
    return "Draft";
  }

  return "In Progress";
}

function mapStoreSortToChecklistSort(sortBy: AssessmentSortField): ChecklistSort {
  if (sortBy === "status") {
    return "status";
  }

  if (sortBy === "id") {
    return "id";
  }

  if (sortBy === "updated") {
    return "updated";
  }

  return "severity";
}

function mapChecklistSortToStoreSort(sort: ChecklistSort): {
  by: AssessmentSortField;
  order: "asc" | "desc";
} {
  if (sort === "status") {
    return { by: "status", order: "asc" };
  }

  if (sort === "id") {
    return { by: "id", order: "asc" };
  }

  if (sort === "updated") {
    return { by: "updated", order: "desc" };
  }

  return { by: "severity", order: "desc" };
}

function escapeCsvField(value: string): string {
  const escaped = value.replace(/"/g, '""');

  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }

  return escaped;
}

function serializeControlsToCsv(controls: Control[]): string {
  const headers = [
    "Control ID",
    "Title",
    "Framework",
    "Severity",
    "Status",
    "Evidence Count",
    "Last Updated",
    "Comments",
  ];

  const rows = controls.map((control) => [
    control.id,
    control.title,
    control.framework,
    control.severity,
    control.status,
    String(control.evidenceCount),
    control.updatedAt,
    control.comments ?? "",
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvField(String(value))).join(","))
    .join("\n");
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function ChecklistPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rawAssessmentId = params?.id;
  const assessmentId = Array.isArray(rawAssessmentId)
    ? (rawAssessmentId[0] ?? "")
    : (rawAssessmentId ?? "");

  const setChecklistScore = useAssessmentStore((state) => state.setChecklistScore);
  const clearChecklistState = useAssessmentStore((state) => state.clearChecklistState);
  const resetChecklistViewState = useAssessmentStore((state) => state.resetChecklistViewState);
  const setChecklistFilters = useAssessmentStore((state) => state.setChecklistFilters);
  const setChecklistSortParams = useAssessmentStore((state) => state.setChecklistSortParams);
  const activeChecklistFilters = useAssessmentStore((state) => state.activeChecklistFilters);
  const activeChecklistSortParams = useAssessmentStore((state) => state.activeChecklistSortParams);

  const search = activeChecklistFilters.search;
  const frameworks = activeChecklistFilters.frameworks;
  const status = activeChecklistFilters.status;
  const severity = activeChecklistFilters.severity;
  const sort = useMemo(
    () => mapStoreSortToChecklistSort(activeChecklistSortParams.by),
    [activeChecklistSortParams.by],
  );

  const setSearch = (nextSearch: string) => {
    setChecklistFilters({ search: nextSearch });
  };

  const setFrameworks = (nextValue: string[] | ((prev: string[]) => string[])) => {
    const resolved = typeof nextValue === "function" ? nextValue(frameworks) : nextValue;
    setChecklistFilters({ frameworks: resolved });
  };

  const setStatus = (nextValue: Status[] | ((prev: Status[]) => Status[])) => {
    const current = status as Status[];
    const resolved = typeof nextValue === "function" ? nextValue(current) : nextValue;
    setChecklistFilters({ status: resolved });
  };

  const setSeverity = (
    nextValue:
      | AssessmentDetailResponse["items"][number]["control"]["severity"][]
      | ((
          prev: AssessmentDetailResponse["items"][number]["control"]["severity"][],
        ) => AssessmentDetailResponse["items"][number]["control"]["severity"][]),
  ) => {
    const current = severity as AssessmentDetailResponse["items"][number]["control"]["severity"][];
    const resolved = typeof nextValue === "function" ? nextValue(current) : nextValue;
    setChecklistFilters({ severity: resolved });
  };

  const setSort = (nextSort: ChecklistSort) => {
    setChecklistSortParams(mapChecklistSortToStoreSort(nextSort));
  };

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [isHeaderActionPending, setIsHeaderActionPending] = useState(false);

  useEffect(() => {
    return () => {
      clearChecklistState();
    };
  }, [clearChecklistState]);

  useEffect(() => {
    setPage(1);
  }, [frameworks, perPage, search, severity, sort, status]);

  const checklistQueryPrefix = useMemo(
    () => ["assessment-checklist", assessmentId] as const,
    [assessmentId],
  );
  const checklistQueryKey = useMemo(
    () =>
      [
        ...checklistQueryPrefix,
        {
          page,
          perPage,
          search,
          frameworks,
          status,
          severity,
          sort,
        },
      ] as const,
    [checklistQueryPrefix, frameworks, page, perPage, search, severity, sort, status],
  );
  const scoreQueryKey = useMemo(() => ["assessment-score", assessmentId] as const, [assessmentId]);

  const { query: assessmentQuery, rawItems } = useAssessmentQuery(assessmentId);

  const checklistQuery = useQuery({
    queryKey: checklistQueryKey,
    queryFn: () =>
      getAssessmentChecklist({
        assessmentId,
        page,
        limit: perPage,
        search,
        frameworks,
        status,
        severity,
        sort,
      }),
    enabled: assessmentId.length > 0,
    placeholderData: (previous) => previous,
  });

  const scoreQuery = useQuery({
    queryKey: scoreQueryKey,
    queryFn: () => getAssessmentScore(assessmentId),
    enabled: assessmentId.length > 0,
  });

  useEffect(() => {
    if (!scoreQuery.data) {
      return;
    }

    setChecklistScore(scoreQuery.data.score, scoreQuery.data.frameworkScores);
  }, [scoreQuery.data, setChecklistScore]);

  function mapApiItemToControl(item: AssessmentDetailResponse["items"][number]): Control {
    return {
      itemId: item.id,
      id: item.control.code,
      title: item.control.title,
      description: item.control.description,
      category: item.control.category ?? null,
      frameworkId: item.control.framework.id,
      frameworkName: item.control.framework.name,
      framework: item.control.framework.code,
      severity: item.control.severity,
      status: item.status,
      evidenceCount: item._count.evidence,
      updatedAt: formatRelativeTime(item.updatedAt),
      comments: item.comments,
      weight: item.control.weight,
    };
  }

  const updateStatusMutation = useUpdateAssessmentItemMutation(assessmentId, {
    checklistQueryPrefix,
    scoreQueryKey,
  });

  const allControls = useMemo<Control[]>(() => {
    return rawItems.map(mapApiItemToControl);
  }, [rawItems]);

  const visibleControls = useMemo<Control[]>(() => {
    const items = checklistQuery.data?.items ?? [];
    return items.map(mapApiItemToControl);
  }, [checklistQuery.data?.items]);

  const groupedControls = useMemo(() => {
    // Group by framework, then sub-group by category
    const byFramework = visibleControls.reduce<Record<string, Record<string, Control[]>>>(
      (acc, control) => {
        const fw = control.framework;
        const cat = control.category || "General";
        if (!acc[fw]) {
          acc[fw] = {};
        }
        if (!acc[fw][cat]) {
          acc[fw][cat] = [];
        }
        acc[fw][cat].push(control);
        return acc;
      },
      {},
    );

    // Flatten into groups with composite keys
    const result: Array<{ framework: string; category: string; controls: Control[] }> = [];
    for (const [fw, categories] of Object.entries(byFramework)) {
      for (const [cat, controls] of Object.entries(categories)) {
        result.push({ framework: fw, category: cat, controls });
      }
    }
    return result;
  }, [visibleControls]);

  const frameworkOptions = useMemo(() => {
    if (scoreQuery.data?.frameworkScores.length) {
      return scoreQuery.data.frameworkScores.map((frameworkScore) => ({
        id: frameworkScore.frameworkId,
        code: frameworkScore.frameworkCode,
        name: frameworkScore.frameworkName,
      }));
    }

    const map = new Map<string, FrameworkFilterOption>();
    for (const control of allControls) {
      if (!map.has(control.frameworkId)) {
        map.set(control.frameworkId, {
          id: control.frameworkId,
          code: control.framework,
          name: control.frameworkName,
        });
      }
    }

    return [...map.values()];
  }, [allControls, scoreQuery.data?.frameworkScores]);

  const statusDistribution = useMemo(() => {
    let compliant = 0;
    let partial = 0;
    let gap = 0;
    let notStarted = 0;

    for (const item of rawItems) {
      if (item.status === "COMPLIANT") {
        compliant += 1;
        continue;
      }

      if (item.status === "PARTIALLY_COMPLIANT") {
        partial += 1;
        continue;
      }

      if (item.status === "NOT_COMPLIANT") {
        gap += 1;
        continue;
      }

      if (item.status === "NOT_STARTED") {
        notStarted += 1;
      }
    }

    return {
      total: rawItems.length,
      compliant,
      partial,
      gap,
      notStarted,
    };
  }, [rawItems]);

  if (assessmentQuery.isPending || checklistQuery.isPending || scoreQuery.isPending) {
    return <Skeleton />;
  }

  if (assessmentQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-700">Failed to load assessment</h2>
          <p className="text-sm text-red-600 mt-1">
            {assessmentQuery.error instanceof Error
              ? assessmentQuery.error.message
              : "Please try again."}
          </p>
          <button
            onClick={() => void assessmentQuery.refetch()}
            className="mt-4 px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (checklistQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-700">Failed to load checklist</h2>
          <p className="text-sm text-red-600 mt-1">
            {checklistQuery.error instanceof Error
              ? checklistQuery.error.message
              : "Please try again."}
          </p>
          <button
            onClick={() => void checklistQuery.refetch()}
            className="mt-4 px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (scoreQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-700">Failed to load assessment score</h2>
          <p className="text-sm text-red-600 mt-1">
            {scoreQuery.error instanceof Error ? scoreQuery.error.message : "Please try again."}
          </p>
          <button
            onClick={() => void scoreQuery.refetch()}
            className="mt-4 px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!visibleControls.length) {
    return (
      <EmptyState
        onClear={() => {
          resetChecklistViewState();
          setPage(1);
        }}
      />
    );
  }

  const assessmentStatus = assessmentQuery.data?.status ?? "IN_PROGRESS";
  const lastUpdated = assessmentQuery.data?.updatedAt
    ? formatRelativeTime(assessmentQuery.data.updatedAt)
    : "N/A";
  const overallScore = scoreQuery.data?.score ?? null;
  const totalItems = checklistQuery.data?.meta.total ?? visibleControls.length;
  const updatingItemId = updateStatusMutation.isPending
    ? (updateStatusMutation.variables?.itemId ?? null)
    : null;

  const exportChecklistCsv = () => {
    if (allControls.length === 0) {
      toast.info("No controls available to export.");
      return;
    }

    const csv = serializeControlsToCsv(allControls);
    const datePart = new Date().toISOString().slice(0, 10);
    const filename = `assessment-${assessmentId}-checklist-${datePart}.csv`;

    downloadCsv(filename, csv);
    toast.success("Checklist CSV exported.");
  };

  const handleDuplicateAssessment = async () => {
    if (!assessmentId) {
      return;
    }

    setIsHeaderActionPending(true);

    try {
      const duplicated = await duplicateAssessment(assessmentId);
      toast.success("Assessment duplicated.");
      router.push(`/assessments/${duplicated.assessmentId}/checklist`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to duplicate assessment.");
    } finally {
      setIsHeaderActionPending(false);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!assessmentId) {
      return;
    }

    const shouldDelete = window.confirm("Delete this assessment? This action cannot be undone.");

    if (!shouldDelete) {
      return;
    }

    setIsHeaderActionPending(true);

    try {
      await deleteAssessment(assessmentId);
      toast.success("Assessment deleted.");
      router.push("/assessments");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete assessment.");
    } finally {
      setIsHeaderActionPending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-2 p-6">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 hover:text-purple-600 cursor-pointer">
          Assessments / <span className="text-gray-800 font-medium">Assessment {assessmentId}</span>
        </p>

        {/* Title Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Assessment Checklist</h1>

            <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
              {assessmentStatusLabel(assessmentStatus)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              disabled={isHeaderActionPending}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-gray-100 disabled:opacity-60"
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={() => router.push("/reports")}
              disabled={isHeaderActionPending}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-purple-50 disabled:opacity-60"
            >
              <FileText className="w-4 h-4" /> View Report
            </button>
            <MoreActionsDropdown
              onExportCsv={exportChecklistCsv}
              onDuplicateAssessment={handleDuplicateAssessment}
              onDeleteAssessment={handleDeleteAssessment}
              disabled={isHeaderActionPending}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </div>

      <MetricsBar
        controls={allControls}
        overallScore={overallScore}
        frameworkScores={scoreQuery.data?.frameworkScores}
        statusDistribution={statusDistribution}
        isUpdating={updateStatusMutation.isPending}
        onFilterFramework={(frameworkId) => setChecklistFilters({ frameworks: [frameworkId] })}
        onFilterStatus={(s) => setChecklistFilters({ status: [s] })}
      />

      <FilterBar
        search={search}
        setSearch={setSearch}
        frameworks={frameworks}
        setFrameworks={setFrameworks}
        frameworkOptions={frameworkOptions}
        status={status}
        setStatus={setStatus}
        severity={severity}
        setSeverity={setSeverity}
        sort={sort}
        setSort={setSort}
      />

      {/* GROUPS */}
      {groupedControls.map((group) => (
        <ChecklistGroup
          key={`${group.framework}-${group.category}`}
          framework={group.framework}
          category={group.category}
          controls={group.controls}
          assessmentId={assessmentId}
          updatingItemId={updatingItemId}
          onStatusChange={(itemId, nextStatus) => {
            updateStatusMutation.mutate(
              {
                itemId,
                payload: { status: nextStatus },
              },
              {
                onSuccess: () => {
                  toast.success("Control status updated.");
                },
                onError: (error) => {
                  toast.error(
                    error instanceof Error ? error.message : "Unable to update control status.",
                  );
                },
              },
            );
          }}
        />
      ))}

      <Pagination
        total={totalItems}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </div>
  );
}
