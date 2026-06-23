import type { ItemStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/cache";
import type {
  DashboardActivityItem,
  DashboardApiData,
  DashboardAssessmentSummary,
  DashboardFrameworkScore,
} from "@/types/dashboard";

/** Same window as assessment-score SQL: exclude N/A and gateway rows from denominator; partial = 0.5 weight. */
function weightedScorePercent(
  items: Array<{
    status: ItemStatus;
    control: { weight: number; isGateway: boolean };
  }>,
): number {
  let numerator = 0;
  let denominator = 0;
  for (const item of items) {
    const { weight, isGateway } = item.control;
    if (isGateway) {
      continue;
    }
    if (item.status === "NOT_APPLICABLE") {
      continue;
    }
    denominator += weight;
    if (item.status === "COMPLIANT") {
      numerator += weight;
    } else if (item.status === "PARTIALLY_COMPLIANT") {
      numerator += weight * 0.5;
    }
  }
  if (denominator <= 0) {
    return 0;
  }
  return (numerator / denominator) * 100;
}

function roundScore(n: number): number {
  return Math.round(n * 100) / 100;
}

interface ItemWithControlFramework {
  status: ItemStatus;
  control: {
    weight: number;
    isGateway: boolean;
    frameworkId: string;
    framework: { code: string; name: string };
  };
}

function frameworkScoresFromItems(items: ItemWithControlFramework[]): DashboardFrameworkScore[] {
  const byFw = new Map<string, ItemWithControlFramework[]>();
  for (const item of items) {
    const fid = item.control.frameworkId;
    const list = byFw.get(fid) ?? [];
    list.push(item);
    byFw.set(fid, list);
  }
  const out: DashboardFrameworkScore[] = [];
  for (const group of byFw.values()) {
    const fw = group[0].control.framework;
    out.push({
      frameworkCode: fw.code,
      frameworkName: fw.name,
      score: roundScore(weightedScorePercent(group)),
    });
  }
  out.sort((a, b) => a.frameworkCode.localeCompare(b.frameworkCode));
  return out;
}

/** If created/updated within this window, treat as initial "created" only (one event). */
const assessmentCreatedWindowMs = 2000;

async function buildDashboardData(userId: string): Promise<DashboardApiData> {
  const [
    totalAssessments,
    avgScoreAgg,
    criticalGaps,
    reportsGenerated,
    reportRows,
    assessmentActivityRows,
    evidenceRows,
    assessmentRows,
  ] = await Promise.all([
    prisma.assessment.count({ where: { userId } }),
    prisma.assessment.aggregate({
      where: { userId, score: { not: null } },
      _avg: { score: true },
    }),
    // Critical gaps: CRITICAL controls not fully met (non-compliant or partial).
    prisma.assessmentItem.count({
      where: {
        assessment: { userId },
        control: { severity: "CRITICAL" },
        status: { in: ["NOT_COMPLIANT", "PARTIALLY_COMPLIANT"] },
      },
    }),
    prisma.report.count({
      where: { assessment: { userId } },
    }),
    prisma.report.findMany({
      where: { assessment: { userId } },
      orderBy: { generatedAt: "desc" },
      take: 15,
      select: {
        id: true,
        generatedAt: true,
        type: true,
        format: true,
      },
    }),
    prisma.assessment.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 15,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    }),
    prisma.evidence.findMany({
      where: {
        assessmentItem: {
          assessment: { userId },
        },
      },
      orderBy: { uploadedAt: "desc" },
      take: 15,
      select: {
        id: true,
        uploadedAt: true,
        originalName: true,
      },
    }),
    prisma.assessment.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        score: true,
        updatedAt: true,
        organization: {
          select: { name: true, productName: true },
        },
        items: {
          select: {
            status: true,
            control: {
              select: {
                weight: true,
                isGateway: true,
                frameworkId: true,
                framework: {
                  select: { code: true, name: true },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const averageScore =
    avgScoreAgg._avg.score !== null && avgScoreAgg._avg.score !== undefined
      ? roundScore(Number(avgScoreAgg._avg.score))
      : 0;

  const activities: DashboardActivityItem[] = [];

  for (const r of reportRows) {
    activities.push({
      id: `report-${r.id}`,
      type: "report_generated",
      title: "Report generated",
      detail: `${r.type} (${r.format})`,
      occurredAt: r.generatedAt.toISOString(),
    });
  }

  for (const a of assessmentActivityRows) {
    const delta = a.updatedAt.getTime() - a.createdAt.getTime();
    if (delta < assessmentCreatedWindowMs) {
      activities.push({
        id: `assessment-created-${a.id}`,
        type: "assessment_created",
        title: "Assessment created",
        detail: `Status: ${a.status}`,
        occurredAt: a.createdAt.toISOString(),
      });
    } else {
      activities.push({
        id: `assessment-updated-${a.id}`,
        type: "assessment_updated",
        title: "Assessment updated",
        detail: `Status: ${a.status}`,
        occurredAt: a.updatedAt.toISOString(),
      });
    }
  }

  for (const e of evidenceRows) {
    activities.push({
      id: `evidence-${e.id}`,
      type: "evidence_uploaded",
      title: "Evidence uploaded",
      detail: e.originalName,
      occurredAt: e.uploadedAt.toISOString(),
    });
  }

  activities.sort((x, y) => new Date(y.occurredAt).getTime() - new Date(x.occurredAt).getTime());
  const recentActivity = activities.slice(0, 10);

  const assessments: DashboardAssessmentSummary[] = assessmentRows.map(
    (a: {
      id: string;
      status: string;
      score: number | null;
      updatedAt: Date;
      organization: { name: string; productName: string | null };
      items: ItemWithControlFramework[];
    }) => {
      const items = a.items as ItemWithControlFramework[];
      const computed = roundScore(weightedScorePercent(items));
      const score =
        a.score !== null && a.score !== undefined
          ? roundScore(Number(a.score))
          : items.length > 0
            ? computed
            : null;

      return {
        id: a.id,
        organizationName: a.organization.productName ?? a.organization.name,
        status: a.status,
        score,
        updatedAt: a.updatedAt.toISOString(),
        frameworkScores: frameworkScoresFromItems(items),
      };
    },
  );

  return {
    totalAssessments,
    averageScore,
    criticalGaps,
    reportsGenerated,
    recentActivity,
    assessments,
  };
}

export const getCachedDashboardData = async (userId: string) => {
  const cacheKey = `dashboard:${userId}`;
  const cachedData = await getCache<DashboardApiData>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const freshData = await buildDashboardData(userId);
  await setCache<DashboardApiData>(cacheKey, freshData, 60);
  return freshData;
};
