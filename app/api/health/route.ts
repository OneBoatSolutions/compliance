import { NextResponse } from "next/server";

// NOTE: Do NOT add `export const revalidate` here.
// Caching this route freezes the `timestamp` field in the response body.
// Monitoring tools (Datadog, Route53, Uptime Robot) that compare the
// timestamp to wall-clock time will read a stale value and fire false
// "server stuck / not responding" alerts.
//
// ── Liveness vs. Readiness ────────────────────────────────────────────────
// This endpoint is a LIVENESS probe only. It answers a single question:
//   "Is this Node.js process alive and able to accept HTTP connections?"
//
// It intentionally does NOT:
//   • Check database reachability  (see /api/ready)
//   • Check Redis reachability     (see /api/ready)
//   • Apply a Redis-backed rate limiter (that would create a circular failure:
//     Redis down → rate-limiter throws → health endpoint returns 503 →
//     orchestrator marks node unhealthy → traffic is drained even though the
//     web process and primary DB are both fully operational)
//
// Deep infrastructure dependency checks live at /api/ready so that
// load-balancers / Kubernetes liveness probes can use THIS endpoint, while
// readiness probes / uptime dashboards use /api/ready.
//
// ── DDoS Protection ──────────────────────────────────────────────────────
// Rate-limiting at the application layer is deliberately ABSENT here.
// Liveness probes must never be blocked by 429 responses — a single shared
// egress IP used by Kubernetes, load-balancers, and uptime monitors would
// immediately exhaust a per-IP budget and generate false "node down" alerts.
//
// Flood protection for this route belongs at the infrastructure layer:
//   • Nginx/Caddy: limit_req zone per source CIDR
//   • Cloud load-balancer WAF rules
//   • Network-level rate limiting on the ingress controller
// Those controls are transparent to application-level monitors.

export async function GET() {
  const response = NextResponse.json(
    {
      // "ok" signals the process is alive. It does NOT imply all downstream
      // dependencies are reachable — use /api/ready for that.
      status: "ok",
      // Monitors compare this timestamp against wall-clock time to detect
      // hung or frozen processes. Must be fresh on every request.
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "1.0.0",
    },
    { status: 200 },
  );

  // Prevent all caching layers (CDN, browser, reverse proxy) from storing
  // this response. A stale liveness response is worse than no response at all.
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");

  return response;
}
