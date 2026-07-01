"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Role } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createAdminUserSchema, type CreateAdminUserInput } from "@/lib/validations/user";
import { apiClient } from "@/lib/api-client";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-white px-5 py-4 text-sm text-[#171717] shadow-sm outline-none transition duration-200 placeholder:text-[#a3a3a3] focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]";

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminUserInput>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: Role.USER,
      password: "",
    },
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: (data: CreateAdminUserInput) => apiClient.post("/api/admin/users", { body: data }),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      reset();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const onSubmit = (data: CreateAdminUserInput) => {
    createUser(data);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-md rounded-[28px] border border-[#e5e5e5] bg-white p-0 shadow-2xl overflow-hidden"
        aria-describedby="create-user-description"
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
            <DialogTitle className="text-2xl font-bold text-[#171717]">Create New User</DialogTitle>
            <DialogDescription className="text-sm text-[#737373] mt-1" id="create-user-description">
              Add a new user with dedicated role assignment. An email notification will not be sent,
              they can log in using their credentials immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">
                Full Name
              </label>
              <input
                type="text"
                aria-label="Full name"
                aria-required="true"
                placeholder="John Doe"
                className={inputClass}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-rose-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">
                Email Address
              </label>
              <input
                type="email"
                aria-label="Email address"
                aria-required="true"
                placeholder="john@example.com"
                className={inputClass}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs font-semibold text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">Role</label>
              <select className={inputClass} {...register("role")} aria-label="Select user role">
                <option value={Role.USER}>User (Auditor/Member)</option>
                <option value={Role.ADMIN}>Admin (Full Access)</option>
              </select>
              {errors.role && (
                <p className="text-xs font-semibold text-rose-600">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-[#171717]">Password</label>
              <input
                type="password"
                aria-label="Password"
                aria-required="true"
                placeholder="••••••••"
                className={inputClass}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs font-semibold text-rose-600 max-w-sm whitespace-pre-wrap leading-tight">
                  {errors.password.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-[#f5f5f5] pt-5">
              <Button
                type="button"
                aria-label="Cancel user creation"
                variant="outline"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="rounded-2xl border border-[#d4d4d4] bg-white px-5 py-3.5 text-sm font-semibold text-[#525252] hover:bg-[#fafafa]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                aria-label="Create new user"
                disabled={isPending}
                className="rounded-2xl bg-[#6d18ff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(109,24,255,0.28)] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
