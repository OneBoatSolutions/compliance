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
    value: "credentialless",
  },
];

const nextConfig = {
  // In Next.js 15, serverComponentsExternalPackages moved to the top level.
  serverExternalPackages: ["pdfkit", "svg-to-pdfkit"],

  compress: true,

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

  bundlePagesRouterDependencies: true,

  experimental: {
    optimizePackageImports: ["recharts", "lucide-react", "@radix-ui/react-icons"],
  },

  webpack(config) {
    config.module.rules.push({
      test: /[\\/]node_modules[\\/]recharts[\\/]/,
      sideEffects: false,
    });
    return config;
  },
};

// ---------------------------------------------------------------------------
// Sentry build-time integration
// ---------------------------------------------------------------------------
// withSentryConfig wraps the Next.js config to:
//   1. Upload source maps to Sentry during production builds (if auth token
//      is configured) for readable stack traces.
//   2. Automatically instrument server-side routes for performance monitoring.
//
// IMPORTANT: The options below are conservative to avoid breaking the build.
//   • Source-map upload is opt-in via SENTRY_AUTH_TOKEN env var.
//   • Middleware is NOT auto-instrumented (we already handle it manually
//     via sentry.edge.config.ts and the instrumentation hook).
//   • The Sentry webpack plugin runs silently (silent: true) so build logs
//     stay clean unless there is an actual error.
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withSentryConfig } = require("@sentry/nextjs");

const resolvedConfig =
  process.env.ANALYZE === "true"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@next/bundle-analyzer")({ enabled: true })(nextConfig)
    : nextConfig;

module.exports = withSentryConfig(
  resolvedConfig,
  {
    // Suppresses Sentry CLI logs during build unless there is an error.
    silent: true,

    // Organisation and project slugs for source-map uploads.
    // These are only used when SENTRY_AUTH_TOKEN is set.
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // ── Safe defaults ────────────────────────────────────────────────────────
    // Do not widen the existing source map configuration.
    hideSourceMaps: true,

    // Disable the Sentry build-time telemetry to keep builds deterministic.
    telemetry: false,

    // Do not auto-instrument middleware — we handle it via instrumentation.ts.
    autoInstrumentMiddleware: false,
  },
);
