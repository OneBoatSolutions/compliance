"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface FrameworkListPaginationProps {
  page: number;
  totalPages: number;
}

export function FrameworkListPagination({ page, totalPages }: FrameworkListPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#737373]">Navigate through framework pages</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => goToPage(Math.max(page - 1, 1))}
          disabled={page <= 1 || isPending}
          className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-sm font-semibold text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <div className="rounded-2xl bg-[#6d18ff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6d18ff]/20">
          Page {page} of {totalPages}
        </div>
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages || isPending}
          className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-sm font-semibold text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
