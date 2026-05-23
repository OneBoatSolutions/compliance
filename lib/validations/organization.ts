import { z } from "zod";

const dataHandledEnum = z.enum([
  "PII (Personally Identifiable Information)",
  "PHI (Protected Health Information)",
  "Financial data",
  "Payment card data",
  "Biometric data",
  "Children data",
  "Employee data",
  "Other",
]);

const regionsEnum = z.enum([
  "United States",
  "European Union",
  "United Kingdom",
  "Canada",
  "Australia",
  "APAC",
  "Latin America",
  "Other",
]);

export const organizationProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    productName: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().min(1).max(500).optional(),
    services: z.string().trim().min(1).max(300).optional(),
    targetCustomers: z.string().trim().min(1).max(200).optional(),
    problemSolved: z.string().trim().min(1).max(300).optional(),
    dataHandled: z.array(dataHandledEnum).min(1).optional(),
    regions: z.array(regionsEnum).min(1).optional(),
  })
  .strict();

export const createOrganizationSchema = organizationProfileSchema.extend({
  name: z.string().trim().min(2).max(100),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = organizationProfileSchema.refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field must be provided",
  },
);
