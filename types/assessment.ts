export type AssessmentStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

export interface Assessment {
  id: string;
  userId: string;
  organizationId: string;
  status: AssessmentStatus;
  score: number | null;
  completedAt: string | null;
}
