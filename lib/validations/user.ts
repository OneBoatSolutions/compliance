import { Role } from "@prisma/client";
import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";

export const adminUserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") {
        return true;
      }
      if (val === "false") {
        return false;
      }
    }
    return val;
  }, z.boolean().optional()),
});

export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema>;

export const createAdminUserSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(2).max(100),
  role: z.nativeEnum(Role),
  password: registerSchema.shape.password,
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;

export const updateAdminUserSchema = z
  .object({
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: "At least one of role or isActive must be provided",
  });

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
