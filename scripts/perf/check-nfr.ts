import "dotenv/config";

import { Client } from "pg";

type Bucket = "simple" | "complex" | "score";

interface Thresholds {
  simple: number;
  complex: number;
  score: number;
}

interface QueryCase {
  name: string;
  bucket: Bucket;
  sql: string;
  params: unknown[];
  rollbackAfterRun?: boolean;
}

interface Measurement {
  name: string;
  bucket: Bucket;
  runs: number[];
  p50: number;
  p95: number;
  max: number;
  thresholdMs: number;
  pass: boolean;
}

interface FixtureRow {
  userId: string;
  assessmentId: string;
  assessmentItemId: string;
  organizationId: string;
}

const runsPerQuery = 10;
const warmupRuns = 1;

const thresholdsMs: Thresholds = {
  simple: 50,
  complex: 200,
  score: 100,
};

function writeStdoutLine(message: string) {
  process.stdout.write(`${message}\n`);
}

function writeStderrLine(message: string) {
  process.stderr.write(`${message}\n`);
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  const boundedIndex = Math.max(0, Math.min(index, sorted.length - 1));
  return sorted[boundedIndex];
}

async function explainExecutionTimeMs(
  client: Client,
  sql: string,
  params: unknown[],
  rollbackAfterRun = false,
): Promise<number> {
  if (rollbackAfterRun) {
    await client.query("BEGIN");
  }

  try {
    const result = await client.query<{ "QUERY PLAN": Array<Record<string, unknown>> }>({
      text: `EXPLAIN (ANALYZE, FORMAT JSON) ${sql}`,
      values: params,
    });

    const planEntry = result.rows[0]?.["QUERY PLAN"]?.[0];
    const executionTime = planEntry?.["Execution Time"];

    if (typeof executionTime !== "number") {
      throw new Error(`Missing EXPLAIN execution time for query: ${sql.slice(0, 60)}...`);
    }

    return executionTime;
  } finally {
    if (rollbackAfterRun) {
      await client.query("ROLLBACK");
    }
  }
}

async function collectMeasurement(client: Client, queryCase: QueryCase): Promise<Measurement> {
  for (let i = 0; i < warmupRuns; i += 1) {
    await explainExecutionTimeMs(
      client,
      queryCase.sql,
      queryCase.params,
      Boolean(queryCase.rollbackAfterRun),
    );
  }

  const runs: number[] = [];
  for (let i = 0; i < runsPerQuery; i += 1) {
    const duration = await explainExecutionTimeMs(
      client,
      queryCase.sql,
      queryCase.params,
      Boolean(queryCase.rollbackAfterRun),
    );
    runs.push(duration);
  }

  const p50 = percentile(runs, 50);
  const p95 = percentile(runs, 95);
  const max = Math.max(...runs);
  const thresholdMs = thresholdsMs[queryCase.bucket];

  return {
    name: queryCase.name,
    bucket: queryCase.bucket,
    runs,
    p50,
    p95,
    max,
    thresholdMs,
    pass: p95 < thresholdMs,
  };
}

async function loadFixture(client: Client): Promise<FixtureRow> {
  const fixture = await client.query<FixtureRow>(`
    SELECT
      u.id AS "userId",
      a.id AS "assessmentId",
      ai.id AS "assessmentItemId",
      o.id AS "organizationId"
    FROM "users" u
    JOIN "assessments" a ON a."userId" = u.id
    JOIN "assessment_items" ai ON ai."assessmentId" = a.id
    JOIN "organizations" o ON o.id = a."organizationId"
    WHERE u.email = 'user@test.com'
    ORDER BY a."createdAt" DESC, ai."createdAt" DESC
    LIMIT 1
  `);

  if (!fixture.rows[0]) {
    throw new Error(
      "No perf fixture data found. Seed the database first (pnpm prisma db seed), then rerun this check.",
    );
  }

  return fixture.rows[0];
}

function printSummary(measurements: Measurement[]) {
  writeStdoutLine("\nNFR-PERF-005 automated DB performance summary");
  writeStdoutLine("------------------------------------------------");

  for (const item of measurements) {
    const status = item.pass ? "PASS" : "FAIL";
    writeStdoutLine(
      `${status} | ${item.name} | bucket=${item.bucket} | p50=${item.p50.toFixed(2)}ms | p95=${item.p95.toFixed(2)}ms | max=${item.max.toFixed(2)}ms | threshold<${item.thresholdMs}ms`,
    );
  }

  writeStdoutLine("------------------------------------------------\n");
}

async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set.");
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const fixture = await loadFixture(client);

    const queryCases: QueryCase[] = [
      {
        name: "simple_user_by_email",
        bucket: "simple",
        sql: `
          SELECT u.id, u.email, u.name, u.role
          FROM "users" u
          WHERE u.email = $1
          LIMIT 1
        `,
        params: ["user@test.com"],
      },
      {
        name: "simple_organization_by_id",
        bucket: "simple",
        sql: `
          SELECT o.id, o."userId", o."updatedAt"
          FROM "organizations" o
          WHERE o.id = $1
          LIMIT 1
        `,
        params: [fixture.organizationId],
      },
      {
        name: "complex_assessment_item_ownership_lookup",
        bucket: "complex",
        sql: `
          SELECT ai.id
          FROM "assessment_items" ai
          JOIN "assessments" a ON a.id = ai."assessmentId"
          WHERE ai.id = $1
            AND ai."assessmentId" = $2
            AND a."userId" = $3
          LIMIT 1
        `,
        params: [fixture.assessmentItemId, fixture.assessmentId, fixture.userId],
      },
      {
        name: "complex_items_controls_join",
        bucket: "complex",
        sql: `
          SELECT ai.id, ai.status, c.weight, c."isGateway"
          FROM "assessment_items" ai
          JOIN "controls" c ON c.id = ai."controlId"
          WHERE ai."assessmentId" = $1
        `,
        params: [fixture.assessmentId],
      },
      {
        name: "score_recalculation_cte_update",
        bucket: "score",
        sql: `
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
            WHERE ai."assessmentId" = $1
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
            WHERE a.id = $1
            RETURNING a.id, a."score"
          )
          SELECT u.id, u."score", t.numerator, t.denominator
          FROM updated u
          CROSS JOIN totals t
        `,
        params: [fixture.assessmentId],
        rollbackAfterRun: true,
      },
    ];

    const measurements: Measurement[] = [];
    for (const queryCase of queryCases) {
      const result = await collectMeasurement(client, queryCase);
      measurements.push(result);
    }

    printSummary(measurements);

    const failures = measurements.filter((item) => !item.pass);
    if (failures.length > 0) {
      const failingNames = failures.map((item) => item.name).join(", ");
      throw new Error(`NFR-PERF-005 failed for: ${failingNames}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  writeStderrLine(`DB performance check failed: ${errorMessage}`);
  process.exit(1);
});
