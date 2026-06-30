"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { UsersToolbar } from "./users-toolbar";
import { UsersTable } from "./users-table";
import { CreateUserModal } from "./create-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import type { UserPublic } from "@/services/user-admin-service";
import { AlertCircle } from "lucide-react";

interface UserManagementClientProps {
  currentUserId: string;
}

interface UserListResponse {
  items: UserPublic[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function UserManagementClient({ currentUserId }: UserManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
  // Extract query filters from URL
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const role = searchParams.get("role") ?? "";
  const isActive = searchParams.get("isActive") ?? "";

  // React Query Fetching
  const { data, isLoading, isError, error, refetch } = useQuery<UserListResponse>({
    queryKey: ["admin-users", page, search, role, isActive],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search) {
        params.set("search", search);
      }
      if (role) {
        params.set("role", role);
      }
      if (isActive) {
        params.set("isActive", isActive);
      }
      return apiClient.get<UserListResponse>(`/api/admin/users?${params.toString()}`);
    },
  });

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleEdit = (user: UserPublic) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">
      <div className="mx-auto w-full max-w-full px-4 md:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <UsersToolbar total={data?.meta?.total ?? 0} onCreateClick={() => setCreateOpen(true)} />

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-sm">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-center flex flex-col items-center gap-4">
              <AlertCircle className="h-10 w-10 text-rose-600 animate-pulse" />
              <div>
                <p className="text-lg font-bold text-rose-900">Error Loading Users</p>
                <p className="text-sm text-rose-700 mt-1">
                  {error instanceof Error ? error.message : "Failed to load admin user list"}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="mt-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 hover:bg-rose-700 transition"
                aria-label="Retry loading users"
              >
                Retry Request
              </button>
            </div>
          ) : data ? (
            <>
              <UsersTable users={data.items} currentUserId={currentUserId} onEdit={handleEdit} />

              {data.meta.totalPages > 1 && (
                <div
                  className="flex flex-col gap-5 rounded-[28px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  aria-live="polite"
                >
                  <p className="text-sm text-[#737373]">Navigate through registered user pages</p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      aria-label="Go to previous page"
                      onClick={() => goToPage(Math.max(page - 1, 1))}
                      disabled={page <= 1 || isPending}
                      className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-sm font-semibold text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <div className="rounded-2xl bg-[#6d18ff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6d18ff]/20">
                      Page {page} of {data.meta.totalPages}
                    </div>
                    <button
                      type="button"
                      aria-label="Go to next page"
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= data.meta.totalPages || isPending}
                      className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-sm font-semibold text-[#525252] transition hover:border-[#6d18ff] hover:text-[#6d18ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}

          <CreateUserModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />

          <EditUserModal
            isOpen={editOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}
