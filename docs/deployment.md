# Production Deployment Guide

This document is the operational deployment runbook for the **AI-Assured Compliance Dashboard** in production environments.

---

## 1. Overview & Cloud Architecture

The application is built on serverless Next.js hosted on Vercel, integrating serverless backend storage, caching, and database layers for optimal resource allocation and zero-maintenance operations.

```mermaid
graph TD
    Client[Browser Client] -->|HTTPS / SSL| Vercel[Vercel Serverless Hosting]
    Vercel -->|SQL Client| Neon[Neon PostgreSQL DB]
    Vercel -->|Redis Client| Upstash[Upstash Serverless Redis]
    Vercel -->|S3 SDK| S3[AWS S3 Bucket - CMK Encrypted]
    Vercel -->|HTTPS API| Sentry[Sentry Error Monitoring]
```

---

## 2. Infrastructure Setup & Provisioning

### 2.1 Serverless PostgreSQL (Neon)

Neon is the primary PostgreSQL engine used in production.

#### Configuration Steps:

1.  Sign in to the [Neon Console](https://neon.tech) and create a project.
2.  Choose the closest hosting region to your Vercel deployment (e.g., `us-east-1` or `eu-west-1`) to minimize database query latency.
3.  **Connection Strings**: Copy the following two URI strings:
    - **Pooled Link**: Used in Next.js Serverless Functions for normal API operations (PgBouncer pooler). Ensure `?sslmode=require` is appended.
    - **Direct Link**: Used by the Prisma CLI to apply schema migrations and seeds. Turn off the "pooling" toggle or select the direct connection string.
4.  **Backups Check**: Neon automatically enables daily automated backups with 30-day point-in-time recovery (PITR). Confirm snapshots are listing correctly under the **Backups** tab.

### 2.2 Serverless Redis (Upstash)

Upstash manages sliding-window rate limit counters and analytics caching.

#### Configuration Steps:

1.  Sign in to the [Upstash Console](https://upstash.com).
2.  Click **Create Database** and configure:
    - **Name**: `compliance-prod`
    - **Region**: Match the Vercel server region.
    - **TLS/SSL**: Check the **TLS** checkbox. TLS is mandatory for production Redis traffic.
3.  Copy the connection string under the Redis Client configuration tab: `REDIS_URL` formatted as `rediss://default:<password>@<host>:<port>`.

### 2.3 Object Storage (AWS S3)

The application stores uploaded compliance evidence files in a private, encrypted AWS S3 bucket.

#### Configuration Steps:

1.  Open the **AWS S3 Console** and click **Create bucket**.
2.  Set a globally unique bucket name (e.g., `compliance-evidence-production`) and select your target region.
3.  **Security Configurations**:
    - Keep **Block all public access** checked. The bucket must remain completely private.
    - Under **Default encryption**, select **Enable**. Choose **AWS Key Management Service key (SSE-KMS)** and select the default `aws/s3` key or configure a custom Customer Managed Key (CMK) for corporate GRC compliance.
4.  **CORS Policy Configuration**:
    Navigate to the **Permissions** tab of the bucket, scroll to **Cross-origin resource sharing (CORS)**, and paste the following policy (replace with your actual production domain):
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
5.  **IAM Security**:
    - Create an IAM user `compliance-s3-uploader`.
    - Attach an IAM policy granting restricted access to only this target bucket:
      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
            "Resource": [
              "arn:aws:s3:::compliance-evidence-production",
              "arn:aws:s3:::compliance-evidence-production/*"
            ]
          }
        ]
      }
      ```
    - Generate a set of Access Keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) for Vercel deployment injection.

---

## 3. Database Initialization & Schema Seeding

Before running the application, the production database tables must be initialized and seeded with static framework control metadata.

> [!WARNING]
> Running the seed script in production requires `SEED_PRODUCTION=true`. This guarantees that ONLY standard compliance frameworks (GDPR, HIPAA, PCI-DSS) are populated. Mock user records, test companies, fake scores, and report history will NOT be created.

### 3.1 Run Migrations

Deploy the Prisma schema to the database (temporarily setting your environment shell's `DATABASE_URL` to your **unpooled/direct** database connection string):

```bash
pnpm exec prisma migrate deploy
```

### 3.2 Run Production Seeding

Execute the seed script using the direct connection string with the production flag set:

```bash
SEED_PRODUCTION=true pnpm exec prisma db seed
```

Verify the output console prints: `🎉 Seed complete (Production - Core Frameworks only).`

---

## 4. Vercel Deployment & Environment Checklist

Configure the following environment variables in your **Vercel Project Settings > Environment Variables** (set for **Production** environments):

| Variable Key             | Expected Value Format                                         | Description                                                      |
| :----------------------- | :------------------------------------------------------------ | :--------------------------------------------------------------- |
| `DATABASE_URL`           | `postgres://user:pass@ep-pooled.neon.tech/db?sslmode=require` | Neon Pooled connection (PgBouncer).                              |
| `DATABASE_URL_UNPOOLED`  | `postgres://user:pass@ep-direct.neon.tech/db?sslmode=require` | Neon Direct/Unpooled connection.                                 |
| `REDIS_URL`              | `rediss://default:password@host:port`                         | Upstash Redis connection string.                                 |
| `NEXTAUTH_SECRET`        | `[Random 32-character string]`                                | Session encryption key (generate via `openssl rand -base64 32`). |
| `NEXTAUTH_URL`           | `https://your-production-domain.com`                          | Primary URL for authentication redirects.                        |
| `AWS_REGION`             | `us-east-1`                                                   | AWS S3 Primary Hosting Region.                                   |
| `S3_BUCKET_NAME`         | `compliance-evidence-production`                              | AWS S3 Bucket Name.                                              |
| `AWS_ACCESS_KEY_ID`      | `AKIAIOSFODNN7EXAMPLE`                                        | IAM access key ID.                                               |
| `AWS_SECRET_ACCESS_KEY`  | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`                    | IAM secret access key.                                           |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://sentry-dsn@sentry.io/1234`                           | Sentry Frontend error DSN.                                       |
| `SENTRY_DSN`             | `https://sentry-dsn@sentry.io/1234`                           | Sentry Backend error DSN.                                        |
| `SENTRY_AUTH_TOKEN`      | `sntryu_auth_token_example`                                   | Auth token used at build time to upload source maps.             |
| `SEED_PRODUCTION`        | `true`                                                        | Safeguard flag ensuring mock data is skipped.                    |
| `ENABLE_AI_FEATURES`     | `true`                                                        | Toggles AI mapping and remediation pipelines.                    |
| `ENABLE_EVIDENCE_UPLOAD` | `true`                                                        | Toggles file uploads.                                            |
| `CORS_ALLOWED_ORIGINS`   | `https://your-production-domain.com`                          | CORS origin authorization rules.                                 |
| `CLAMAV_HOST`            | `clamav.internal.network`                                     | ClamAV service address (empty to fail-open).                     |
| `CLAMAV_PORT`            | `3310`                                                        | ClamAV TCP port.                                                 |
| `CLAMAV_FAIL_OPEN`       | `false`                                                       | Harden upload checking to block files if scanner is offline.     |

---

## 5. DNS, SSL, and Domains Configuration

1.  In the Vercel Dashboard, go to your **Project Settings > Domains**.
2.  Add your custom production domain (e.g., `compliance.your-company.com`).
3.  Configure your DNS provider with the CNAME or A records provided by Vercel:
    - **CNAME Record**: Name `compliance` -> Value `cname.vercel-dns.com.`
    - **A Record** (for apex domains): Name `@` -> Value `76.76.21.21`
4.  Once DNS propagation completes, Vercel will automatically provision a Let's Encrypt SSL certificate. Confirm the status reads **Active** with a green checkmark.

---

## 6. Post-Deployment Smoke Testing

Once deployment completes, execute the following smoke tests to verify the health of the live environment:

1.  **Liveness Health Check**:
    - Request `https://your-production-domain.com/api/health`.
    - Verify response status is `200` with JSON: `{"status":"ok"}`.
2.  **Readiness Probe**:
    - Request `https://your-production-domain.com/api/ready`.
    - Verify response status is `200` with JSON: `{"status":"healthy","services":{"database":"healthy","redis":"healthy"}}`.
3.  **User Authentication Flow**:
    - Go to `https://your-production-domain.com/register`.
    - Sign up with a production administrator account.
    - Verify you are redirected to the dashboard, and can log out and log back in without session dropouts.
4.  **Framework Mapping Flow**:
    - Complete the onboarding wizard.
    - Verify the AI service maps suggested frameworks correctly (returns GDPR, HIPAA, or PCI-DSS based on inputs).
5.  **Evidence Upload Validation**:
    - Navigate to an assessment checklist item, click **Upload Evidence**, and upload a test file (e.g., a PDF under 10MB).
    - Verify the file uploads successfully, displays in the evidence inventory, and can be downloaded or deleted.
6.  **Telemetry & Monitoring check**:
    - Intentionally trigger a client-side warning or page-not-found error.
    - Verify that error events are caught and logged inside your Sentry dashboard without exposing backend credentials in the browser console.
