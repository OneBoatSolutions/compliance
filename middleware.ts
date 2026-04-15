import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedUserRoutes = ["/dashboard", "/assessments" , "/reports", "/settings"];
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // ✅ Logging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const roleHome = token?.role === "ADMIN" ? "/admin/frameworks" : "/dashboard";

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }

  // ✅ Protect user routes
  if (
    (pathname.startsWith("/user") ||
      protectedUserRoutes.some((route) => pathname.startsWith(route))) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token?.role === "ADMIN" && protectedUserRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/admin/frameworks", req.url));
  }

  // ✅ Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
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
    "/user/:path*",
    "/dashboard/:path*",
    "/assessments/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
