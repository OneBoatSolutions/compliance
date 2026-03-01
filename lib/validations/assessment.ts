import { z } from "zod";

export const createAssessmentSchema = z.object({
  organizationId: z.cuid(),
  frameworkIds: z.array(z.cuid()).min(1, "At least one framework must be selected"),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
