"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateAdminUserSchema, type UpdateAdminUserInput } from "@/lib/validations/user";
import { apiClient } from "@/lib/api-client";
import type { UserPublic } from "@/services/user-admin-service";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserPublic | null;
  currentUserId: string;
}

const inputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-white px-5 py-4 text-sm text-[#171717] shadow-sm outline-none transition duration-200 placeholder:text-[#a3a3a3] focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]";

const disabledInputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-sm text-[#737373] shadow-sm cursor-not-allowed outline-none";

export function EditUserModal({ isOpen, onClose, user, currentUserId }: EditUserModalProps) {
  const queryClient = useQueryClient();
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isSelf = user?.id === currentUserId;

  const {
    register,
    handleSubmit,

    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateAdminUserInput>({
    resolver: zodResolver(updateAdminUserSchema),
    defaultValues: {
      role: user?.role ?? Role.USER,
      isActive: user?.isActive ?? true,
    },
  });

  const selectedIsActive = watch("isActive");

  useEffect(() => {
    if (user) {
      reset({
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);

  // Show warning if user toggles isActive to false
  useEffect(() => {
    if (selectedIsActive === false && user?.isActive === true) {
      setShowDeactivateConfirm(true);
    } else {
      setShowDeactivateConfirm(false);
    }
  }, [selectedIsActive, user]);

  useEffect(() => {
    if (showDeleteConfirm) {
      setShowDeactivateConfirm(false);
      return;
    }

    if (selectedIsActive === false && user?.isActive === true) {
      setShowDeactivateConfirm(true);
    } else {
      setShowDeactivateConfirm(false);
    }
  }, [selectedIsActive, user, showDeleteConfirm]);

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data: UpdateAdminUserInput) =>
      apiClient.patch(`/api/admin/users/${user?.id}`, { body: data }),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/users/${user?.id}`),

    onSuccess: () => {
      toast.success("User deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      onClose();
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const onSubmit = (data: UpdateAdminUserInput) => {
    updateUser(data);
  };
  const handleDelete = () => {
    deleteUserMutation();
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-md rounded-[28px] border border-[#e5e5e5] bg-white p-0 shadow-2xl overflow-hidden"
        aria-describedby="edit-user-description"
      >
        <div
          className="max-h-[90vh] overflow-y-auto p-7 pr-5 
       [&::-webkit-scrollbar]:w-2
       [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-[#d4d4d8]/60
         hover:[&::-webkit-scrollbar-thumb]:bg-[#a1a1aa]/70"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#171717]">
              Edit User Profile
            </DialogTitle>
            <DialogDescription className="text-sm text-[#737373] mt-1" id="edit-user-description">
              Update role permissions or deactivate user access.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">
                Full Name
              </label>
              <input
                type="text"
                readOnly
                className={disabledInputClass}
                value={user.name}
                aria-label="Full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                className={disabledInputClass}
                value={user.email}
                aria-label="Email address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">Role</label>
              {isSelf ? (
                <div className="relative">
                  <select
                    className={disabledInputClass}
                    disabled
                    value={user.role}
                    aria-label="User role"
                  >
                    <option value={Role.ADMIN}>Admin (Full Access)</option>
                    <option value={Role.USER}>User (Auditor/Member)</option>
                  </select>
                  <p className="text-xs text-[#8b5cf6] font-medium mt-1">
                    You cannot demote your own account.
                  </p>
                </div>
              ) : (
                <select className={inputClass} {...register("role")}>
                  <option value={Role.USER}>User (Auditor/Member)</option>
                  <option value={Role.ADMIN}>Admin (Full Access)</option>
                </select>
              )}
              {errors.role && (
                <p className="text-xs font-semibold text-rose-600">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">
                Account Status
              </label>
              {isSelf ? (
                <div className="relative">
                  <select
                    className={disabledInputClass}
                    disabled
                    value="true"
                    aria-label="Account status"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <p className="text-xs text-[#8b5cf6] font-medium mt-1">
                    You cannot deactivate your own account.
                  </p>
                </div>
              ) : (
                <select
                  className={inputClass}
                  {...register("isActive", {
                    setValueAs: (val) => val === "true",
                  })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              )}
              {errors.isActive && (
                <p className="text-xs font-semibold text-rose-600">{errors.isActive.message}</p>
              )}
            </div>

            {showDeactivateConfirm && !isSelf && (
              <div
                className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex gap-3 text-rose-800"
                role="alert"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                <div className="text-xs font-medium space-y-1">
                  <p className="font-bold text-rose-900">Deactivation Warning</p>
                  <p>
                    Deactivating this user will immediately revoke all access permissions, block
                    future log-in attempts, and terminate active sessions.
                  </p>
                </div>
              </div>
            )}
            {showDeleteConfirm && (
              <div
                className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex gap-3 text-rose-800"
                role="alert"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />

                <div className="text-xs font-medium space-y-3 w-full">
                  <div>
                    <p className="font-bold text-rose-900">Delete User Warning</p>

                    <p>
                      This action cannot be undone. The user account and access permissions will be
                      permanently deleted.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      aria-label="Delete user"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-[#f5f5f5] pt-5">
              <Button
                type="button"
                variant="destructive"
                disabled={isSelf || isDeleting}
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-2xl"
                aria-label="Delete user"
              >
                Delete User
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-2xl border border-[#d4d4d4] bg-white px-5 py-3.5 text-sm font-semibold text-[#525252] hover:bg-[#fafafa]"
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-2xl bg-[#6d18ff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(109,24,255,0.28)] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Save user changes"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
