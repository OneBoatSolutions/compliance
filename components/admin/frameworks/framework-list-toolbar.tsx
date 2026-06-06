"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

import { FrameworkListStats } from "./framework-list-stats";

const statusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const regionOptions = ["US", "EU", "UK", "Global", "India"] as const;
const categoryOptions = ["Privacy", "Security", "Healthcare", "Financial"] as const;

function setParam(params: URLSearchParams, key: string, value: string, resetPage = key !== "page") {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  if (resetPage) {
    params.delete("page");
  }
}

interface FrameworkListToolbarProps {
  total: number;
  published: number;
  draft: number;
}

export function FrameworkListToolbar({ total, published, draft }: FrameworkListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const statusFilter = searchParams.get("status") ?? "";
  const regionFilter = searchParams.get("region") ?? "";
  const categoryFilter = searchParams.get("category") ?? "";
  useEffect(() => {
    const current = searchParams.get("search") ?? "";

    if (debouncedSearch === current) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    setParam(params, "search", debouncedSearch);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [debouncedSearch, pathname, router, searchParams, startTransition]);

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      setParam(params, key, value);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  const hasActiveFilters = Boolean(statusFilter || regionFilter || categoryFilter || searchInput);

  return (
    <>
      <div className="overflow-hidden rounded-[32px] border border-[#e9ddff] bg-gradient-to-br from-[#6d18ff] via-[#7c3aed] to-[#4c1d95] p-10 text-white shadow-2xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold leading-tight">Framework Management</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Manage compliance frameworks, publish validated standards, organize controls, and
              streamline enterprise governance workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/frameworks/new"
                className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-[#6d18ff] shadow-lg transition hover:scale-[1.02]"
              >
                + Create Framework
              </Link>
            </div>
          </div>
          <FrameworkListStats total={total} published={published} draft={draft} />
        </div>
      </div>

      <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-7 shadow-sm">
        <section aria-label="Framework filters">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#171717]">Framework Directory</h2>
                <p className="mt-1 text-sm text-[#737373]">
                  Search and filter frameworks by status, region, and category
                </p>
              </div>
              <div
                aria-live="polite"
                className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#525252]"
              >
                {isPending ? "Updating..." : `Showing ${total} frameworks`}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="framework-search" className="sr-only">
                Search frameworks
              </label>
              <input
                id="framework-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search frameworks by name, code, or category..."
                className="w-full rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-sm outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => updateFilters({ status: event.target.value })}
                className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by region"
                value={regionFilter}
                onChange={(event) => updateFilters({ region: event.target.value })}
                className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              >
                <option value="">All Regions</option>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(event) => updateFilters({ category: event.target.value })}
                className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateFilters({ status: "", region: "", category: "", search: "" });
                  }}
                  className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] outline-none focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
