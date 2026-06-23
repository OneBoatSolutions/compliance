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
  let score: number;
  let frameworkScores: FrameworkScore[] = [];

  if (db === prisma && typeof (db as PrismaClient).$queryRaw === "function") {
    const results = (await (db as PrismaClient).$queryRaw`
      WITH totals AS (
        SELECT
          COALESCE(
            SUM(
              CASE
                WHEN ai.status <> 'NOT_APPLICABLE'::"ItemStatus" AND c."isGateway" = FALSE THEN c.weight
                ELSE 0
              END
            ),
            0
          )::double precision AS denominator,
          COALESCE(
            SUM(
              CASE
                WHEN c."isGateway" = FALSE AND ai.status = 'COMPLIANT'::"ItemStatus" THEN c.weight
                WHEN c."isGateway" = FALSE AND ai.status = 'PARTIALLY_COMPLIANT'::"ItemStatus" THEN c.weight * 0.5
                ELSE 0
              END
            ),
            0
          )::double precision AS numerator
        FROM "assessment_items" ai
        JOIN "controls" c ON c.id = ai."controlId"
        WHERE ai."assessmentId" = ${assessmentId}
      ),
      updated AS (
        UPDATE "assessments" a
        SET
          "score" = CASE
            WHEN t.denominator > 0 THEN ROUND(((t.numerator / t.denominator) * 100)::numeric, 1)::double precision
            ELSE 0
          END,
          "updatedAt" = NOW()
        FROM totals t
        WHERE a.id = ${assessmentId}
        RETURNING a.id, a."score"
      )
      SELECT u.id, u."score", t.numerator, t.denominator
      FROM updated u
      CROSS JOIN totals t`) as Array<{
      id: string;
      score: number;
      numerator: number;
      denominator: number;
    }>;

    if (!results || results.length === 0) {
      throw new Error("404: Assessment not found");
    }

    score = roundScore(results[0].score);
    if (
      db.assessmentItem &&
      typeof (db.assessmentItem as unknown as { findMany: unknown }).findMany === "function"
    ) {
      const rows = await fetchScoreRows(assessmentId, db);
      frameworkScores = computeFrameworkScores(rows);
    }
  } else {
    const rows = await fetchScoreRows(assessmentId, db);
    score = computeOverallScore(rows);
    frameworkScores = computeFrameworkScores(rows);

    const updated = await db.assessment.updateMany({
      where: { id: assessmentId },
      data: { score },
    });

    if (updated.count === 0) {
      throw new Error("404: Assessment not found");
    }
  }

  const scoreLogClient = db as unknown as {
    assessmentScoreLog?: {
      create: (args: unknown) => Promise<unknown>;
    };
  };

  if (
    scoreLogClient.assessmentScoreLog &&
    typeof scoreLogClient.assessmentScoreLog.create === "function"
  ) {
    await scoreLogClient.assessmentScoreLog.create({
      data: {
        assessmentId,
        overallScore: score,
        frameworkScores: frameworkScores.map((framework) => ({
          frameworkId: framework.frameworkId,
          frameworkCode: framework.frameworkCode,
          frameworkName: framework.frameworkName,
          score: framework.score,
        })),
      },
    });
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
