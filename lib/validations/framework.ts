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
