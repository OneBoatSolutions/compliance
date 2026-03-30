import { z } from "zod";

export const onboardingSchema = z.object({
  productName: z.string().min(1, "Product name is Required").max(100, "Max 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Max 500 characters"),
  services: z.string().min(1, "Services are required").max(300, "Max 300 characters"),
  customers: z.string().min(1, "Target customers required").max(200, "Max 200 characters"),
  problem: z.string().min(1, "Problem is required").max(300, "Max 300 characters"),

  dataTypes: z.array(z.string()).min(1, "Select at least one"),
  regions: z.array(z.string()).min(1, "Select at least one"),
});
export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
