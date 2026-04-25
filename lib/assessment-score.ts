import { ItemStatus, Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface ScoreItemRow {
  status: ItemStatus;
  control: {
    weight: number;
    isGateway: boolean;
    frameworkId: string;
    framework: {
      id: string;
      code: string;
      name: string;
    };
  };
}

export interface FrameworkScore {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

export interface AssessmentScoreResult {
  assessmentId: string;
  score: number;
  frameworkScores: FrameworkScore[];
}

type ScoreQueryExecutor = PrismaClient | Prisma.TransactionClient;

export function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

export function statusFactor(status: ItemStatus): number | null {
  if (status === "COMPLIANT") {
    return 1;
  }

  if (status === "PARTIALLY_COMPLIANT") {
    return 0.5;
  }

  if (status === "NOT_APPLICABLE") {
    return null;
  }

  return 0;
}

export function computeOverallScore(rows: ScoreItemRow[]): number {
  let numerator = 0;
  let denominator = 0;

  for (const row of rows) {
    // Skip gateway controls — consistent with dashboard-data.ts
    if (row.control.isGateway) {
      continue;
    }

    const factor = statusFactor(row.status);

    if (factor === null) {
      continue;
    }

    const weight = row.control.weight;
    denominator += weight;
    numerator += weight * factor;
  }

  if (denominator <= 0) {
    return 0;
  }

  return roundScore((numerator / denominator) * 100);
}

export function computeFrameworkScores(rows: ScoreItemRow[]): FrameworkScore[] {
  const grouped = new Map<string, ScoreItemRow[]>();

  for (const row of rows) {
    const key = row.control.frameworkId;
    const list = grouped.get(key) ?? [];
    list.push(row);
    grouped.set(key, list);
  }

  const scores: FrameworkScore[] = [];

  for (const group of grouped.values()) {
    const framework = group[0].control.framework;
    scores.push({
      frameworkId: framework.id,
      frameworkCode: framework.code,
      frameworkName: framework.name,
      score: computeOverallScore(group),
    });
  }

  scores.sort((a, b) => a.frameworkCode.localeCompare(b.frameworkCode));

  return scores;
}

async function fetchScoreRows(
  assessmentId: string,
  db: ScoreQueryExecutor,
): Promise<ScoreItemRow[]> {
  return await db.assessmentItem.findMany({
    where: {
      assessmentId,
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
        },
      },
    },
  });
}

export async function recalculateAssessmentScore(
  assessmentId: string,
  db: ScoreQueryExecutor = prisma,
): Promise<AssessmentScoreResult> {
  const rows = await fetchScoreRows(assessmentId, db);
  const score = computeOverallScore(rows);
  const frameworkScores = computeFrameworkScores(rows);

  const updated = await db.assessment.updateMany({
    where: { id: assessmentId },
    data: { score },
  });

  if (updated.count === 0) {
    throw new Error("404: Assessment not found");
  }

  return {
    assessmentId,
    score,
    frameworkScores,
  };
}

export async function getFrameworkScoresForAssessment(
  assessmentId: string,
  db: ScoreQueryExecutor = prisma,
): Promise<FrameworkScore[]> {
  const rows = await fetchScoreRows(assessmentId, db);
  return computeFrameworkScores(rows);
}
