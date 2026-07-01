# Changelog

All notable changes to the **AI-Assured Compliance Dashboard** will be documented in this file.

---

## [1.0.0] - 2026-07-02

This is the initial production release of the **AI-Assured Compliance Dashboard** (`v1.0.0`), representing the consolidation of Sprints 0 through 10. The platform delivers an end-to-end, automated, and secure compliance discovery, assessment, remediation, and audit-ready reporting engine.

### Functional Release Summary

#### 1. Core Platform Engine

- **User Authentication**: JWT-based session state management utilizing NextAuth.js credentials provider with bcrypt password hashing.
- **Organization Workspace Onboarding**: Self-service profile onboarding wizard mapping operational metrics (regions, target customer profiles, services, data types handled).
- **Responsive Dashboard UI**: Real-time overview of compliance metrics, active assessment status logs, and organizational progress charts.

#### 2. AI Framework Engine

- **Automated Framework Mapping**: Dynamic mapping algorithm scanning organization profiles to match regulatory frameworks (GDPR, HIPAA, PCI-DSS) via Vercel AI SDK (with 10-second timeout fallbacks).
- **Intelligent Remediation Plans**: AI-generated step-by-step roadmaps including required policies, technical controls, estimated hours, priorities, and assigned task owners.

#### 3. Assessment & Control Workspace

- **Interactive Checklist**: Dynamic status updates (`COMPLIANT`, `PARTIALLY_COMPLIANT`, `NOT_COMPLIANT`, `NOT_APPLICABLE`, `NOT_STARTED`) on control requirements.
- **Recalculation Transaction**: Atomic database trigger calculating weighted assessment scores (0-100) on control updates.
- **Collaboration System**: Threaded comments history, timeline audit trail, and previous/next navigation loop.

#### 4. Evidence Upload Vault

- **Multipart Secure Upload**: Upload validation checks enforcing 10MB limits, strict extension checks, magic-bytes content verification, text/CSV formula injection neutralization, and ClamAV threat scans.
- **Pre-Signed URLs**: Pre-signed AWS S3 / MinIO object storage URLs providing secure download links with 7-day TTL settings.

#### 5. Analytics & Reporting Pipeline

- **Comprehensive Metrics Web View**: Interactive audit reports containing heatmap matrices, completion ratios, findings summaries, and critical risk alerts.
- **Native Print Styles**: Tailored CSS print configurations enabling seamless, browser-native print-to-PDF reports generation.

#### 6. Admin Command Portal

- **Framework Metadata Controls**: Admin access dashboard for creating, modifying, archiving, and publishing compliance frameworks.
- **Bulk CSV Import**: Bulk control creator uploading CSV files directly into draft frameworks with validator check logs.

---

### Sprint History & Milestones

#### Sprint 0 — Project Bootstrap & Environment Setup

- Initialized Next.js app, strict TypeScript settings, Husky pre-commit hooks, and Tailwind CSS styles.
- Constructed PostgreSQL relational database schema via Prisma.
- Created local backing services configurations (PostgreSQL, Redis, MinIO) in Docker Compose.

#### Sprint 1 — Authentication & Layout

- Configured NextAuth.js JWT credential sessions.
- Implemented global layout shell with responsive sidebar.

#### Sprint 2 — Dashboard & Organization Onboarding

- Built organization profile collection wizard and data schemas.
- Constructed user landing dashboard summarizing active metrics.

#### Sprint 3 — AI Framework Mapping & Framework Selection

- Integrated Vercel AI SDK mapping algorithms and selection forms.
- Enabled matching operational criteria (regions, data handled) to frameworks.

#### Sprint 4 — Assessment Checklist & Control Workspace

- Implemented evaluation checklist grid.
- Added timeline logs, comments threads, and previous/next workspace navigation controls.

#### Sprint 5 — AI Remediation & Evidence Upload

- Developed AI remediation checklist generator.
- Integrated AWS S3 and MinIO upload pipelines with magic-bytes file verification.

#### Sprint 6 — Reporting & Analytics

- Created unified view report data endpoint `/api/reports/[assessmentId]/view`.
- Configured tailwind print directives to support browser-native PDF print generations.

#### Sprint 7 — Admin Portal

- Built administrative panels for CRUD frameworks and controls.
- Developed CSV bulk importing parser with row-by-row validation logs.

#### Sprint 8 — Polish, Testing & Performance

- Added Vitest unit tests and Playwright E2E suites.
- Analyzed Neon DB query plans using automated EXPLAIN ANALYZE checks to satisfy NFR-PERF-005.

#### Sprint 9 — Security Hardening & Monitoring

- Implemented sliding-window Redis rate limiters and volumetric lockout triggers.
- Hardened Content-Security-Policy (CSP) headers inside middleware layers.
- Linked Sentry telemetry error reporting.

#### Sprint 10 — Technical Documentation & Production Launch

- Compiled production API specifications (`docs/API.md`) and database dictionaries (`docs/DATABASE.md`).
- Created operational deployment guides (`docs/DEPLOYMENT.md`) and refined developer onboarding (`README.md`).
- Synthesized repository changelog history (`CHANGELOG.md`).
