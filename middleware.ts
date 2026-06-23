import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";

// ---------------------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------------------
const protectedUserRoutes = ["/dashboard", "/assessments", "/onboarding", "/reports", "/settings"];
const userOnlyRoutes: string[] = [];
const adminRoutes = ["/admin", "/frameworks"];

// ---------------------------------------------------------------------------
// Nonce-based CSP builder
// ---------------------------------------------------------------------------
// A fresh cryptographically random nonce is generated for every request.
// Next.js Script tags (and inline <script> chunks injected during hydration)
// can be whitelisted via this nonce, avoiding the need for 'unsafe-inline'.
//
// To use the nonce in a Server Component:
//   import { headers } from "next/headers";
//   const nonce = headers().get("x-nonce") ?? "";
//   <Script nonce={nonce} ... />
// ---------------------------------------------------------------------------

function generateNonce(): string {
  return randomBytes(16).toString("base64");
}

const trustedImgOrigins = ["https://images.unsplash.com", "https://lh3.googleusercontent.com"];

function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";

  const connectSrc = ["'self'", ...(isDev ? ["ws://localhost:*", "http://localhost:*"] : [])].join(
    " ",
  );

  return [
    "default-src 'self'",
    // nonce allows Next.js inline scripts; 'strict-dynamic' propagates trust
    // to dynamically loaded scripts without needing a full allow-list.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'", // Tailwind requires inline styles
    `img-src 'self' data: blob: ${trustedImgOrigins.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-src 'none'",
    "frame-ancestors 'none'", // Replaces X-Frame-Options for modern browsers
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ]
    .map((d) => d.trim())
    .join("; ");
}

// ---------------------------------------------------------------------------
// CORS policy
// ---------------------------------------------------------------------------
// Never use '*' for Access-Control-Allow-Origin on credentialed APIs.
// Allowlist the exact origins that may call our API with credentials.
// ---------------------------------------------------------------------------
const allowedCorsOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function getCorsOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) {
    return null;
  }
  // In development allow localhost origins for convenience.
  if (
    process.env.NODE_ENV === "development" &&
    (requestOrigin.startsWith("http://localhost") || requestOrigin.startsWith("http://127.0.0.1"))
  ) {
    return requestOrigin;
  }
  return allowedCorsOrigins.includes(requestOrigin) ? requestOrigin : null;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const roleHome = token?.role === "ADMIN" ? "/frameworks" : "/dashboard";

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }

  // Protect user routes
  const isProtectedUserRoute =
    pathname.startsWith("/user") || protectedUserRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedUserRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect admin-only routes
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect user-only routes
  const isUserOnlyRoute = userOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isUserOnlyRoute && token?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/frameworks", req.url));
  }

  // ── Nonce & CSP ───────────────────────────────────────────────────────────
  const nonce = generateNonce();
  const csp = buildCspHeader(nonce);

  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(req.headers.entries()),
        // Forward the nonce to Server Components via a custom header.
        "x-nonce": nonce,
      }),
    },
  });

  // Override the static CSP set in next.config.js with the nonce-based one.
  response.headers.set("Content-Security-Policy", csp);

  // ── CORS (API routes only) ────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const requestOrigin = req.headers.get("origin");
    const allowedOrigin = getCorsOrigin(requestOrigin);

    if (req.method === "OPTIONS") {
      // Pre-flight response
      const preflightHeaders: Record<string, string> = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      };
      if (allowedOrigin) {
        preflightHeaders["Access-Control-Allow-Origin"] = allowedOrigin;
        preflightHeaders["Access-Control-Allow-Credentials"] = "true";
        preflightHeaders["Vary"] = "Origin";
      }
      return new NextResponse(null, { status: 204, headers: preflightHeaders });
    }

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Vary", "Origin");
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static (static files)
     *  - _next/image (image optimisation)
     *  - favicon.ico
     *  - public folder files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
