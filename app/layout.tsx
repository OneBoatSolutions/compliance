import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // valid Google Fonts
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
        />
        <NextThemesProvider attribute="class" defaultTheme="bright" enableSystem={false}>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster richColors position="top-right" />
          </QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="top-right" />
        </NextThemesProvider>
      </body>
    </html>
  );
}
