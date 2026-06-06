"use client";

import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RouteErrorProps {
  reset: () => void;
}

export default function RouteError({ reset }: RouteErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#faf7ff] to-[#e9ddff] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9ddff]">
          <AlertTriangle className="h-8 w-8 text-[#6d18ff]" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-neutral-900">Something went wrong</h1>

        <p className="mb-8 text-neutral-600">
          Cipherion encountered an unexpected issue while loading this page. Your data is safe and
          no information has been lost.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => reset()} className="bg-[#6d18ff] hover:bg-[#5412cc]">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
