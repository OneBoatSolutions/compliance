/** @type {import('next').NextConfig} */

// ---------------------------------------------------------------------------
// Security Headers — Sprint 9.1 Security Hardening
// ---------------------------------------------------------------------------
// CSP is enforced at TWO layers:
//   1. next.config.js  → sets a static baseline (used during `next build`
//      static export and as a fallback when middleware doesn't run).
//   2. middleware.ts   → injects a per-request cryptographic nonce and builds
//      a strict nonce-based CSP, overriding the static baseline for every
//      dynamic request (recommended for Next.js App Router).
//
// Do NOT add 'unsafe-inline' to script-src here — the nonce in middleware
// replaces it for inline scripts injected by Next.js itself.
// ---------------------------------------------------------------------------

const isDev = process.env.NODE_ENV === "development";

/**
 * Trusted external origins — keep this list minimal.
 * Mirror any additions in middleware.ts → buildCspHeader().
 */
const trustedImgOrigins = [
  "https://images.unsplash.com",
  "https://lh3.googleusercontent.com", // Google OAuth avatars (if ever added)
];

const trustedConnectOrigins = isDev
  ? ["ws://localhost:*", "http://localhost:*"] // Next.js HMR websocket
  : [];

/**
 * Static CSP used by next.config.js headers() for SSG pages and as a
 * build-time baseline.  For SSR routes the middleware overrides this with
 * a nonce-based policy (see middleware.ts).
 */
function buildStaticCsp() {
  return [
    "default-src 'self'",
    // 'unsafe-inline' is necessary here ONLY because next.config.js headers()
    // cannot inject a per-request nonce. The middleware nonce-CSP (stricter)
    // takes precedence for all SSR routes.
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${trustedImgOrigins.join(" ")}`,
    "font-src 'self' data:",
    `connect-src 'self' ${trustedConnectOrigins.join(" ")}`.trimEnd(),
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ]
    .map((d) => d.trim())
    .join("; ");
}

const securityHeaders = [
  // ── Transport Security ────────────────────────────────────────────────────
  {
    // 2-year max-age; only enable preload if you submit to the HSTS preload list.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // ── Framing / Clickjacking ────────────────────────────────────────────────
  {
    key: "X-Frame-Options",
    value: "DENY", // Redundant with CSP frame-ancestors but belt-and-suspenders.
  },

  // ── MIME sniffing ─────────────────────────────────────────────────────────
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  // ── DNS prefetch ──────────────────────────────────────────────────────────
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },

  // ── Referrer ──────────────────────────────────────────────────────────────
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  // ── Permissions / Feature Policy ──────────────────────────────────────────
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()", // Disable FLoC
      "payment=()",
      "usb=()",
    ].join(", "),
  },

  // ── Cross-Origin policies ─────────────────────────────────────────────────
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },

  // ── Content Security Policy (static baseline) ────────────────────────────
  {
    key: "Content-Security-Policy",
    value: buildStaticCsp(),
  },
];

const nextConfig = {
  // In Next.js 15, serverComponentsExternalPackages moved to the top level.
  serverExternalPackages: ["pdfkit", "svg-to-pdfkit"],

  images: {
    // Prefer remotePatterns (hostname + pathname glob) over the deprecated `domains`.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply to every route — middleware will override CSP with a nonce
        // for dynamic (SSR) routes, keeping these as a safe static fallback.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Prevent server-side source maps from leaking into the client bundle.
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
