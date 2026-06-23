# Secrets Rotation Standard Operating Procedure (SOP)

**Document:** `docs/secrets-rotation-sop.md`
**Version:** 1.0
**Owner:** Security Engineering
**Last Reviewed:** 2026-06-07
**Classification:** Internal — Restricted
**Sprint Context:** Authored in Sprint 9.1 (Security Hardening). **Execution begins in Sprint 10 (Deployment Prep)** once hosting environments are provisioned. Review this document at the start of Sprint 10.

---

## 1. Overview

This SOP defines the mandatory process for rotating all cryptographic secrets and API credentials used by the **AI-Assured Compliance Dashboard**. Secrets must be rotated on the schedule below and **immediately** whenever a suspected compromise is detected.

> [!IMPORTANT]
> Rotation must achieve **zero-downtime** in production. Every rotation follows the pattern: **Add → Deploy → Verify → Remove old**.

---

## 2. Secret Inventory & Rotation Schedule

| Secret                 | Environment Variable                          | Rotation Frequency | Owner    |
| ---------------------- | --------------------------------------------- | ------------------ | -------- |
| Database password      | `DATABASE_URL`                                | Every 90 days      | Platform |
| NextAuth JWT secret    | `NEXTAUTH_SECRET`                             | Every 90 days      | Platform |
| AWS Access Key         | `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Every 90 days      | Platform |
| MinIO credentials      | `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`       | Every 90 days      | Platform |
| OpenAI API key         | `OPENAI_API_KEY`                              | Every 60 days      | AI Team  |
| Resend (email) API key | `RESEND_API_KEY`                              | Every 90 days      | Platform |
| Redis password         | `REDIS_URL` (embedded)                        | Every 90 days      | Platform |

---

## 3. Pre-Rotation Checklist

Before starting any rotation:

- [ ] Notify the on-call engineer and record the rotation in the change log.
- [ ] Confirm you have access to the target secret store (Vercel Dashboard / AWS Secrets Manager / 1Password).
- [ ] Confirm the application has at least one healthy instance running.
- [ ] Identify every service and CI/CD pipeline that consumes the secret.
- [ ] Schedule during a low-traffic window (off-peak hours) when possible.

---

## 4. Rotation Procedures

### 4.1 Database Credentials (`DATABASE_URL`)

> [!CAUTION]
> A bad `DATABASE_URL` will cause all API routes to fail immediately. Test in staging before production.

**Local / Development:**

```bash
# 1. Connect to the PostgreSQL instance
psql -U postgres

# 2. Create a new password for the app user
ALTER USER compliance_app WITH PASSWORD '<new-strong-password>';

# 3. Update .env (never commit this file)
# DATABASE_URL="postgresql://compliance_app:<new-password>@localhost:5432/compliance_db"

# 4. Restart the dev server
pnpm dev
```

**Production (Vercel + managed PostgreSQL):**

```bash
# Step 1: Generate a new password (min 32 chars, URL-safe)
openssl rand -base64 32

# Step 2: In your managed DB console (Supabase / RDS / Neon):
#   a. Create a NEW user with the same permissions as the current app user, OR
#   b. Change the password for the existing user.
#   Use your DB provider's UI or:
ALTER USER compliance_app WITH PASSWORD '<new-password>';
GRANT ALL PRIVILEGES ON DATABASE compliance_db TO compliance_app;

# Step 3: Add the NEW credential to Vercel (do NOT remove the old one yet)
vercel env add DATABASE_URL production
# → paste: postgresql://compliance_app:<new-password>@<host>:5432/compliance_db

# Step 4: Deploy and verify (zero-downtime — old pods still use old secret)
vercel deploy --prod

# Step 5: Confirm health check passes
curl https://your-app.vercel.app/api/health

# Step 6: Remove the OLD credential from the DB provider
# (revoke old password / delete old user)

# Step 7: Update Vercel env to the final value and redeploy if needed
```

**Prisma connection pool note:** After rotation, existing Prisma connections holding the old credentials will eventually reconnect. For immediate effect, trigger a redeployment to restart the serverless functions.

---

### 4.2 NextAuth JWT Secret (`NEXTAUTH_SECRET`)

> [!WARNING]
> Rotating `NEXTAUTH_SECRET` **immediately invalidates all existing sessions**. All users will be logged out. Coordinate with the product team.

**Local:**

```bash
# Generate a new secret
openssl rand -base64 32

# Update .env
NEXTAUTH_SECRET="<new-secret>"

# Restart dev server — existing JWT cookies will be rejected and users re-login
pnpm dev
```

**Production (Vercel):**

```bash
# Step 1: Generate
NEW_SECRET=$(openssl rand -base64 32)
echo "New secret: $NEW_SECRET"  # Copy this — store in 1Password immediately

# Step 2: Update Vercel environment variable
vercel env rm NEXTAUTH_SECRET production          # Remove old
vercel env add NEXTAUTH_SECRET production         # Add new — paste the value
# → All new deployments use the new secret

# Step 3: Deploy (triggers full function re-initialization)
vercel deploy --prod

# Step 4: Monitor Sentry/logs for unexpected 401s in the 5 minutes post-deploy.
# Expect a brief spike of "JWT signature invalid" errors as cached sessions expire.
```

> [!NOTE]
> Consider implementing a **grace period** using the `decode` callback in NextAuth to accept tokens signed with either secret for 24 hours during rollover. This prevents forced logout.

---

### 4.3 AWS Access Keys (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)

> [!IMPORTANT]
> Use IAM roles instead of long-lived access keys wherever possible (e.g., on EC2/ECS). This procedure covers the fallback case of key-based auth.

**Rotation steps (AWS Console + Vercel):**

```bash
# Step 1: Create a NEW access key for the IAM user
aws iam create-access-key --user-name compliance-app-user
# Note the new AccessKeyId and SecretAccessKey

# Step 2: Store in 1Password immediately

# Step 3: Add new credentials to Vercel (both old and new are now valid)
vercel env add AWS_ACCESS_KEY_ID production       # new key id
vercel env add AWS_SECRET_ACCESS_KEY production   # new secret

# Step 4: Deploy and verify S3 operations work
vercel deploy --prod
curl -X POST https://your-app.vercel.app/api/evidence/upload \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -F "file=@test.pdf" -F "assessmentItemId=<id>"

# Step 5: Deactivate (do NOT delete yet) the OLD key
aws iam update-access-key \
  --user-name compliance-app-user \
  --access-key-id <OLD_KEY_ID> \
  --status Inactive

# Step 6: Wait 24 hours — monitor for S3 errors

# Step 7: Delete the old key
aws iam delete-access-key \
  --user-name compliance-app-user \
  --access-key-id <OLD_KEY_ID>
```

**IAM best practices for the app user:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/evidence/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name",
      "Condition": {
        "StringLike": { "s3:prefix": ["evidence/*"] }
      }
    }
  ]
}
```

---

### 4.4 MinIO Credentials (`MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`)

**Local / Docker Compose:**

```bash
# Update docker-compose.yml environment section for the minio service:
# MINIO_ROOT_USER: compliance_app
# MINIO_ROOT_PASSWORD: <new-password>  ← change here

# Then recreate the container
docker compose down minio
docker compose up -d minio

# Update .env
MINIO_ACCESS_KEY="compliance_app"
MINIO_SECRET_KEY="<new-password>"

# Restart dev server
pnpm dev
```

**Production (self-hosted MinIO):**

```bash
# Using MinIO Client (mc)
mc alias set myminio https://your-minio-host:9000 <old-admin-user> <old-admin-password>

# Create a new service account key
mc admin user svcacct add myminio compliance_app

# Note the new accessKey and secretKey from output

# Update Vercel
vercel env add MINIO_ACCESS_KEY production   # new key
vercel env add MINIO_SECRET_KEY production   # new secret
vercel deploy --prod

# After verification, remove old service account
mc admin user svcacct rm myminio <old-access-key>
```

---

### 4.5 AI Provider API Keys (OpenAI / Other)

```bash
# Step 1: Log in to platform.openai.com (or your AI provider)
# Step 2: Create a NEW API key in the dashboard
# Step 3: Store the new key in 1Password immediately
# Step 4: Add to Vercel

vercel env add OPENAI_API_KEY production   # paste new key

# Step 5: Deploy
vercel deploy --prod

# Step 6: Test AI generation endpoint
curl -X POST https://your-app.vercel.app/api/ai/generate \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'

# Step 7: Revoke the old key in the OpenAI dashboard
# (This is instant — old key stops working immediately)
```

> [!CAUTION]
> OpenAI key revocation is **immediate and irreversible**. Do NOT revoke the old key until the new key is confirmed working in production.

---

### 4.6 Redis Credentials (`REDIS_URL`)

> [!IMPORTANT]
> If using managed Redis (e.g. Upstash, ElastiCache, Aiven), rotation must ensure the application stays connected during credentials rollover.

**Rotation steps (Upstash / Managed Redis):**

1. **Create secondary credentials** in the Redis provider console (e.g., Upstash allows multiple client secrets/connections).
2. **Add the new connection string** to Vercel production variables (`REDIS_URL`).
3. **Deploy** the new version: `vercel deploy --prod`.
4. **Verify** that Redis caching and rate-limiting endpoints are functioning (e.g., attempt multiple fast logins or uploads and ensure `X-RateLimit` headers are returned).
5. **Delete/revoke the old credentials** in the Redis provider console.

---

### 4.7 Resend API Key (`RESEND_API_KEY`)

**Rotation steps (Resend Console):**

1. Log in to the **Resend Dashboard** (`resend.com/api-keys`).
2. Click **Create API Key**. Give it an appropriate name and restrict access to the specific domain if required.
3. **Store the new key** in 1Password.
4. **Update Vercel env** variable `RESEND_API_KEY` with the new value.
5. **Deploy** to Vercel: `vercel deploy --prod`.
6. **Verify email delivery** by requesting a forgot-password link or triggering a test alert.
7. **Delete the old API key** in the Resend Dashboard.

---

## 5. Local Environment Rotation

For local development:

1. **Never commit `.env`** — it is in `.gitignore`.
2. After rotating, update your local `.env` file manually.
3. Use `.env.example` as the canonical reference for which variables are required (values should be placeholders only).
4. Share new development credentials through 1Password (not Slack/email).

```bash
# Verify your .env matches .env.example keys
diff <(grep -oP '^\w+' .env.example | sort) <(grep -oP '^\w+' .env | sort)
```

---

## 6. Production (Vercel) Rotation — General Pattern

```bash
# 1. List current env vars
vercel env ls

# 2. Pull current env to local (for reference only — never commit)
vercel env pull .env.vercel.local

# 3. Add/update the new secret
vercel env add SECRET_NAME production

# 4. Redeploy to pick up the new value
vercel deploy --prod

# 5. Verify the application health
curl https://your-app.vercel.app/api/health

# 6. Remove old secret if it was added under a different name
vercel env rm OLD_SECRET_NAME production
```

---

## 7. Emergency Rotation (Suspected Compromise)

> [!CAUTION]
> If you believe a secret has been compromised, treat it as **confirmed compromised** and act immediately.

```
1. REVOKE the compromised secret immediately (don't wait for verification).
2. Rotate ALL secrets in the same category (e.g., if one AWS key is compromised, rotate ALL AWS keys).
3. Check AWS CloudTrail / Vercel logs for unauthorized API calls in the past 30 days.
4. File an incident report within 1 hour.
5. Notify affected users if any data was accessed.
6. Perform a full audit of secrets inventory.
```

**Incident report template:** `docs/incident-report-template.md`

---

## 8. Post-Rotation Verification Checklist

After every rotation, verify:

- [ ] `/api/health` returns 200 OK (verifies active Prisma database and Redis cache connectivity)
- [ ] Test login flow (auth secret rotation)
- [ ] Test file upload (S3/MinIO key rotation)
- [ ] Test AI generation endpoint (AI key rotation)
- [ ] Test email delivery (Resend key rotation)
- [ ] No new errors in Sentry for 15 minutes post-deploy
- [ ] Rate limiting still functional (Redis URL rotation)
- [ ] Update the secret's "Last Rotated" date in the secret inventory spreadsheet

---

## 9. Audit Trail

Every rotation **must** be logged in the team's change log with:

| Field           | Value                                               |
| --------------- | --------------------------------------------------- |
| Date            | ISO 8601 timestamp                                  |
| Secret rotated  | Name of the env var                                 |
| Rotated by      | Engineer name                                       |
| Reason          | Scheduled / Suspected compromise / Policy violation |
| Verification    | Pass / Fail                                         |
| Incident ticket | N/A or link                                         |

---

_This document should be reviewed and updated quarterly or after any security incident._
