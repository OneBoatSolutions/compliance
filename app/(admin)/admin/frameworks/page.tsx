"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { ApiResponse, Framework, FrameworkListData } from "@/types/framework";

import { FrameworkTable } from "@/components/admin/frameworks/framework-table";

const StatusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const RegionOptions = ["US", "EU", "UK", "Global", "India"];

const CategoryOptions = ["Privacy", "Security", "Healthcare", "Financial"];

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("");

  const [regionFilter, setRegionFilter] = useState<string>("");

  const [categoryFilter, setCategoryFilter] = useState<string>("");

  async function fetchFrameworks() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      const response = await fetch(`/api/frameworks?${params.toString()}`);

      const result: ApiResponse<FrameworkListData> = await response.json();

      if (!result.success) {
        setError(result.message);

        setFrameworks([]);

        return;
      }

      setFrameworks(result.data.items);

      setTotalPages(result.data.meta.totalPages);
    } catch (error) {
      console.error(error);

      setError("Failed to load frameworks");

      setFrameworks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchFrameworks();
  }, [page]);

  const filteredFrameworks = useMemo(() => {
    return frameworks.filter((framework) => {
      const value = search.toLowerCase();

      const matchesSearch =
        framework.name.toLowerCase().includes(value) ||
        framework.code.toLowerCase().includes(value) ||
        framework.category.toLowerCase().includes(value);

      const matchesStatus = !statusFilter || framework.status === statusFilter;

      const matchesRegion = !regionFilter || framework.region === regionFilter;

      const matchesCategory = !categoryFilter || framework.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesRegion && matchesCategory;
    });
  }, [frameworks, search, statusFilter, regionFilter, categoryFilter]);

  const draftCount = frameworks.filter((framework) => framework.status === "DRAFT").length;

  const publishedCount = frameworks.filter((framework) => framework.status === "PUBLISHED").length;

  const archivedCount = frameworks.filter((framework) => framework.status === "ARCHIVED").length;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="space-y-8">
          {/* HERO */}

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
                    href="/admin/frameworks/new"
                    className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-[#6d18ff] shadow-lg transition hover:scale-[1.02]"
                  >
                    + Create Framework
                  </Link>
                </div>
              </div>

              {/* STATS */}

              <div className="grid w-full max-w-xl grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm font-medium uppercase tracking-wide text-white/70">Total</p>

                  <h2 className="mt-3 text-4xl font-bold">{frameworks.length}</h2>

                  <p className="mt-2 text-sm text-white/70">Active frameworks</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                    Published
                  </p>

                  <h2 className="mt-3 text-4xl font-bold text-[#86efac]">{publishedCount}</h2>

                  <p className="mt-2 text-sm text-white/70">Production ready</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                    Drafts
                  </p>

                  <h2 className="mt-3 text-4xl font-bold text-[#fde68a]">{draftCount}</h2>

                  <p className="mt-2 text-sm text-white/70">In progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS */}

          <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#171717]">Framework Directory</h2>

                  <p className="mt-1 text-sm text-[#737373]">
                    Search and filter frameworks by status, region, and category
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#525252]">
                  Showing {filteredFrameworks.length} frameworks
                </div>
              </div>

              {/* SEARCH */}

              <div className="relative">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search frameworks..."
                  className="w-full rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-sm outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
                />
              </div>

              {/* FILTER GRID */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
                >
                  <option value="">All Status</option>

                  {StatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <select
                  value={regionFilter}
                  onChange={(event) => setRegionFilter(event.target.value)}
                  className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
                >
                  <option value="">All Regions</option>

                  {RegionOptions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="rounded-2xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]"
                >
                  <option value="">All Categories</option>

                  {CategoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTIVE FILTERS */}

              {(statusFilter || regionFilter || categoryFilter) && (
                <div className="flex flex-wrap gap-3">
                  {statusFilter && (
                    <div className="rounded-full bg-[#e9ddff] px-4 py-2 text-sm font-medium text-[#6d18ff]">
                      Status: {statusFilter}
                    </div>
                  )}

                  {regionFilter && (
                    <div className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-medium text-[#4c1d95]">
                      Region: {regionFilter}
                    </div>
                  )}

                  {categoryFilter && (
                    <div className="rounded-full bg-[#f5f3ff] px-4 py-2 text-sm font-medium text-[#7c3aed]">
                      Category: {categoryFilter}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setRegionFilter("");
                      setCategoryFilter("");
                    }}
                    className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff]"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ERROR */}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600 shadow-sm">
              {error}
            </div>
          ) : null}

          {/* TABLE */}

          <div className="overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-white shadow-sm">
            <div className="border-b border-[#f5f5f5] px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#171717]">Compliance Frameworks</h3>

                  <p className="mt-1 text-sm text-[#737373]">Secure framework management</p>
                </div>

                <div className="rounded-2xl bg-[#fafafa] px-4 py-2 text-sm font-semibold text-[#525252]">
                  {archivedCount} archived
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="space-y-3 text-center">
                    <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#e9ddff] border-t-[#6d18ff]" />

                    <p className="text-sm font-medium text-[#737373]">Loading frameworks...</p>
                  </div>
                </div>
              ) : (
                <FrameworkTable frameworks={filteredFrameworks} />
              )}
            </div>
          </div>

          {/* PAGINATION */}

          <div className="flex flex-col gap-5 rounded-[28px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mt-1 text-sm text-[#737373]">Navigate through framework pages</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
                disabled={page === 1}
                className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-sm font-semibold text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <div className="rounded-2xl bg-[#6d18ff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6d18ff]/20">
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => setPage((previous) => previous + 1)}
                disabled={page >= totalPages}
                className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-sm font-semibold text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
