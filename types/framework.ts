export type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Framework {
  id: string;
  code: string;
  name: string;
  description: string;
  region: string;
  category: string;
  version: string;
  effectiveDate: Date;
  sourceLink?: string;
  FrameworkStatus: Status;
}
