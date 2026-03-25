"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AuthRouteTransitionProps {
  children: ReactNode;
}

export default function AuthRouteTransition({ children }: AuthRouteTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="auth-route-enter">
      {children}
    </div>
  );
}
