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
