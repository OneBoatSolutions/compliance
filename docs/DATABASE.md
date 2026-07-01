# AI-Assured Compliance Dashboard Database Documentation

This document describes the persistence layer of the **AI-Assured Compliance Dashboard** based on the ground truth of `prisma/schema.prisma`.

---

## 1. Database Architecture & Schema Map

The project utilizes a Serverless PostgreSQL database (Neon in production, local Docker instance in development). Database connections are split into two separate paths:

1.  **Pooled connection**: Managed via `DATABASE_URL` (using PgBouncer connection pooler) for serverless API transactions.
2.  **Unpooled/Direct connection**: Managed via `DATABASE_URL_UNPOOLED` for administrative operations, seeding, and migrations.

---

## 2. Entity-Relationship (ER) Diagram

Below is the logical entity relationship diagram showing the tables, primary/foreign keys, and cardinalities:

```mermaid
erDiagram
    users {
        string id PK
        string email UK
        string name
        string password
        enum role
        boolean isActive
        datetime emailVerified
        datetime lastLoginAt
        datetime createdAt
        datetime updatedAt
    }

    password_reset_tokens {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        datetime usedAt
        datetime invalidatedAt
        datetime createdAt
    }

    organizations {
        string id PK
        string userId FK
        string name
        string productName
        string description
        string services
        string targetCustomers
        string problemSolved
        string_array dataHandled
        string_array regions
        datetime createdAt
        datetime updatedAt
    }

    frameworks {
        string id PK
        string code UK
        string name
        string description
        string region
        string category
        string version
        datetime effectiveDate
        string sourceLink
        enum status
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    controls {
        string id PK
        string frameworkId FK
        string code
        string title
        string description
        string category
        enum severity
        float weight
        json metadata
        boolean isGateway
        datetime createdAt
        datetime updatedAt
    }

    assessments {
        string id PK
        string userId FK
        string organizationId FK
        enum status
        float score
        datetime completedAt
        datetime createdAt
        datetime updatedAt
    }

    assessment_items {
        string id PK
        string assessmentId FK
        string controlId FK
        enum status
        string comments
        string owner
        datetime targetDate
        string remarks
        string evidenceNotes
        datetime createdAt
        datetime updatedAt
    }

    assessment_score_logs {
        string id PK
        string assessmentId FK
        float overallScore
        json frameworkScores
        datetime createdAt
    }

    control_dependencies {
        string id PK
        string parentControlId FK
        string childControlId FK
        string triggerValue
        string effect
    }

    evidence {
        string id PK
        string assessmentItemId FK
        string userId
        string filename
        string originalName
        string fileUrl
        int fileSize
        string mimeType
        string description
        datetime uploadedAt
    }

    comments {
        string id PK
        string assessmentItemId FK
        string userId
        string userName
        string content
        datetime createdAt
    }

    reports {
        string id PK
        string assessmentId FK
        enum type
        enum format
        string fileUrl
        datetime generatedAt
    }

    remediation_plans {
        string id PK
        string assessmentId FK
        string assessmentItemId FK UK
        string controlId FK
        string userId FK
        string title
        string summary
        enum status
        string_array policies
        string_array technicalControls
        datetime generatedAt
        datetime createdAt
        datetime updatedAt
    }

    remediation_steps {
        string id PK
        string planId FK
        string title
        string description
        string priority
        string owner
        int estimatedHours
        enum status
        int sortOrder
        datetime completedAt
        datetime createdAt
        datetime updatedAt
    }

    ai_interactions {
        string id PK
        string assessmentId FK
        enum type
        string input
        string output
        string model
        int tokensUsed
        int durationMs
        datetime createdAt
    }

    users ||--o{ password_reset_tokens : "requests"
    users ||--o{ organizations : "owns"
    users ||--o{ assessments : "performs"
    users ||--o{ remediation_plans : "manages"
    organizations ||--o{ assessments : "undergoes"
    frameworks ||--o{ controls : "contains"
    controls ||--o{ assessment_items : "evaluated_in"
    controls ||--o{ remediation_plans : "remediates"
    controls ||--o{ control_dependencies : "acts_as_parent"
    controls ||--o{ control_dependencies : "acts_as_child"
    assessments ||--o{ assessment_items : "contains"
    assessments ||--o{ reports : "generates"
    assessments ||--o{ ai_interactions : "uses"
    assessments ||--o{ assessment_score_logs : "records_score"
    assessments ||--o{ remediation_plans : "includes_plans"
    assessment_items ||--o{ evidence : "collects"
    assessment_items ||--o{ comments : "discusses"
    assessment_items ||--o| remediation_plans : "targets"
    remediation_plans ||--o{ remediation_steps : "comprises"
```

---

## 3. Data Dictionary

### 3.1 Table: `users`

Tracks individual user authentication profiles and administrative roles.

- **Mapped Name**: `users`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `email` (String): Unique user email.
  - `name` (String): Full name of the user.
  - `password` (String): Bcrypt-hashed password.
  - `role` (Enum `Role`): Current access role (`USER` or `ADMIN`, default `USER`).
  - `isActive` (Boolean): User account active state (default `true`).
  - `emailVerified` (DateTime / Nullable): Verification timestamp.
  - `lastLoginAt` (DateTime / Nullable): Last login tracking.
  - `createdAt` (DateTime): Record creation date.
  - `updatedAt` (DateTime): Auto-updated timestamp.
- **Indexes**:
  - `users_email_key` (Unique index on `email`)
  - `users_role_idx` (Index on `role`)
  - `users_isActive_idx` (Index on `isActive`)

---

### 3.2 Table: `password_reset_tokens`

Manages password reset verification challenges.

- **Mapped Name**: `password_reset_tokens`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `token` (String): Unique SHA-256 hashed token value.
  - `userId` (String / cuid): Foreign key referencing `users.id`. Cascade delete.
  - `expiresAt` (DateTime): Token expiration date.
  - `usedAt` (DateTime / Nullable): Timestamp when the token was consumed.
  - `invalidatedAt` (DateTime / Nullable): Timestamp when the token was revoked.
  - `createdAt` (DateTime): Token generation timestamp.
- **Indexes**:
  - `password_reset_tokens_token_key` (Unique index on `token`)
  - `password_reset_tokens_userId_idx` (Index on `userId`)
  - `password_reset_tokens_expiresAt_idx` (Index on `expiresAt`)
  - Composite index on `[userId, usedAt, invalidatedAt, expiresAt]`

---

### 3.3 Table: `organizations`

Workspace business profile data filled during the onboarding pipeline.

- **Mapped Name**: `organizations`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `userId` (String): Foreign key referencing `users.id` (Profile Owner).
  - `name` (String): Company name.
  - `productName` (String / Nullable): Core product name.
  - `description` (String / Nullable): Business description.
  - `services` (String / Nullable): Provided services catalog.
  - `targetCustomers` (String / Nullable): Target customer profile.
  - `problemSolved` (String / Nullable): Problem description.
  - `dataHandled` (String[]): Text array of target data types handled.
  - `regions` (String[]): Text array of operational target regions.
  - `createdAt` (DateTime): Creation date.
  - `updatedAt` (DateTime): Last modification date.
- **Indexes**:
  - `organizations_userId_idx` (Index on `userId`)
  - `organizations_name_idx` (Index on `name`)
  - `organizations_createdAt_idx` (Index on `createdAt`)

---

### 3.4 Table: `frameworks`

Regulatory and compliance standards definitions (e.g. GDPR, HIPAA).

- **Mapped Name**: `frameworks`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `code` (String): Unique string code (e.g. `GDPR`).
  - `name` (String): Full framework title name.
  - `description` (String): Comprehensive descriptive notes.
  - `region` (String): Jurisdiction location (e.g., Global, EU, US).
  - `category` (String): Industrial vertical.
  - `version` (String): Standard version label (semver format).
  - `effectiveDate` (DateTime): Operational date.
  - `sourceLink` (String / Nullable): Official URL.
  - `status` (Enum `FrameworkStatus`): State (`DRAFT`, `PUBLISHED`, `ARCHIVED`, default `DRAFT`).
  - `publishedAt` (DateTime / Nullable): Time when status transitioned to PUBLISHED.
  - `createdAt` (DateTime): Record creation date.
  - `updatedAt` (DateTime): Record update date.
- **Indexes**:
  - `frameworks_code_key` (Unique index on `code`)
  - `frameworks_region_idx` (Index on `region`)
  - `frameworks_category_idx` (Index on `category`)
  - `frameworks_status_idx` (Index on `status`)

---

### 3.5 Table: `controls`

Evaluated control requirements mapped inside frameworks.

- **Mapped Name**: `controls`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `frameworkId` (String): Foreign key referencing `frameworks.id`. Cascade delete.
  - `code` (String): Control code, unique per framework (e.g., `GDPR-7.1`).
  - `title` (String): Control title.
  - `description` (String): Detailed compliance requirements.
  - `category` (String / Nullable): Logical grouping domain.
  - `severity` (Enum `Severity`): Severity level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`, default `MEDIUM`).
  - `weight` (Float): Scoring multiplier weight (range 0.1 to 10.0, default 1.0).
  - `metadata` (Json / Nullable): Metadata store payload.
  - `isGateway` (Boolean): Flag representing if control dictates sub-control state (default `false`).
  - `createdAt` (DateTime): Record creation date.
  - `updatedAt` (DateTime): Record update date.
- **Indexes**:
  - `controls_frameworkId_code_key` (Unique constraint composite on `[frameworkId, code]`)
  - `controls_frameworkId_idx` (Index on `frameworkId`)
  - `controls_severity_idx` (Index on `severity`)
  - `controls_frameworkId_severity_idx` (Composite index on `[frameworkId, severity]`)

---

### 3.6 Table: `assessments`

Master checklists evaluations instantiated for an organization workspace.

- **Mapped Name**: `assessments`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `userId` (String): Foreign key referencing `users.id` (Creator).
  - `organizationId` (String): Foreign key referencing `organizations.id`.
  - `status` (Enum `AssessmentStatus`): Evaluation state (`DRAFT`, `IN_PROGRESS`, `COMPLETED`, default `IN_PROGRESS`).
  - `score` (Float / Nullable): Overall weighted compliance score (0–100).
  - `completedAt` (DateTime / Nullable): Timestamp when marked completed.
  - `createdAt` (DateTime): Assessment creation date.
  - `updatedAt` (DateTime): Record update date.
- **Indexes**:
  - `assessments_userId_idx` (Index on `userId`)
  - `assessments_organizationId_idx` (Index on `organizationId`)
  - `assessments_status_idx` (Index on `status`)
  - `assessments_createdAt_idx` (Index on `createdAt`)
  - `assessments_userId_createdAt_desc_idx` (Composite sort index on `[userId, createdAt DESC]`)
  - `assessments_userId_organizationId_idx` (Composite index on `[userId, organizationId]`)

---

### 3.7 Table: `assessment_items`

Individual items checklist evaluating control compliance status.

- **Mapped Name**: `assessment_items`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentId` (String): Foreign key referencing `assessments.id`. Cascade delete.
  - `controlId` (String): Foreign key referencing `controls.id`.
  - `status` (Enum `ItemStatus`): Control evaluation tier (`NOT_STARTED`, `COMPLIANT`, `PARTIALLY_COMPLIANT`, `NOT_COMPLIANT`, `NOT_APPLICABLE`, default `NOT_STARTED`).
  - `comments` (String / Nullable): Assessment notes.
  - `owner` (String / Nullable): Assigned staff owner.
  - `targetDate` (DateTime / Nullable): Estimated completion date.
  - `remarks` (String / Nullable): Auditor general remarks.
  - `evidenceNotes` (String / Nullable): Description of validation evidence.
  - `createdAt` (DateTime): Record creation date.
  - `updatedAt` (DateTime): Record update date.
- **Indexes**:
  - `assessment_items_assessmentId_controlId_key` (Unique composite on `[assessmentId, controlId]`)
  - `assessment_items_assessmentId_idx` (Index on `assessmentId`)
  - `assessment_items_controlId_idx` (Index on `controlId`)
  - `assessment_items_status_idx` (Index on `status`)
  - `assessment_items_assessmentId_status_idx` (Composite index on `[assessmentId, status]`)
  - `assessment_items_assessmentId_status_controlId_idx` (Composite index on `[assessmentId, status, controlId]`)
  - `assessment_items_assessmentId_updatedAt_desc_idx` (Composite sort index on `[assessmentId, updatedAt DESC]`)

---

### 3.8 Table: `assessment_score_logs`

Historical compliance scoring snapshot records utilized for trend reporting graphs.

- **Mapped Name**: `assessment_score_logs`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentId` (String): Foreign key referencing `assessments.id`. Cascade delete.
  - `overallScore` (Float): Historical score snapshot.
  - `frameworkScores` (Json): JSON-array containing nested values: `[ { frameworkCode: "GDPR", score: 85 } ]`.
  - `createdAt` (DateTime): Log generation date.
- **Indexes**:
  - `assessment_score_logs_assessmentId_idx` (Index on `assessmentId`)
  - `assessment_score_logs_createdAt_idx` (Index on `createdAt`)
  - `assessment_score_logs_assessmentId_createdAt_desc_idx` (Composite sort index on `[assessmentId, createdAt DESC]`)

---

### 3.9 Table: `control_dependencies`

Conditional dependency linkages between gateway controls and secondary sub-controls.

- **Mapped Name**: `control_dependencies`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `parentControlId` (String): Foreign key referencing `controls.id` (Gateway control). Cascade delete.
  - `childControlId` (String): Foreign key referencing `controls.id` (Sub-control). Cascade delete.
  - `triggerValue` (String): Condition state (e.g. `"COMPLIANT"` or `"NOT_APPLICABLE"`).
  - `effect` (String): Operational behavior change (e.g. `"HIDE"`, `"AUTO_COMPLY"`).
- **Indexes**:
  - `control_dependencies_parentControlId_childControlId_key` (Unique composite on `[parentControlId, childControlId]`)
  - `control_dependencies_parentControlId_idx` (Index on `parentControlId`)
  - `control_dependencies_childControlId_idx` (Index on `childControlId`)

---

### 3.10 Table: `evidence`

File assets metadata uploaded to validate control implementation states.

- **Mapped Name**: `evidence`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentItemId` (String): Foreign key referencing `assessment_items.id`. Cascade delete.
  - `userId` (String): Denormalized uploader user ID.
  - `filename` (String): S3 storage UUID key file location name.
  - `originalName` (String): Original client filename.
  - `fileUrl` (String): Temporary/Permanent signed access link url.
  - `fileSize` (Int): Size in bytes.
  - `mimeType` (String): File media type.
  - `description` (String / Nullable): Description text notes.
  - `uploadedAt` (DateTime): Upload timestamp.
- **Indexes**:
  - `evidence_assessmentItemId_idx` (Index on `assessmentItemId`)
  - `evidence_uploadedAt_idx` (Index on `uploadedAt`)
  - `evidence_assessmentItemId_uploadedAt_desc_idx` (Composite sort index on `[assessmentItemId, uploadedAt DESC]`)

---

### 3.11 Table: `comments`

Discussion log history on individual controls.

- **Mapped Name**: `comments`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentItemId` (String): Foreign key referencing `assessment_items.id`. Cascade delete.
  - `userId` (String): Author user ID.
  - `userName` (String): Author profile name.
  - `content` (String): Message text.
  - `createdAt` (DateTime): Message post date.
- **Indexes**:
  - `comments_assessmentItemId_idx` (Index on `assessmentItemId`)
  - `comments_assessmentItemId_createdAt_desc_idx` (Composite sort index on `[assessmentItemId, createdAt DESC]`)

---

### 3.12 Table: `reports`

Snapshot audit-ready documents listings.

- **Mapped Name**: `reports`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentId` (String): Foreign key referencing `assessments.id`. Cascade delete.
  - `type` (Enum `ReportType`): Report structure (`COMPLIANCE_READINESS` or `EXECUTIVE_SUMMARY`).
  - `format` (Enum `ReportFormat`): Target output style (`PDF` or `WEB`).
  - `fileUrl` (String / Nullable): Uploaded S3 document URL (only populated for PDF output formats).
  - `generatedAt` (DateTime): Generation date.
- **Indexes**:
  - `reports_assessmentId_idx` (Index on `assessmentId`)
  - `reports_generatedAt_idx` (Index on `generatedAt`)

---

### 3.13 Table: `remediation_plans`

Actionable plans generated to address non-compliant evaluation metrics.

- **Mapped Name**: `remediation_plans`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentId` (String): Foreign key referencing `assessments.id`. Cascade delete.
  - `assessmentItemId` (String): Unique foreign key referencing `assessment_items.id`. Cascade delete.
  - `controlId` (String): Foreign key referencing `controls.id`.
  - `userId` (String): Owner user ID.
  - `title` (String): Plan title.
  - `summary` (String / Nullable): Overview summary.
  - `status` (Enum `RemediationPlanStatus`): Plan state (`ACTIVE`, `COMPLETED`, `ARCHIVED`, default `ACTIVE`).
  - `policies` (String[]): Text array of recommended corporate policy changes.
  - `technicalControls` (String[]): Text array of recommended software configurations.
  - `generatedAt` (DateTime): Generation date.
  - `createdAt` (DateTime): Record creation date.
  - `updatedAt` (DateTime): Last update date.
- **Indexes**:
  - `remediation_plans_assessmentItemId_key` (Unique index on `assessmentItemId`)
  - `remediation_plans_assessmentId_idx` (Index on `assessmentId`)
  - `remediation_plans_controlId_idx` (Index on `controlId`)
  - `remediation_plans_userId_idx` (Index on `userId`)
  - `remediation_plans_status_idx` (Index on `status`)

---

### 3.14 Table: `remediation_steps`

Actionable roadmap checklist tasks assigned inside a remediation plan.

- **Mapped Name**: `remediation_steps`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `planId` (String): Foreign key referencing `remediation_plans.id`. Cascade delete.
  - `title` (String): Step title task.
  - `description` (String): Step execution notes.
  - `priority` (String): Priority classification (e.g. `HIGH`, `MEDIUM`, `LOW`).
  - `owner` (String): Assignee name.
  - `estimatedHours` (Int): Expected task duration.
  - `status` (Enum `RemediationStepStatus`): Task state (`TODO`, `IN_PROGRESS`, `DONE`, default `TODO`).
  - `sortOrder` (Int): Sorting sorting index values.
  - `completedAt` (DateTime / Nullable): Completion timestamp.
  - `createdAt` (DateTime): Record creation date.
  - `updatedAt` (DateTime): Last update date.
- **Indexes**:
  - `remediation_steps_planId_idx` (Index on `planId`)
  - `remediation_steps_planId_status_idx` (Composite index on `[planId, status]`)
  - `remediation_steps_completedAt_idx` (Index on `completedAt`)

---

### 3.15 Table: `ai_interactions`

Token tracking logs recording internal LLM prompt activities.

- **Mapped Name**: `ai_interactions`
- **Fields**:
  - `id` (String / cuid): Primary key.
  - `assessmentId` (String / Nullable): Foreign key referencing `assessments.id`. Nullable relation. Set to null on delete.
  - `type` (Enum `AIType`): Interaction type (`COMPLIANCE_MAPPING`, `REMEDIATION_PLAN`, `REPORT_NARRATIVE`).
  - `input` (String): JSON-stringified prompt input payload.
  - `output` (String): JSON-stringified response data.
  - `model` (String): Target model identifier (e.g. `gpt-4o`).
  - `tokensUsed` (Int / Nullable): Prompt/Completion tokens sum.
  - `durationMs` (Int / Nullable): Call latency in milliseconds.
  - `createdAt` (DateTime): Record creation date.
- **Indexes**:
  - `ai_interactions_assessmentId_idx` (Index on `assessmentId`)
  - `ai_interactions_type_idx` (Index on `type`)
  - `ai_interactions_assessmentId_type_idx` (Composite index on `[assessmentId, type]`)
  - `ai_interactions_createdAt_idx` (Index on `createdAt`)

---

## 4. Migration & Schema Modification Guide

### 4.1 Running Local Schema Upgrades

To modify schemas locally, execute upgrades via direct connection strings bypassing client pools.

1.  **Modify Prisma Schema**: Edit columns/indexes inside `prisma/schema.prisma`.
2.  **Generate Migration DDL Script**:
    ```bash
    pnpm exec prisma migrate dev --name <migration_description>
    ```
    This applies the migration locally and updates the local Prisma Client types mapping.

### 4.2 Handling Production Upgrades (Neon Serverless PostgreSQL)

When upgrading a hosted production Neon database:

> [!CAUTION]
> Never run `prisma migrate dev` directly targeting the production database. It can trigger table recreations and result in fatal data loss. Only use the unpooled direct connection string (`DATABASE_URL_UNPOOLED`) to apply pre-compiled migration files.

#### Step-by-Step Deploy Pipeline:

1.  **Retrieve connection parameters**: Copy direct link endpoint credentials from Neon dashboard dashboard dashboard. Set them as your environment shell variable `DATABASE_URL` during local terminal deployment execution.
2.  **Verify drift**: Run checking script to identify if database matches migrations:
    ```bash
    pnpm exec prisma migrate status
    ```
3.  **Execute Migrations safely**: Apply outstanding DDL schema migrations:
    ```bash
    pnpm exec prisma migrate deploy
    ```
4.  **Re-generate Client**: Re-sync project types inside Vercel CI pipelines to use the newly applied Prisma layout attributes.
