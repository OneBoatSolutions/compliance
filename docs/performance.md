# Performance (Task 8.4)

## NFR targets

| Metric | Target |
|--------|--------|
| FCP | < 1.5s |
| LCP | < 2.5s |
| TTI (Lighthouse: interactive) | < 3.5s |
| Lighthouse category scores | > 90 |
| Simple DB queries (p95) | < 50ms |
| Complex DB queries (p95) | < 200ms |
| Score recalculation (p95) | < 100ms |

## Prerequisites

- **DB perf check:** Docker Postgres running (`docker compose up -d db`), migrations applied, seed data (`pnpm exec prisma db seed`).
- **Lighthouse:** Production server on port 3000 (`pnpm build && pnpm start`).

## Commands

```bash
# Database NFR (requires seeded DB)
pnpm test:perf:db

# Production build + bundle analysis
pnpm analyze

# Lighthouse CI (server must be running on :3000)
pnpm build && pnpm start
pnpm test:perf:lighthouse
```

## Env tuning

```env
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=0
DATABASE_POOL_IDLE_MS=30000
DATABASE_POOL_CONNECTION_TIMEOUT_MS=5000
API_COMPRESS_MIN_BYTES=1024
```

Use `DATABASE_URL_UNPOOLED` for migrations and `pnpm test:perf:db`.

## Latest Lighthouse run (local production build)

| Page | FCP | LCP | TTI (interactive) | Performance score |
|------|-----|-----|-------------------|-------------------|
| `/login` | ~0.3s | ~0.6s | ~0.6s | 100 |
| `/dashboard` | (redirects to `/login` without auth) | — | — | — |

All `lighthouserc.json` assertions passed on `/login`. For authenticated `/dashboard`, run Lighthouse with a stored session or test in staging with auth cookies.
