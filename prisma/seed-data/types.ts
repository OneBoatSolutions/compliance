export interface SeedControl {
  code: string;
  title: string;
  description: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  weight: number;
  isGateway?: boolean;
  metadata?: Record<string, unknown>;
}
