import { z } from "zod";
import { Severity } from "@prisma/client";

export const createAssessmentSchema = z.object({
  organizationId: z.cuid(),
  frameworkIds: z.array(z.cuid()).min(1, "At least one framework must be selected"),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;

export const assessmentItemStatusSchema = z.enum([
  "NOT_STARTED",
  "COMPLIANT",
  "PARTIALLY_COMPLIANT",
  "NOT_COMPLIANT",
  "NOT_APPLICABLE",
]);

export const updateAssessmentItemSchema = z
  .object({
    status: assessmentItemStatusSchema.optional(),
    comments: z.string().trim().max(2000).nullable().optional(),
    owner: z.string().trim().max(200).nullable().optional(),
    targetDate: z.coerce.date().nullable().optional(),
    remarks: z.string().trim().max(2000).nullable().optional(),
    evidenceNotes: z.string().trim().max(2000).nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const assessmentItemsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  status: assessmentItemStatusSchema.optional(),
  framework: z.cuid().optional(),
  severity: z.nativeEnum(Severity).optional(),
  search: z.string().trim().max(200).optional(),
  sortBy: z.enum(["severity", "updatedAt", "createdAt", "status", "code"]).default("severity"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AssessmentItemsListQuery = z.infer<typeof assessmentItemsListQuerySchema>;
