import { unstable_cache } from "next/cache";
import type { ItemStatus, Severity } from "@prisma/client";

import { computeFrameworkScores, type ScoreItemRow } from "@/lib/assessment-score";
import { prisma } from "@/lib/prisma";
import type {
  AnalyticsApiData,
  AnalyticsCategoryCompletion,
  AnalyticsRemediationProgress,
  AnalyticsRiskHeatmapCell,
  AnalyticsStatusDistribution,
  AnalyticsTrendPoint,
} from "@/types/analytics";

const analyticsRevalidateSec = 60;

export type AnalyticsRangeKind = "LAST_30" | "LAST_90" | "ALL_TIME" | "CUSTOM";

interface AnalyticsDateBounds {
  start: Date | null;
  end: Date | null;
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeCategory(category: string | null): string {
  const trimmed = category?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Uncategorized";
}

function initCategoryEntry(): AnalyticsCategoryCompletion {
  return {
    category: "",
    compliant: 0,
    partial: 0,
    nonCompliant: 0,
    notApplicable: 0,
    total: 0,
  };
}

function parseDateBoundary(value: string | null, boundary: "start" | "end"): Date | null {
  if (!value) {
    return null;
  }

  return new Date(`${value}T${boundary === "start" ? "00:00:00.000" : "23:59:59.999"}Z`);
}

function getDateBounds(
  rangeKind: AnalyticsRangeKind,
  startDateKey: string | null,
  endDateKey: string | null,
): AnalyticsDateBounds {
  if (rangeKind === "ALL_TIME") {
    return { start: null, end: null };
  }

  if (rangeKind === "CUSTOM") {
    return {
      start: parseDateBoundary(startDateKey, "start"),
      end: parseDateBoundary(endDateKey, "end"),
    };
  }

  const days = rangeKind === "LAST_90" ? 90 : 30;
  return {
    start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    end: null,
  };
}

async function buildAnalyticsData(
  userId: string,
  rangeKind: AnalyticsRangeKind,
  startDateKey: string | null,
  endDateKey: string | null,
): Promise<AnalyticsApiData> {
  const bounds = getDateBounds(rangeKind, startDateKey, endDateKey);
  const createdAtFilter =
    bounds.start || bounds.end
      ? {
          ...(bounds.start ? { gte: bounds.start } : {}),
          ...(bounds.end ? { lte: bounds.end } : {}),
        }
      : undefined;
  const scoreLogClient = prisma as unknown as {
    assessmentScoreLog: {
      findMany: (args: unknown) => Promise<Array<{ createdAt: Date; overallScore: number }>>;
    };
  };

  const [items, trendRows, totalRemediationSteps, completedRemediationSteps, activePlans] =
    await Promise.all([
      prisma.assessmentItem.findMany({
        where: {
          assessment: { userId },
        },
        select: {
          status: true,
          control: {
            select: {
              weight: true,
              isGateway: true,
              frameworkId: true,
              framework: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
              category: true,
              severity: true,
            },
          },
        },
      }),
      scoreLogClient.assessmentScoreLog.findMany({
        where: {
          assessment: { userId },
          ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
        },
        orderBy: { createdAt: "asc" },
        select: {
          createdAt: true,
          overallScore: true,
        },
      }),
      prisma.remediationStep.count({
        where: {
          plan: {
            userId,
          },
        },
      }),
      prisma.remediationStep.count({
        where: {
          status: "DONE",
          plan: {
            userId,
          },
        },
      }),
      prisma.remediationPlan.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      }),
    ]);

  const frameworkComparison = computeFrameworkScores(items as ScoreItemRow[]);

  const statusCounts = new Map<ItemStatus, number>();
  const heatmapCounts = new Map<string, number>();
  const categoryCounts = new Map<string, AnalyticsCategoryCompletion>();

  for (const item of items) {
    statusCounts.set(item.status, (statusCounts.get(item.status) ?? 0) + 1);

    const severity = item.control.severity as Severity;
    const heatmapKey = `${severity}:${item.status}`;
    heatmapCounts.set(heatmapKey, (heatmapCounts.get(heatmapKey) ?? 0) + 1);

    const category = normalizeCategory(item.control.category);
    const entry = categoryCounts.get(category) ?? initCategoryEntry();
    entry.category = category;
    entry.total += 1;

    if (item.status === "COMPLIANT") {
      entry.compliant += 1;
    } else if (item.status === "PARTIALLY_COMPLIANT") {
      entry.partial += 1;
    } else if (item.status === "NOT_COMPLIANT") {
      entry.nonCompliant += 1;
    } else if (item.status === "NOT_APPLICABLE") {
      entry.notApplicable += 1;
    }

    categoryCounts.set(category, entry);
  }

  const statusDistribution: AnalyticsStatusDistribution[] = [...statusCounts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => a.status.localeCompare(b.status));

  const categoryCompletion = [...categoryCounts.values()].sort((a, b) =>
    a.category.localeCompare(b.category),
  );

  const riskHeatmap: AnalyticsRiskHeatmapCell[] = [...heatmapCounts.entries()]
    .map(([key, count]) => {
      const [severity, status] = key.split(":") as [Severity, ItemStatus];
      return { severity, status, count };
    })
    .sort((a, b) => {
      if (a.severity === b.severity) {
        return a.status.localeCompare(b.status);
      }
      return a.severity.localeCompare(b.severity);
    });

  const trendBuckets = new Map<string, { sum: number; count: number }>();

  for (const row of trendRows) {
    const key = formatDateKey(row.createdAt);
    const bucket = trendBuckets.get(key) ?? { sum: 0, count: 0 };
    bucket.sum += row.overallScore;
    bucket.count += 1;
    trendBuckets.set(key, bucket);
  }

  const trend: AnalyticsTrendPoint[] = [...trendBuckets.entries()]
    .map(([date, bucket]) => ({
      date,
      score: Math.round((bucket.sum / bucket.count) * 10) / 10,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const remediationProgress: AnalyticsRemediationProgress = {
    totalSteps: totalRemediationSteps,
    completedSteps: completedRemediationSteps,
    activePlans,
    completionRate:
      totalRemediationSteps > 0
        ? Math.round((completedRemediationSteps / totalRemediationSteps) * 100)
        : 0,
  };

  return {
    trend,
    frameworkComparison,
    statusDistribution,
    categoryCompletion,
    riskHeatmap,
    remediationProgress,
  };
}

export const getCachedAnalyticsData = unstable_cache(
  async (
    userId: string,
    rangeKind: AnalyticsRangeKind = "LAST_30",
    startDateKey: string | null = null,
    endDateKey: string | null = null,
  ) => buildAnalyticsData(userId, rangeKind, startDateKey, endDateKey),
  ["analytics"],
  { revalidate: analyticsRevalidateSec },
);
