/**
 * @module app/api/controls
 *
 * Architecture note — why there is no top-level GET /api/controls list endpoint:
 *
 * Controls in this application are ALWAYS scoped to a framework:
 *   - Admin list + CRUD:  GET/POST/PATCH/DELETE /api/frameworks/[id]/controls
 *   - User checklist:     GET /api/assessments/[id]/checklist  (returns items with controls embedded)
 *   - Control detail:     GET /api/controls/[id]/details        (existing — used by ControlWorkspace)
 *
 * A cross-framework flat list of all controls has no consumer in the frontend and would
 * return an unbounded result set (potentially thousands of rows) without a framework filter.
 *
 * If a future feature (e.g. a global control search / control library browser) requires
 * listing controls across frameworks, add GET /api/controls/route.ts at that point with:
 *   - Required `frameworkId` query param (or explicit pagination + framework filter)
 *   - Prisma select limited to: id, frameworkId, code, title, category, severity
 *   - unstable_cache with tags: ["controls"]
 */

export {};
