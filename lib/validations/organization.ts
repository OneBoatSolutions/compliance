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

export const createOrganizationSchema = z.object({
  productName: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(500),
  services: z.string().trim().min(1).max(300),
  targetCustomers: z.string().trim().min(1).max(200),
  problemSolved: z.string().trim().min(1).max(300),
  dataHandled: z.array(dataHandledEnum).min(1),
  regions: z.array(regionsEnum).min(1),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
