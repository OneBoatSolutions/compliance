import { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface AssessmentScoreRow {
  id: string;
  score: number | null;
  numerator: number;
  denominator: number;
}

export interface AssessmentScoreResult {
  assessmentId: string;
  score: number;
  numerator: number;
  denominator: number;
}

type ScoreQueryExecutor = PrismaClient | Prisma.TransactionClient;

export async function recalculateAssessmentScore(
  assessmentId: string,
  db: ScoreQueryExecutor = prisma,
): Promise<AssessmentScoreResult> {
  const rows = await db.$queryRaw<AssessmentScoreRow[]>(Prisma.sql`
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
          WHEN t.denominator > 0 THEN (t.numerator / t.denominator) * 100
          ELSE 0
        END,
        "updatedAt" = NOW()
      FROM totals t
      WHERE a.id = ${assessmentId}
      RETURNING a.id, a."score"
    )
    SELECT
      u.id,
      u."score",
      t.numerator,
      t.denominator
    FROM updated u
    CROSS JOIN totals t
  `);

  if (rows.length === 0) {
    throw new Error("404: Assessment not found");
  }

  const row = rows[0];

  return {
    assessmentId: row.id,
    score: Number(row.score ?? 0),
    numerator: Number(row.numerator),
    denominator: Number(row.denominator),
  };
}
