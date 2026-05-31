import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/** Routes that only authenticated users (any role) can access. */
const protectedUserRoutes = ["/dashboard", "/assessments", "/onboarding", "/reports", "/settings"];

/** Routes that ONLY the USER role (not ADMIN) may access. Currently none — both roles can use all user routes per the PRD RBAC table. */
const userOnlyRoutes: string[] = [];

/** Routes that ONLY the ADMIN role may access. */
const adminRoutes = ["/admin", "/frameworks"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // ✅ Logging (only in development)
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const roleHome = token?.role === "ADMIN" ? "/frameworks" : "/dashboard";

  // ✅ Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }

  // ✅ Protect user routes — any authenticated user may access
  const isProtectedUserRoute =
    pathname.startsWith("/user") || protectedUserRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedUserRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Protect admin-only routes
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ✅ Protect user-only routes (if any exist in the future)
  const isUserOnlyRoute = userOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isUserOnlyRoute && token?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/frameworks", req.url));
  }

  const response = NextResponse.next();

  // ✅ CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

// ✅ Apply middleware to API + protected routes
export const config = {
  matcher: [
    "/api/:path*",
    "/login",
    "/register",
    "/admin/:path*",
    "/frameworks/:path*",
    "/user/:path*",
    "/dashboard/:path*",
    "/assessments/:path*",
    "/onboarding/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
