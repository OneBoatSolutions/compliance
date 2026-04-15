export type Status = "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT" | "NOT_STARTED";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Control {
  id: string;
  title: string;
  description: string;
  framework: string;
  severity: Severity;
  status: Status;
  evidenceCount: number;
  updatedAt: string;
}
