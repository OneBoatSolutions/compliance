/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "svg-to-pdfkit"],
  },
  images: {
    domains: ["example.com", "images.unsplash.com"],
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
            //key: "Content-Security-Policy",
            //value:
            //"default-src 'self'; img-src 'self' https://example.com https://images.unsplash.com;",

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
    ];
  },
};

module.exports = nextConfig;
