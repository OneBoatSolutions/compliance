"use client";

import { Role } from "@prisma/client";
import type { UserPublic } from "@/services/user-admin-service";
import { UserStatusBadge } from "./user-status-badge";
import { UserRowActions } from "./user-row-actions";

interface UsersTableProps {
  users: UserPublic[];
  currentUserId: string;
  onEdit: (user: UserPublic) => void;
}

const formatDate = (date: Date | string | null) => {
  if (!date) {
    return "Never";
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Never";
  }
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function UsersTable({ users, currentUserId, onEdit }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm text-slate-500">
          <thead className="bg-[#fafafa] text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-[#e5e5e5]">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                Email
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                Role
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                Created At
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                Last Login
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                Status
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-900 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f5]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{user.name}</span>
                      {user.id === currentUserId && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.role === Role.ADMIN
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-slate-50 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <UserStatusBadge isActive={user.isActive} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <UserRowActions user={user} currentUserId={currentUserId} onEdit={onEdit} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
