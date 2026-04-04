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
  limit: z.coerce.number().int().min(1).max(100).default(20),
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

/** Single CSV row — same shape as create control */
export const controlCsvRowSchema = createControlSchema;
