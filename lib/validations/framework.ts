import { FrameworkStatus, Severity } from "@prisma/client";
import { z } from "zod";

export const createFrameworkSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase, no spaces"),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(1000),
  region: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "Version must follow semantic versioning (e.g., 1.0.0)"),
  effectiveDate: z.coerce.date(),
  sourceLink: z.url().optional(),
});

export type CreateFrameworkInput = z.infer<typeof createFrameworkSchema>;

const versionSemver = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, "Version must follow semantic versioning (e.g., 1.0.0)");

/** Admin API: list query (GET /api/frameworks) */
export const frameworkListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(200).optional(),
  region: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.nativeEnum(FrameworkStatus).optional(),
});

export type FrameworkListQuery = z.infer<typeof frameworkListQuerySchema>;

/** Admin API: create draft framework (POST /api/frameworks) — optional fields get DB defaults in the route */
export const createFrameworkAdminSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase, no spaces"),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  region: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  version: versionSemver.optional(),
  effectiveDate: z.coerce.date().optional(),
  sourceLink: z.union([z.string().url(), z.literal("")]).optional(),
});

export type CreateFrameworkAdminInput = z.infer<typeof createFrameworkAdminSchema>;

/** Admin API: partial update (PATCH /api/frameworks/[id]) */
export const updateFrameworkAdminSchema = createFrameworkAdminSchema
  .partial()
  .extend({
    status: z.nativeEnum(FrameworkStatus).optional(),
    publishedAt: z.coerce.date().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateFrameworkAdminInput = z.infer<typeof updateFrameworkAdminSchema>;

/** Admin API: create control (POST .../controls) */
export const createControlSchema = z.object({
  code: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(5000),
  category: z.string().trim().max(100).optional().nullable(),
  severity: z.nativeEnum(Severity).optional(),
  weight: z.number().min(0.1).max(10).optional(),
});

export type CreateControlInput = z.infer<typeof createControlSchema>;

/** Admin API: update control (PATCH .../controls/[controlId]) */
export const updateControlSchema = createControlSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateControlInput = z.infer<typeof updateControlSchema>;

/** Single CSV row for import — all fields required; no silent defaults */
export const controlCsvRowSchema = z.object({
  code: z.string().trim().min(1, "Code is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(500),
  description: z.string().trim().min(1, "Description is required").max(5000),
  category: z.string().trim().min(1, "Category is required").max(100),
  severity: z.nativeEnum(Severity, { message: "Severity must be LOW, MEDIUM, HIGH, or CRITICAL" }),
  weight: z
    .number({ message: "Weight must be a number" })
    .min(0.1, "Weight must be at least 0.1")
    .max(10, "Weight must be at most 10"),
});

export type ControlCsvRowInput = z.infer<typeof controlCsvRowSchema>;

/** Admin UI: create framework form */
export const frameworkFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Framework code is required")
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase with no spaces"),
  name: z.string().trim().min(1, "Framework name is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(1000),
  region: z.string().trim().min(1, "Region is required"),
  category: z.string().trim().min(1, "Category is required"),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "Version must follow semantic versioning (e.g. 1.0.0)"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  sourceLink: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
});

export type FrameworkFormValues = z.infer<typeof frameworkFormSchema>;

/** Admin UI: edit framework metadata (draft only) */
export const frameworkEditSchema = frameworkFormSchema.pick({
  code: true,
  name: true,
  description: true,
  region: true,
  category: true,
});
