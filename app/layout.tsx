import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // valid Google Fonts
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
// Replace Geist with Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Replace Geist Mono with Roboto Mono
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compliance",
  description: "Compliance Dashboard",
  icons: [],
};

/**
 * Root layout — async Server Component so we can read the per-request nonce
 * that middleware.ts injects via the `x-nonce` header.
 *
 * HOW THE NONCE PROPAGATION ACTUALLY WORKS (Next.js 15):
 *   The browser does NOT process or enforce the `nonce` attribute on `<html>` —
 *   it is not a valid HTML5 nonce location.  However, Next.js 15's React SSR
 *   engine inspects the `nonce` prop on the root `<html>` element during
 *   server-side rendering and uses it to stamp `nonce="..."` onto every
 *   framework-generated inline `<script>` tag (hydration chunks, router state,
 *   etc.) BEFORE the HTML is sent to the browser.  The browser then validates
 *   those script tags against the CSP nonce in the response header.
 *
 *   Reference: https://nextjs.org/docs/app/guides/content-security-policy
 *
 *   For any explicit `<Script>` components you add, pass nonce as a prop:
 *     <Script src="..." nonce={nonce} />
 *   The nonce is forwarded to AppProviders for this purpose.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the nonce forwarded by middleware.ts via a custom request header.
  // Falls back to undefined (not empty string) so the attribute is omitted
  // entirely when middleware hasn't run (e.g. static export fallback).
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    // Next.js SSR reads this nonce prop and propagates it to all
    // framework-generated <script> tags before the browser sees the HTML.
    <html lang="en" suppressHydrationWarning nonce={nonce}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {/* Pass nonce to providers so child <Script> components can consume it */}
        <AppProviders nonce={nonce}>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
