"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    if (hasHydrated) {
      return;
    }

    void checkSession().catch(() => {
      // Ignore hydration errors here; route protection is handled by middleware.
    });
  }, [checkSession, hasHydrated]);

  return <>{children}</>;
}
