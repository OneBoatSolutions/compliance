"use client";

import { createContext, useContext } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";

// ---------------------------------------------------------------------------
// Nonce context — distributes the per-request CSP nonce to client components.
// Server components read nonce directly from headers(); client components
// (e.g. those rendering <Script>) must use this context instead.
// ---------------------------------------------------------------------------
const NonceContext = createContext<string | undefined>(undefined);

/** Consume the CSP nonce in a client component: const nonce = useNonce(); */
export function useNonce(): string | undefined {
  return useContext(NonceContext);
}

interface AppProvidersProps {
  children: React.ReactNode;
  /** Per-request CSP nonce forwarded from the root layout server component. */
  nonce?: string;
}

export function AppProviders({ children, nonce }: AppProvidersProps) {
  return (
    <NonceContext.Provider value={nonce}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
        nonce={nonce}
      >
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </NextThemesProvider>
    </NonceContext.Provider>
  );
}
