import { z } from "zod";

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
