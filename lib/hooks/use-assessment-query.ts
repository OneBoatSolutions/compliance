"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAssessmentDetails } from "@/lib/checklist-api";
import {
  type AssessmentChecklistFilters,
  type AssessmentItemSeverity,
  type AssessmentItemStatus,
  type AssessmentSortParams,
  useAssessmentStore,
} from "@/stores/assessment-store";

const assessmentDetailQueryRoot = "assessment-detail";

const severityRank: Record<AssessmentItemSeverity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const statusRank: Record<AssessmentItemStatus, number> = {
  NOT_STARTED: 1,
  PARTIALLY_COMPLIANT: 2,
  NOT_COMPLIANT: 3,
  COMPLIANT: 4,
  NOT_APPLICABLE: 5,
};

type AssessmentDetailData = Awaited<ReturnType<typeof getAssessmentDetails>>;
type AssessmentItem = AssessmentDetailData["items"][number];
const emptyAssessmentItems: AssessmentItem[] = [];

export const assessmentQueryKeys = {
  detail: (assessmentId: string) => [assessmentDetailQueryRoot, assessmentId] as const,
};

function matchesSearch(item: AssessmentItem, searchValue: string): boolean {
  const term = searchValue.trim().toLowerCase();

  if (term.length === 0) {
    return true;
  }

  const haystack = [
    item.control.code,
    item.control.title,
    item.control.description,
    item.control.framework.code,
    item.control.framework.name,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

function applyChecklistFilters(
  items: AssessmentItem[],
  filters: AssessmentChecklistFilters,
): AssessmentItem[] {
  return items.filter((item) => {
    if (!matchesSearch(item, filters.search)) {
      return false;
    }

    if (filters.frameworks.length > 0 && !filters.frameworks.includes(item.control.framework.id)) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false;
    }

    if (filters.severity.length > 0 && !filters.severity.includes(item.control.severity)) {
      return false;
    }

    return true;
  });
}

function compareBySortField(
  a: AssessmentItem,
  b: AssessmentItem,
  sort: AssessmentSortParams,
): number {
  if (sort.by === "severity") {
    return severityRank[a.control.severity] - severityRank[b.control.severity];
  }

  if (sort.by === "status") {
    return statusRank[a.status] - statusRank[b.status];
  }

  if (sort.by === "updated") {
    const aTime = Date.parse(a.updatedAt);
    const bTime = Date.parse(b.updatedAt);

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      return a.control.code.localeCompare(b.control.code);
    }

    return aTime - bTime;
  }

  return a.control.code.localeCompare(b.control.code);
}

function applyChecklistSort(items: AssessmentItem[], sort: AssessmentSortParams): AssessmentItem[] {
  const direction = sort.order === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const diff = compareBySortField(a, b, sort);

    if (diff === 0) {
      return a.control.code.localeCompare(b.control.code);
    }

    return diff * direction;
  });
}

export function useAssessmentQuery(assessmentId: string) {
  const activeFilters = useAssessmentStore((state) => state.activeChecklistFilters);
  const activeSortParams = useAssessmentStore((state) => state.activeChecklistSortParams);

  const query = useQuery({
    queryKey: assessmentQueryKeys.detail(assessmentId),
    queryFn: () => getAssessmentDetails(assessmentId),
    enabled: assessmentId.trim().length > 0,
  });

  const rawItems = query.data?.items ?? emptyAssessmentItems;

  const items = useMemo(() => {
    const filtered = applyChecklistFilters(rawItems, activeFilters);
    return applyChecklistSort(filtered, activeSortParams);
  }, [activeFilters, activeSortParams, rawItems]);

  const assessment = useMemo(() => {
    if (!query.data) {
      return undefined;
    }

    return {
      ...query.data,
      items,
    };
  }, [items, query.data]);

  return {
    query,
    assessment,
    items,
    rawItems,
    activeFilters,
    activeSortParams,
  };
}
