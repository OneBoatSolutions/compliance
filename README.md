# AI-Assured Compliance Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791)](https://www.postgresql.org/)

> An AI-powered compliance management platform that helps organizations discover, assess, and maintain compliance readiness across multiple regulatory frameworks (GDPR, HIPAA, PCI-DSS, SOC 2, and more).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [UI Design References](#ui-design-references)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [GitHub Collaboration Workflow](#github-collaboration-workflow)
- [Branch Nomenclature](#branch-nomenclature)
- [Branching Strategy](#branching-strategy)
- [Pull Request Process](#pull-request-process)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

The **AI-Assured Compliance Dashboard** is a comprehensive SaaS platform designed to democratize compliance management for small to medium-sized businesses. Traditional compliance solutions are either too expensive (enterprise GRC platforms) or too manual (spreadsheets). Our platform bridges this gap by providing:

- **AI-Powered Framework Discovery**: Automatically identify which compliance frameworks apply to your business
- **Structured Assessment Engine**: Complete compliance checklists with real-time scoring
- **Intelligent Remediation**: Get AI-generated, step-by-step remediation plans for non-compliant controls
- **Automated Reporting**: Generate audit-ready compliance reports in minutes

### Key Differentiators

- 🤖 **AI-First Approach**: Leverages GPT-4/Claude for framework mapping and remediation guidance
- 📊 **Real-Time Scoring**: Dynamic compliance score calculation as you complete assessments
- 🎯 **Multi-Framework Support**: Assess against GDPR, HIPAA, PCI-DSS, SOC 2, ISO 27001, and more
- 🔒 **Enterprise Security**: Single-tenant architecture with encryption at rest and in transit
- 📈 **Scalable Architecture**: Built on Next.js, Prisma, and PostgreSQL for performance and reliability

---

## ✨ Features

### For Users (Compliance Managers)

- ✅ **Organization Onboarding**: Input business details and receive AI-powered framework suggestions
- ✅ **Assessment Management**: Create and manage compliance assessments across multiple frameworks
- ✅ **Interactive Checklist**: Track compliance status for each control with comments and evidence upload
- ✅ **AI Remediation Plans**: Get actionable guidance for fixing compliance gaps
- ✅ **Compliance Reporting**: Generate comprehensive PDF reports for stakeholders and auditors
- ✅ **Progress Tracking**: Real-time dashboard with compliance scores and risk summaries

### For Admins (Framework Managers)

- ✅ **Framework Management**: CRUD operations for compliance frameworks
- ✅ **Control Library**: Add, edit, and organize compliance controls
- ✅ **Bulk Import**: Import controls via CSV for efficiency
- ✅ **User Management**: Manage user accounts and permissions
- ✅ **Version Control**: Maintain framework versions as regulations evolve

### Security & Compliance

- 🔐 Role-Based Access Control (RBAC)
- 🔐 Password hashing with bcrypt
- 🔐 JWT-based authentication
- 🔐 TLS 1.3 encryption
- 🔐 Database encryption at rest
- 🔐 Audit logging
- 🔐 GDPR-compliant data handling

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.4+
- **UI Library**: React 18+
- **State Management**: Zustand 4+
- **Styling**: Tailwind CSS 3+
- **Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)

### Backend

- **Runtime**: Node.js 20 LTS
- **Framework**: Next.js API Routes
- **ORM**: Prisma 5+
- **Validation**: Zod
- **Authentication**: NextAuth.js / BetterAuth
- **File Processing**: Multer, Sharp
- **PDF Generation**: PDFKit

### Database & Storage

- **Database**: PostgreSQL 16
- **File Storage**: AWS S3 / MinIO (local dev)
- **Cache**: Redis (AWS ElastiCache / local)
- **Connection Pooling**: Prisma (10-50 connections)

### AI & External Services

- **AI Provider**: OpenAI (GPT-4-Turbo) / Anthropic (Claude 3.5 Sonnet)
- **AI SDK**: Vercel AI SDK
- **Email**: SendGrid / Resend
- **Monitoring**: Sentry (errors), Vercel Analytics (performance), CloudWatch (metrics)

### Infrastructure

- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions
- **Secrets**: AWS Secrets Manager / Vercel Environment Variables

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│              Next.js App (React + TypeScript)           │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                      │
│                  Next.js API Routes                     │
│  /api/auth  /api/frameworks  /api/assessments  /api/ai  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                        │
│   Framework Service | Assessment Service | AI Service   │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                     │
│                    Prisma ORM                           │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                      │
│    PostgreSQL  |  S3 Storage  |  Redis Cache            │
└─────────────────────────────────────────────────────────┘
```

### Key Components

**Frontend (Next.js App Router)**

- `/app/(auth)`: Authentication pages (login, register)
- `/app/(user)`: User-facing dashboard and assessment tools
- `/app/(admin)`: Admin portal for framework and user management
- `/app/api`: API routes for backend logic

**Backend Services**

- **AI Service**: Framework mapping, remediation plan generation
- **Assessment Service**: CRUD operations, score calculation
- **Report Service**: PDF generation, report storage
- **Framework Service**: Framework and control management

**Database Schema**

- Users & Organizations
- Frameworks & Controls
- Assessments & Assessment Items
- Evidence & Reports
- AI Interactions (audit log)

For detailed architecture diagrams and technical specifications, see:

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [System Architecture Document](./docs/ARCHITECTURE.md)

---

## 🎨 UI Design References

All UI design assets, mockups, and style guides are located in the **`/assets`** folder in the root directory.

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or v20.x LTS
- **Package Manager**: pnpm v10.x (locked at `pnpm@10.30.3` in package.json)
- **Backing Services**:
  - **PostgreSQL**: v16 or higher
  - **Redis**: v7 or higher
  - **MinIO**: Latest (for local S3 object storage emulation)
- **Git**: Latest version
- **Docker / Docker Desktop**: For spinning up backing services locally

### Recommended Tools

- **VS Code**: With ESLint, Prettier, and Prisma extensions
- **pgAdmin** or **TablePlus**: For database inspection and query reviews
- **AWS CLI**: For testing local MinIO/S3 bucket configurations

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/oneboatsolutions/compliance.git
cd compliance
```

### 2. Install Dependencies

Ensure you use pnpm to lock package footprints:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example configuration to initialize environment variables:

```bash
cp .env.example .env
```

_(Next.js and Prisma Client natively read environment variables from the `.env` file at the project root)._

### 4. Start Local Backing Services

Spin up Postgres, Redis, and MinIO locally via Docker Compose:

```bash
docker compose up -d
```

Verify that all containers are running and healthy:

```bash
docker compose ps
```

### 5. Initialize the Database Schema

Run Prisma migrations to construct tables, generate client bindings, and seed static frameworks (GDPR, HIPAA, PCI-DSS):

```bash
# Apply schemas
pnpm exec prisma db push

# Generate client typescript interfaces
pnpm exec prisma generate

# Seed database with sample profiles and controls
pnpm exec prisma db seed
```

### 6. Start the Development Server

```bash
pnpm dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000).

### 7. Sanity Checks

Verify your installation:

- Liveness Probe: `GET http://localhost:3000/api/health` should return `{"status":"ok"}`.
- Readiness Probe: `GET http://localhost:3000/api/ready` should return `{"status":"healthy","services":{"database":"healthy","redis":"healthy"}}`.

---

## 🛠 Troubleshooting Engine

Here is a quick reference matrix of known edge cases and mitigation steps:

| Failure Mode                                                                          | Root Cause                                                                                 | copy-paste Mitigation Command                                                                                                                                                        |
| :------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prisma Client out of sync**<br>_(Type errors or missing relations in routes)_       | The Prisma Client was not re-generated after a schema change or dependency sync.           | `pnpm exec prisma generate`                                                                                                                                                          |
| **Docker Compose Port Conflicts**<br>_(Containers fail to start or exit with code 1)_ | An existing Postgres (5432) or Redis (6379) service is already running on the host system. | **Windows**: Stop host services or locate PID and term:<br>`netstat -ano \| findstr 5432`<br>`taskkill /F /PID <PID>`<br>**Linux/macOS**:<br>`sudo lsof -i :5432`<br>`kill -9 <PID>` |
| **Redis connection timeouts**<br>_(Limiter / API requests fail to resolve)_           | Redis is down or connection string is misconfigured.                                       | Verify Redis is running: `docker compose ps`. If running, check configuration URL in `.env`: `REDIS_URL="redis://localhost:6379"`.                                                   |
| **Prisma DB Connection Timeouts**<br>_(Database migrations fail on Neon)_             | Pooled connections (via PgBouncer) multiplex connection sessions, causing DDL errors.      | For local migrations use `DATABASE_URL_UNPOOLED` direct connection strings rather than pooled ones.                                                                                  |
| **ClamAV Scanner Failure**<br>_(File uploads fail with status 422)_                   | ClamAV host connection failed or scan timed out.                                           | Set `CLAMAV_FAIL_OPEN=true` in local `.env` to skip scanning in developer environments.                                                                                              |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/compliance_db?schema=public"

# NextAuth / Authentication
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# AI Provider (OpenAI)
OPENAI_API_KEY="sk-your-openai-api-key"
# Or Anthropic
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"

# AWS S3 (or use MinIO for local dev)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="compliance-evidence"

# MinIO (Local S3 Alternative)
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin123"
MINIO_BUCKET="compliance-local"

# Redis (optional for local dev)
REDIS_URL="redis://localhost:6379"

# Email (SendGrid / Resend)
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@yourcompany.com"

# Monitoring (Production)
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"

# Feature Flags
ENABLE_AI_FEATURES="true"
ENABLE_EVIDENCE_UPLOAD="true"
```

### Environment Variables by Service

| Variable            | Required | Description                           |
| ------------------- | -------- | ------------------------------------- |
| `DATABASE_URL`      | ✅       | PostgreSQL connection string          |
| `AUTH_SECRET`       | ✅       | Secret for NextAuth.js (min 32 chars) |
| `OPENAI_API_KEY`    | ✅       | OpenAI API key for AI features        |
| `AWS_ACCESS_KEY_ID` | ✅       | AWS credentials for S3                |
| `S3_BUCKET_NAME`    | ✅       | S3 bucket for file storage            |
| `REDIS_URL`         | ⚠️       | Redis for caching (optional in dev)   |
| `SENDGRID_API_KEY`  | ⚠️       | Email service (optional in dev)       |

---

## 💻 Development

### Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run type checking
pnpm type-check

# Format code with Prettier
pnpm format

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Database commands
pnpm prisma studio        # Open Prisma Studio
pnpm prisma migrate dev   # Run migrations
pnpm prisma generate      # Generate Prisma Client
pnpm prisma db seed       # Seed database
```

### Project Structure

```
ai-compliance-dashboard/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (user)/                   # User route group
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   └── assessments/
│   ├── (admin)/                  # Admin route group
│   │   ├── dashboard/
│   │   ├── frameworks/
│   │   └── users/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── frameworks/
│   │   ├── assessments/
│   │   ├── ai/
│   │   └── reports/
│   └── layout.tsx
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   ├── auth/
│   ├── user/
│   └── admin/
├── lib/                          # Utilities & config
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── api-client.ts
├── services/                     # Business logic
│   ├── ai-service.ts
│   ├── assessment-service.ts
│   ├── framework-service.ts
│   └── report-service.ts
├── stores/                       # Zustand state stores
│   ├── auth-store.ts
│   └── assessment-store.ts
├── types/                        # TypeScript types
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                       # Static assets
├── assets/                       # UI designs & brand assets
│
├── docs/                         # Documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── API.md
├── tests/                        # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/                      # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

### Coding Standards

**TypeScript**

- Use strict mode
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Use enums for constants

**React**

- Functional components with hooks
- Use TypeScript for prop types
- Extract reusable logic into custom hooks
- Keep components small and focused

**Naming Conventions**

- Components: PascalCase (`UserDashboard.tsx`)
- Utilities: camelCase (`calculateScore.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Files: kebab-case for non-components (`api-client.ts`)

**Code Quality**

- ESLint: Enforced on pre-commit
- Prettier: Auto-format on save
- Husky: Git hooks for quality checks
- Conventional Commits: Required

---

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                      # Unit tests
│   ├── services/
│   ├── utils/
│   └── components/
├── integration/               # Integration tests
│   ├── api/
│   └── database/
└── e2e/                       # End-to-end tests
    ├── user-flows/
    └── admin-flows/
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Test Coverage Requirements

- Overall coverage: > 80%
- Critical paths: > 90%
- Services: > 85%
- Components: > 75%

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**

   ```bash
   vercel login
   vercel link
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables from `.env.example`

3. **Deploy**

   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] storage buckets created
- [ ] Redis instance configured
- [ ] Monitoring setup (Sentry, CloudWatch)
- [ ] SSL certificate configured
- [ ] DNS records updated
- [ ] Backup strategy in place

---

## 🤝 GitHub Collaboration Workflow

We follow a structured Git workflow to ensure code quality, maintain a clean history, and enable smooth collaboration across the team.

### Workflow Overview

```
main (production)
  ↑
  └── stage (staging/pre-production)
        ↑
        └── dev (development)
              ↑
              ├── feat/username/feature-name
              ├── fix/username/bug-description
              ├── refactor/username/refactor-description
              └── docs/username/documentation-update
```

### Core Principles

1. **Never commit directly to `main`, `stage`, or `dev`**
2. **Always work in feature branches**
3. **All changes must go through Pull Request (PR) review**
4. **PRs must pass CI checks before merging**
5. **Use conventional commits**

---

## 📝 Branch Nomenclature

We follow a strict naming convention for branches to maintain clarity and organization.

### Branch Naming Format

```
<type>/<username>/<description>
```

### Branch Types

| Type       | Purpose                            | Example                               |
| ---------- | ---------------------------------- | ------------------------------------- |
| `feat`     | New feature development            | `feat/john/ai-remediation-ui`         |
| `fix`      | Bug fixes                          | `fix/sarah/login-validation-error`    |
| `refactor` | Code refactoring (no new features) | `refactor/mike/assessment-service`    |
| `docs`     | Documentation updates              | `docs/alice/api-documentation`        |
| `test`     | Adding or updating tests           | `test/bob/assessment-unit-tests`      |
| `chore`    | Build process, dependencies, etc.  | `chore/jane/update-dependencies`      |
| `hotfix`   | Urgent production fixes            | `hotfix/john/critical-security-patch` |
| `perf`     | Performance improvements           | `perf/sarah/optimize-db-queries`      |

### Examples

✅ **Good Branch Names**

```
feat/john/user-onboarding-flow
fix/sarah/compliance-score-calculation
refactor/mike/split-assessment-service
docs/alice/update-readme-setup
test/bob/add-e2e-tests-dashboard
chore/jane/upgrade-nextjs-14
hotfix/john/fix-login-csrf-token
perf/sarah/optimize-report-generation
```

❌ **Bad Branch Names**

```
new-feature          # No username or description
john/fix             # No type prefix
feature-login        # No username
fix_bug              # Use hyphens, not underscores
FEAT/john/test       # Use lowercase
```

### Username Guidelines

- Use your GitHub username or first name (lowercase)
- Keep it consistent across all branches
- Examples: `john`, `sarah-smith`, `mike123`

### Description Guidelines

- Use lowercase with hyphens
- Be descriptive but concise (2-5 words)
- Focus on the "what" not the "how"
- Avoid vague terms like "updates", "changes", "fixes"

---

## 🌳 Branching Strategy

We use a **three-tier branching strategy** with protected branches and strict merge policies.

### Branch Hierarchy

```
main (production)
  ↓ Merge from stage only
stage (staging/pre-production)
  ↓ Merge from dev only
dev (development/integration)
  ↓ Merge from feature branches
feature branches (feat/*, fix/*, etc.)
```

### Branch Descriptions

#### 1. `main` - Production Branch

- **Purpose**: Reflects production-ready code
- **Protection**: 🔒 **Fully Protected**
- **Merge Source**: Only from `stage` branch
- **Deployment**: Auto-deploys to production (Vercel)
- **Rules**:
  - No direct commits
  - No direct PRs from feature branches
  - Requires 2+ approvals from maintainers
  - All CI checks must pass
  - Deployment must be approved

#### 2. `stage` - Staging Branch

- **Purpose**: Pre-production testing and QA
- **Protection**: 🔒 **Protected**
- **Merge Source**: Only from `dev` branch
- **Deployment**: Auto-deploys to staging environment
- **Rules**:
  - No direct commits
  - No direct PRs from feature branches
  - Requires 1+ approval from maintainers
  - All CI checks must pass
  - QA testing required before merging to `main`

#### 3. `dev` - Development Branch

- **Purpose**: Integration branch for ongoing development
- **Protection**: 🔒 **Protected**
- **Merge Source**: From feature branches (`feat/*`, `fix/*`, etc.)
- **Deployment**: Auto-deploys to development environment
- **Rules**:
  - No direct commits
  - Requires 1+ approval from peers
  - All CI checks must pass
  - Conflicts must be resolved before merging

#### 4. Feature Branches

- **Purpose**: Individual feature development, bug fixes, etc.
- **Protection**: ⚠️ **Unprotected** (can be deleted after merge)
- **Naming**: Follow [Branch Nomenclature](#branch-nomenclature)
- **Source**: Branch from `dev`
- **Target**: Merge back to `dev` via PR
- **Lifespan**: Temporary (delete after merge)

### Merge Flow Diagram

```
Developer Workflow:
1. Create feature branch from dev
   dev → feat/john/new-feature

2. Develop & commit changes
   feat/john/new-feature (multiple commits)

3. Open PR to dev
   feat/john/new-feature → dev (PR #123)

4. Code review & approval
   PR reviewed by peers

5. Merge to dev
   feat/john/new-feature merged into dev

6. Delete feature branch
   feat/john/new-feature (deleted)

Release Workflow:
1. QA testing on dev
   dev (stable, tested)

2. Merge dev to stage
   dev → stage (PR #150)

3. QA testing on stage
   stage (pre-production testing)

4. Merge stage to main
   stage → main (PR #200)

5. Production deployment
   main (deployed to production)
```

---

## 🔄 Pull Request Process

### Creating a Pull Request

#### Step 1: Prepare Your Branch

```bash
# Make sure you're on your feature branch
git checkout feat/john/ai-remediation-ui

# Pull latest changes from dev
git fetch origin dev
git rebase origin/dev

# Run tests and linting
pnpm lint
pnpm type-check
pnpm test

# Push your branch
git push origin feat/john/ai-remediation-ui
```

#### Step 2: Open a Pull Request

1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. **Base**: `dev` (or `stage`/`main` for release PRs)
4. **Compare**: Your feature branch
5. Fill out the PR template (see below)

#### Step 3: PR Template

```markdown
## Description

<!-- Brief description of what this PR does -->

## Type of Change

- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] refactor: Code refactoring
- [ ] docs: Documentation update
- [ ] test: Adding or updating tests
- [ ] chore: Build/dependency updates
- [ ] perf: Performance improvement
- [ ] hotfix: Urgent production fix

## Related Issues

<!-- Link to related issues, e.g., Closes #123, Fixes #456 -->

## Changes Made

<!-- List of changes made in this PR -->

- Added AI remediation plan generation
- Updated assessment service with score calculation
- Created remediation UI components

## Testing

<!-- How was this tested? -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed
- [ ] Tested on dev environment

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## Checklist

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation (if needed)
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] Any dependent changes have been merged

## Additional Notes

<!-- Any additional information for reviewers -->
```

### PR Review Guidelines

#### For PR Authors

1. **Keep PRs Small**: Aim for < 400 lines of code
2. **Write Clear Descriptions**: Explain the "why", not just the "what"
3. **Add Screenshots**: For UI changes
4. **Request Specific Reviewers**: Tag relevant team members
5. **Respond to Feedback**: Address all comments promptly
6. **Keep PRs Updated**: Rebase with target branch regularly

#### For PR Reviewers

1. **Review Within 24 Hours**: Don't block teammates
2. **Be Constructive**: Suggest improvements, don't just criticize
3. **Test Locally**: Pull the branch and test changes
4. **Check Tests**: Ensure tests are added/updated
5. **Approve or Request Changes**: Don't leave PRs in limbo

### PR Approval Requirements

| Target Branch | Required Approvals     | Required Checks                    |
| ------------- | ---------------------- | ---------------------------------- |
| `dev`         | 1 peer approval        | ✅ Lint, ✅ Type-check, ✅ Tests   |
| `stage`       | 1 maintainer approval  | ✅ All dev checks + ✅ Build       |
| `main`        | 2 maintainer approvals | ✅ All stage checks + ✅ E2E tests |

### Merging a Pull Request

#### Auto-Merge (Squash and Merge)

```
1. Ensure all checks pass (green checkmarks)
2. Ensure required approvals received
3. Click "Squash and merge"
4. Edit commit message (use conventional commit format)
5. Confirm merge
6. Delete feature branch (automatic or manual)
```

#### Conventional Commit Format for Merge

```
<type>(<scope>): <description>

<body>

<footer>
```

**Example:**

```
feat(assessment): add AI remediation plan generation

- Integrated OpenAI API for remediation suggestions
- Created remediation plan UI components
- Added unit tests for AI service

Closes #123
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD changes

---

## 📋 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for detailed information.

### Quick Start for Contributors

1. **Fork the Repository**

   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/oneboatsolutions/compliance.git
   cd ai-compliance-dashboard
   ```

2. **Set Up Upstream Remote**

   ```bash
   git remote add upstream https://github.com/oneboatsolutions/compliance.git
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout dev
   git pull upstream dev
   git checkout -b feat/your-username/your-feature-name
   ```

4. **Make Changes and Commit**

   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feat/your-username/your-feature-name
   # Open PR on GitHub from your fork to upstream dev
   ```

### Contribution Types

We accept the following types of contributions:

- 🐛 **Bug Reports**: Found a bug? Open an issue!
- ✨ **Feature Requests**: Have an idea? Share it!
- 🔧 **Bug Fixes**: Submit a PR to fix issues
- 🎨 **UI/UX Improvements**: Design enhancements
- 📝 **Documentation**: Improve docs, add examples
- 🧪 **Tests**: Add test coverage
- 🌍 **Translations**: Help us localize (future)

### Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior

### Recognition

Contributors will be recognized in:

- `CONTRIBUTORS.md` file
- GitHub contributors page
- Release notes
- Special mentions in our blog (for significant contributions)

---

## 📄 License

This project is licensed under the **Cipherion Proprietary Commercial License** - see the [LICENSE](./LICENSE) file for details.

**Cipherion Proprietary License Summary**

Copyright (c) 2026 Cipherion Team. All Rights Reserved.

This software, including all source code, documentation, design,
architecture, models, and associated materials (the "Software"),
is the exclusive property of Cipherion.

No part of this Software may be used, copied, modified, merged,
published, distributed, sublicensed, sold, reverse engineered,
decompiled, or otherwise exploited in any form or by any means,
without the prior written permission of Cipherion.

Access to the Software is granted only under a valid commercial
license agreement executed with Cipherion.

Unauthorized use, reproduction, distribution, or modification
of this Software is strictly prohibited and may result in civil
and criminal penalties under applicable intellectual property laws.

THE SOFTWARE IS PROVIDED UNDER COMMERCIAL AGREEMENT ONLY.
UNLESS EXPRESSLY AGREED IN WRITING, THE SOFTWARE IS PROVIDED
"AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

Cipherion reserves all rights not expressly granted herein.

---

## 🆘 Support

### Getting Help

- 📖 **Documentation**: Check our [docs](./docs/) folder (Coming Soon)
- 💬 **Discussions**:
- 🐛 **Bug Reports**:
- 💡 **Feature Requests**:
- 📧 **Email**: official@cipherion.in (for commercial support)

### FAQ

\***\*Q: Questions are on the way\*\***
A: Yes, soon.

---

## 🗺 Roadmap

### v1.0 (Current) - MVP

- User authentication and authorization
- Organization onboarding with AI framework mapping
- Multi-framework assessment engine
- Real-time compliance scoring
- AI remediation plan generation
- PDF report generation
- Admin framework management
-

### v1.1 (Next Quarter)

- 🔲 Advanced evidence management (templates, categories)
- 🔲 Audit trail and change history
- 🔲 Collaboration features (comments, assignments)
- 🔲 Email notifications
- 🔲 Dashboard analytics improvements
- 🔲 Mobile responsiveness

### v2.0 (Future)

- 🔲 Multi-tenant architecture
- 🔲 SSO/SAML integration
- 🔲 API for third-party integrations
- 🔲 Custom framework creation
- 🔲 Automated evidence collection
- 🔲 SOC 2 Type II certification
- 🔲 Advanced analytics and insights
- 🔲 Localization (i18n) support

---

## 📞 Contact

- **Website**: https://cipherion.in
- **Email**: official@cipherion.in
- **Twitter**: [@yourcompany](https://twitter.com/yourcompany)
- **LinkedIn**: [Your Company](https://linkedin.com/company/yourcompany)

---

<div align="center">
  <p>Made with ❤️ by the Cipherion Team</p>
  <p>
    <a href="#-table-of-contents">Back to Top ↑</a>
  </p>
</div>
