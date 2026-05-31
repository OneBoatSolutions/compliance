/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
    serverComponentsExternalPackages: ["pdfkit", "svg-to-pdfkit"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: `
               default-src 'self';
               script-src 'self' 'unsafe-inline' 'unsafe-eval';
               style-src 'self' 'unsafe-inline';
               img-src 'self' https://example.com https://images.unsplash.com data:;
              font-src 'self' data:;
              `.replace(/\n/g, ""),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
