"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";

import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";

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

interface UsersToolbarProps {
  total: number;
  onCreateClick: () => void;
}

export function UsersToolbar({ total, onCreateClick }: UsersToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const roleFilter = searchParams.get("role") ?? "";
  const isActiveFilter = searchParams.get("isActive") ?? "";

  // Debounced Search Sync
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
  }, [debouncedSearch, pathname, router, searchParams]);

  // General Filter Update
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      setParam(params, key, value);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const hasActiveFilters = Boolean(roleFilter || isActiveFilter || searchInput);

  return (
    <>
      {/* Header Banner */}
      <div className="overflow-hidden rounded-[32px] border border-[#e9ddff] bg-gradient-to-br from-[#6d18ff] via-[#7c3aed] to-[#4c1d95] p-10 text-white shadow-2xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold leading-tight">User Administration</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Manage enterprise access, roles assignment (Admin & User roles), security status
              auditing, and trigger password reset flows.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                onClick={onCreateClick}
                className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-[#6d18ff] shadow-lg hover:bg-slate-50 transition hover:scale-[1.02] border-0 outline-none"
                aria-label="Create new user"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create New User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#171717]">Active Directory</h2>
              <p className="mt-1 text-sm text-[#737373]">
                Search profiles and filter by assigned roles or account status
              </p>
            </div>
            <div
              className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#525252]"
              aria-live="polite"
            >
              {isPending ? "Updating..." : `Showing ${total} users`}
            </div>
          </div>

          <div className="relative">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search users by name or email address..."
              className="w-full rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-sm outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              aria-label="Search users"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              value={roleFilter}
              onChange={(event) => updateFilters({ role: event.target.value })}
              className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              aria-label="Filter users by role"
            >
              <option value="">All Roles</option>
              <option value={Role.ADMIN}>Admin</option>
              <option value={Role.USER}>User</option>
            </select>

            <select
              value={isActiveFilter}
              onChange={(event) => updateFilters({ isActive: event.target.value })}
              className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
              aria-label="Filter users by account status"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ role: "", isActive: "", search: "" });
                }}
                className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff]"
                aria-label="Clear all filters"
              >
                Clear Filters
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
