# Production Deployment Guide

**Document:** `docs/deployment.md`
**Version:** 1.0
**Owner:** Security & Platform Engineering
**Last Reviewed:** 2026-06-23
**Classification:** Internal — Restricted
**Sprint Context:** Sprint 10 (Production Deployment)

---

## 1. Overview

This document provides a comprehensive step-by-step guide for deploying the **AI-Assured Compliance Dashboard** to production. It covers managed databases, key/value caching, object storage, serverless application hosting, environment variable checklists, database migrations, and smoke-testing procedures.

```mermaid
graph TD
    Client[Browser Client] -->|HTTPS / SSL| Vercel[Vercel Serverless Hosting]
    Vercel -->|SQL Client| Neon[Neon PostgreSQL DB]
    Vercel -->|Redis Client| Upstash[Upstash Serverless Redis]
    Vercel -->|S3 SDK| S3[AWS S3 Bucket - Encrypted]
    Vercel -->|HTTPS API| Sentry[Sentry Error Monitoring]
```

---

## 2. Infrastructure Setup & Configurations

### 2.1 PostgreSQL Setup (Neon)

Neon is a serverless PostgreSQL service. In production, we utilize two separate database URLs:
1.  **Pooled connection**: Used by Next.js serverless functions (handled by PgBouncer/Neon connection pooler) to prevent connection exhaustion.
2.  **Unpooled connection**: Used by Prisma CLI for migrations and seeding to prevent timing out or connection multiplexing issues during DDL execution.

#### Steps:
1.  Sign in to the [Neon Console](https://neon.tech) and create a new project.
2.  Choose the closest region to your Vercel deployment (e.g., `us-east-1` or `eu-west-1`).
3.  Copy the connection strings:
    *   **Pooled**: Under project dashboard, copy the URI. Ensure `?sslmode=require` is appended.
    *   **Direct (Unpooled)**: Check "pooled" off or select the direct connection string.
4.  **Backup Strategy Verification**:
    *   Neon automatically performs continuous daily backups of all storage units.
    *   Point-in-time recovery (PITR) is automatically supported for up to 30 days.
    *   Under the **Backups** tab in the Neon dashboard, verify that backups are enabled and showing active snapshots.

### 2.2 Redis Setup (Upstash)

Upstash is utilized for serverless Redis caching and rate limiting.

#### Steps:
1.  Sign in to [Upstash Console](https://upstash.com).
2.  Click **Create Database**.
3.  Configure:
    *   **Name**: `compliance-prod`
    *   **Region**: Select the same region as the Vercel app (e.g., `us-east-1` / `eu-west-1`).
    *   **SSL/TLS**: Ensure the **TLS** checkbox is checked (mandatory for production connections).
4.  Copy the endpoint URL under the Redisson / Redis Client configuration tab: `REDIS_URL` in format `rediss://default:<password>@<host>:<port>`.

### 2.3 AWS S3 Bucket Setup (Object Storage)

The application stores compliance evidence files (e.g., PDFs, images) in an S3 bucket.

#### Steps:
1.  Open the **AWS S3 Console** and click **Create bucket**.
2.  Configure:
    *   **Bucket Name**: `compliance-evidence-production` (must be globally unique)
    *   **Region**: Select your primary region.
    *   **Block Public Access**: Keep **Block all public access** checked. This is a private bucket.
3.  **KMS Encryption Configuration**:
    *   Under **Default encryption**, select **Enable**.
    *   Choose **AWS Key Management Service key (SSE-KMS)**.
    *   Select `aws/s3` as the default key or configure a custom Customer Managed Key (CMK) for enterprise compliance.
4.  **CORS Policy Configuration**:
    *   Go to the **Permissions** tab of the bucket.
    *   Under **Cross-origin resource sharing (CORS)**, paste the following policy (replace with your actual production domain):
    ```json
    [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
        "AllowedOrigins": ["https://your-production-domain.com"],
        "ExposeHeaders": ["ETag"]
      }
    ]
    ```
5.  **IAM Credentials**:
    *   Go to **AWS IAM Console** and create a new IAM user `compliance-s3-uploader`.
    *   Attach a policy granting access to only this bucket:
        ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:DeleteObject",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        "arn:aws:s3:::compliance-evidence-production",
                        "arn:aws:s3:::compliance-evidence-production/*"
                    ]
                }
            ]
        }
        ```
    *   Generate a set of Access Keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) and save them securely in your password manager.

---

## 3. Database Initialization & Seeding

Before running the application, the production database must be initialized with schemas and core framework control metadata.

> [!WARNING]
> Running the seed script in production mode requires `SEED_PRODUCTION=true`. This guarantees that ONLY standard frameworks (GDPR, HIPAA, PCI-DSS) are seeded. Mock users, companies, assessment scores, and fake report artifacts will NOT be created.

### 3.1 Run Migrations
Run the following Prisma migration command locally targeting your production database (temporarily setting `DATABASE_URL` to your **unpooled** database connection string):

```bash
# Apply schemas
pnpm prisma migrate deploy
```

### 3.2 Run Production Seed
Execute the seeding command with the production flag set:

```bash
# Seed core frameworks and controls only
SEED_PRODUCTION=true pnpm prisma db seed
```

Verify in the console output that it says:
`🎉 Seed complete (Production - Core Frameworks only).`

---

## 4. Vercel Deployment & Environment Variables

Configure the following environment variables in your **Vercel Project Settings > Environment Variables** (set for **Production** environment only):

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://user:pass@ep-pooled.us-east-1.neon.tech/neondb?sslmode=require` | Neon Pooled database connection string |
| `DATABASE_URL_UNPOOLED` | `postgres://user:pass@ep-direct.us-east-1.neon.tech/neondb?sslmode=require` | Neon Direct/Unpooled database connection string |
| `REDIS_URL` | `rediss://default:pwd@compliance-prod.upstash.io:6379` | Upstash Redis connection string |
| `NEXTAUTH_SECRET` | `[Use openssl rand -base64 32]` | NextAuth cryptography sign key |
| `NEXTAUTH_URL` | `https://your-production-domain.com` | Production URL for Auth redirects |
| `AWS_REGION` | `us-east-1` | AWS S3 Primary Region |
| `AWS_S3_BUCKET` | `compliance-evidence-production` | AWS S3 Bucket Name |
| `AWS_ACCESS_KEY_ID` | `AKIAIOSFODNN7EXAMPLE` | IAM Access Key |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | IAM Secret Access Key |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://sentry-dsn@sentry.io/1234` | Sentry Frontend DSN |
| `SENTRY_DSN` | `https://sentry-dsn@sentry.io/1234` | Sentry Backend DSN |
| `SENTRY_AUTH_TOKEN` | `sntryu_auth_token_example` | Auth token used at build time to upload source maps |
| `SEED_PRODUCTION` | `true` | Production seed toggle flag |

---

## 5. DNS & SSL Verification

1.  In the Vercel Dashboard, go to your **Project Settings > Domains**.
2.  Add your custom domain (e.g. `compliance.your-company.com` or `your-production-domain.com`).
3.  Configure your DNS provider with the CNAME record or A record specified by Vercel:
    *   **CNAME Record**: Name `compliance` -> Value `cname.vercel-dns.com.`
    *   **A Record** (if apex domain): Name `@` -> Value `76.76.21.21`
4.  Once DNS propagates, Vercel automatically provisions a free Let's Encrypt SSL certificate and verifies it. Confirm the status reads **Active** and shows a green checkmark.

---

## 6. Post-Deployment Smoke Tests

Execute these tests on your deployed production site to ensure all application flows are functioning correctly:

1.  **Health Check Endpoint**:
    *   Navigate to `https://your-production-domain.com/api/health`.
    *   Verify it returns status code `200` and JSON response: `{"status":"OK"}`.
2.  **User Authentication (Signup & Login)**:
    *   Navigate to `https://your-production-domain.com/signup`.
    *   Register a new production administrator account.
    *   Log out and log back in to ensure session state persists.
3.  **Organization & Assessment Creation**:
    *   After logging in, complete the new organization onboarding wizard.
    *   Confirm your organization details are saved.
    *   Start a new compliance assessment (e.g. GDPR).
4.  **Evidence Upload (S3 Verification)**:
    *   Navigate to an assessment item, click **Upload Evidence**.
    *   Select a test file (e.g., `test-evidence.pdf`) and upload.
    *   Verify the file uploads successfully, displays in the list, and can be downloaded or deleted.
5.  **Error Tracking Verification**:
    *   Trigger a simulated client-side or server-side error (if a test route is configured, or inspect network logs).
    *   Confirm no application secrets are exposed in browser logs.
    *   Verify that error events are successfully pushed to your Sentry dashboard.
