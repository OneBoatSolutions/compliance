# Database Query Patterns and Performance

## Scope

This document covers current runtime database query paths only. It excludes forecasted dashboard/reporting queries to avoid premature indexing.

## NFR-PERF-005 Targets

- Simple queries: < 50ms
- Complex queries: < 200ms
- Assessment score recalculation: < 100ms

## Runtime Query Inventory

### 1) Authentication user lookup (simple)

- File: app/api/auth/login/route.ts
- Query shape: User by unique email
- Prisma pattern: findUnique({ where: { email } })
- Index coverage: users.email unique index

### 2) Organization read/update ownership check (simple)

- File: app/api/organizations/[id]/route.ts
- Query shape: Organization by id, then userId authorization check
- Prisma pattern: findUnique({ where: { id }, select: ... })
- Index coverage: organizations.id primary key

### 3) Assessment ownership check before score recalculation (simple)

- File: app/api/assessments/[id]/score/route.ts
- Query shape: Assessment by id + userId
- Prisma pattern: findFirst({ where: { id, userId }, select: { id: true } })
- Index coverage: assessments.id primary key

### 4) Assessment item ownership check before item update (complex)

- File: app/api/assessments/[id]/items/[itemId]/route.ts
- Query shape: assessment_items + assessments join with user ownership
- Prisma pattern:
  - findFirst({ where: { id, assessmentId, assessment: { userId } }, select: { ... } })
- Index coverage:
  - assessment_items.id primary key
  - assessment_items.assessmentId index
  - assessments.id primary key

### 5) Assessment score recalculation (complex + score SLA)

- File: lib/assessment-score.ts
- Query shape: CTE + aggregation + update in a single SQL statement
- SQL shape:
  - Join assessment_items to controls by controlId
  - Aggregate numerator/denominator
  - Update assessments.score atomically
- Index coverage:
  - assessment_items.assessmentId
  - controls.id primary key

## N+1 Review Summary

No runtime N+1 loops were found in API routes.

The score path is already optimized as one SQL statement instead of per-item queries.

The primary runtime fix applied was query-shape optimization in organization handlers to avoid over-fetching during ownership checks.

## Composite Indexes Added (Runtime-Critical Only)

### assessments_userId_createdAt_desc_idx

- Table: assessments
- Columns: (userId, createdAt DESC)
- Why now:
  - Supports current latest-assessment lookups used by performance baseline and runtime ownership-oriented flows.

### assessment_items_assessmentId_status_idx

- Table: assessment_items
- Columns: (assessmentId, status)
- Why now:
  - Supports current assessment item status scans in update and scoring-adjacent operations.

## Automated Performance Validation

### Command

- pnpm test:perf:db

### What it does

- Connects to DATABASE_URL_UNPOOLED (fallback DATABASE_URL)
- Uses EXPLAIN (ANALYZE, FORMAT JSON) for each query case
- Runs warm-up, then repeated measured runs
- Enforces NFR-PERF-005 thresholds on p95 execution time
- Fails with non-zero exit if any threshold is exceeded

### Query buckets enforced

- simple_user_by_email
- simple_organization_by_id
- complex_assessment_item_ownership_lookup
- complex_items_controls_join
- score_recalculation_cte_update

### Latest execution evidence

- Date: 2026-03-29
- Status: PASS (all automated query buckets met NFR-PERF-005 thresholds)
- Automated p95 results:
  - simple_user_by_email: 0.05ms
  - simple_organization_by_id: 0.08ms
  - complex_assessment_item_ownership_lookup: 0.05ms
  - complex_items_controls_join: 0.25ms
  - score_recalculation_cte_update: 0.29ms
- Manual EXPLAIN ANALYZE review also completed for complex query plans and score recalculation path
- Manual key execution times:
  - Complex query #1 (items + controls join): 0.344ms
  - Complex query #2 (nested relation filter): 0.155ms
  - Simple query #1 (user by email): 0.034ms
  - Simple query #2 (organization lookup): 1.016ms
  - Score recalculation query: 0.444ms
- Note: Full raw EXPLAIN outputs were reviewed during validation; include terminal artifacts in PR comments if required by your process.

## Manual EXPLAIN ANALYZE Procedure

Manual query-plan inspection remains required for human review and sign-off.

### Baseline SQL file

- scripts/perf/prisma-baseline.sql

### Suggested manual workflow

1. Ensure DB is migrated and seeded.
2. Run each EXPLAIN ANALYZE query multiple times.
3. Ignore first run (cache warm-up).
4. Record p50/p95 and check target thresholds.
5. Confirm index scans are used where expected and investigate unexpected seq scans.

## Notes

- Keep index additions tied to observed runtime bottlenecks.
- Do not add forecasted/reporting indexes unless they become active runtime query patterns and fail performance checks.
