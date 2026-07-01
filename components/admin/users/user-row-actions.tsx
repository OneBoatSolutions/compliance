"use client";

import { Edit2, KeyRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { UserPublic } from "@/services/user-admin-service";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserRowActionsProps {
  user: UserPublic;
  currentUserId: string;
  onEdit: (user: UserPublic) => void;
}

export function UserRowActions({ user, currentUserId, onEdit }: UserRowActionsProps) {
  const isSelf = user.id === currentUserId;

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: () => apiClient.post(`/api/admin/users/${user.id}/reset-password`),
    onSuccess: () => {
      toast.success(`Password reset link sent to ${user.name}'s email (${user.email})`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger password reset");
    },
  });

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(user)}
              className="h-9 w-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              aria-label={`Edit ${user.name}`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isSelf
              ? "Edit profile (Note: self demote/deactivate is disabled)"
              : "Edit user role & status"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => resetPassword()}
              disabled={isPending}
              className="h-9 w-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              aria-label={`Reset password for ${user.name}`}
            >
              <KeyRound className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Reset Password</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
