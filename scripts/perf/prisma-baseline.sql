-- Prisma performance baseline suite
-- Run in PostgreSQL console. These statements are safe to re-run.
-- Write-path probes are wrapped in BEGIN/ROLLBACK to avoid persistence.

-- 0) Optional: helpful planner context
SHOW server_version;
SHOW shared_buffers;
SHOW work_mem;

-- 1) Complex read baseline: assessment items + control join
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT
  ai.id,
  ai."assessmentId",
  ai."controlId",
  ai.status,
  ai.comments,
  ai."owner",
  ai."targetDate",
  ai.remarks,
  ai."evidenceNotes",
  ai."createdAt",
  ai."updatedAt",
  c.weight,
  c."isGateway"
FROM "assessment_items" ai
JOIN "controls" c ON c.id = ai."controlId"
WHERE ai."assessmentId" = (
  SELECT a.id
  FROM "assessments" a
  JOIN "users" u ON u.id = a."userId"
  WHERE u.email = 'user@test.com'
  ORDER BY a."createdAt" DESC
  LIMIT 1
);

-- 2) Complex read baseline: nested relation filter
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT ai.*
FROM "assessment_items" ai
JOIN "controls" c ON c.id = ai."controlId"
WHERE ai."assessmentId" = (
  SELECT a.id
  FROM "assessments" a
  JOIN "users" u ON u.id = a."userId"
  WHERE u.email = 'user@test.com'
  ORDER BY a."createdAt" DESC
  LIMIT 1
)
AND c.code = 'HIPAA-308-A1'
LIMIT 1;

-- 3) Seed hotspot write baseline: control upsert shape (non-persistent)
BEGIN;
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
INSERT INTO "controls" (
  "id",
  "frameworkId",
  "code",
  "title",
  "description",
  "category",
  "severity",
  "weight",
  "metadata",
  "isGateway",
  "updatedAt"
)
VALUES (
  'perf_probe_control_gdpr',
  (SELECT id FROM "frameworks" WHERE code = 'GDPR' LIMIT 1),
  'GDPR-PERF-PROBE',
  'Perf Probe Control',
  'Baseline probe row for explain analyze',
  'Governance',
  'MEDIUM'::"Severity",
  1.0,
  NULL,
  FALSE,
  NOW()
)
ON CONFLICT ("frameworkId", "code")
DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "category" = EXCLUDED."category",
  "severity" = EXCLUDED."severity",
  "weight" = EXCLUDED."weight",
  "metadata" = EXCLUDED."metadata",
  "isGateway" = EXCLUDED."isGateway",
  "updatedAt" = NOW();
ROLLBACK;

-- 4) Seed hotspot write baseline: assessment item upsert shape (non-persistent)
BEGIN;
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
INSERT INTO "assessment_items" (
  "id",
  "assessmentId",
  "controlId",
  "status",
  "comments",
  "evidenceNotes",
  "updatedAt"
)
VALUES (
  'perf_probe_assessment_item',
  (
    SELECT a.id
    FROM "assessments" a
    JOIN "users" u ON u.id = a."userId"
    WHERE u.email = 'user@test.com'
    ORDER BY a."createdAt" DESC
    LIMIT 1
  ),
  (SELECT id FROM "controls" WHERE code = 'HIPAA-308-A1' LIMIT 1),
  'PARTIALLY_COMPLIANT'::"ItemStatus",
  'perf baseline comment',
  'perf baseline evidence',
  NOW()
)
ON CONFLICT ("assessmentId", "controlId")
DO UPDATE SET
  "status" = EXCLUDED."status",
  "comments" = EXCLUDED."comments",
  "evidenceNotes" = EXCLUDED."evidenceNotes",
  "updatedAt" = NOW();
ROLLBACK;

-- 5) Seed hotspot write baseline: dependency upsert shape (non-persistent)
BEGIN;
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
INSERT INTO "control_dependencies" (
  "id",
  "parentControlId",
  "childControlId",
  "triggerValue",
  "effect"
)
VALUES (
  'perf_probe_dependency',
  (SELECT id FROM "controls" WHERE code = 'GDPR-GW-ENC' LIMIT 1),
  (SELECT id FROM "controls" WHERE code = 'GDPR-P2.0' LIMIT 1),
  'NO',
  'NOT_APPLICABLE'
)
ON CONFLICT ("parentControlId", "childControlId")
DO UPDATE SET
  "triggerValue" = EXCLUDED."triggerValue",
  "effect" = EXCLUDED."effect";
ROLLBACK;

-- 6) Simple-query baselines for NFR-PERF-005 comparison
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT u.id, u.email, u.name, u.role
FROM "users" u
WHERE u.email = 'user@test.com'
LIMIT 1;

EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT o.*
FROM "organizations" o
WHERE o.id = (
  SELECT id
  FROM "organizations"
  ORDER BY "createdAt" DESC
  LIMIT 1
)
LIMIT 1;

-- 7) Assessment score recalculation SLA baseline (target < 100ms)
BEGIN;
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
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
  WHERE ai."assessmentId" = (
    SELECT a.id
    FROM "assessments" a
    JOIN "users" u ON u.id = a."userId"
    WHERE u.email = 'user@test.com'
    ORDER BY a."createdAt" DESC
    LIMIT 1
  )
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
  WHERE a.id = (
    SELECT a2.id
    FROM "assessments" a2
    JOIN "users" u2 ON u2.id = a2."userId"
    WHERE u2.email = 'user@test.com'
    ORDER BY a2."createdAt" DESC
    LIMIT 1
  )
  RETURNING a.id, a."score"
)
SELECT u.id, u."score", t.numerator, t.denominator
FROM updated u
CROSS JOIN totals t;
ROLLBACK;

-- Suggested process:
-- 1) Execute each statement 10 times.
-- 2) Ignore first run for cache warm-up.
-- 3) Track p50/p95.
-- Targets (NFR-PERF-005):
-- - Simple queries: < 50ms
-- - Complex queries: < 200ms
-- - Assessment score recalculation: < 100ms
