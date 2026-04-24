export interface RemediationData {
  controlId?: string;
  title?: string;
  description?: string;
  status?: string;
  scoreImpact?: number;

  steps?: {
    title: string;
    priority: string;
    owner: string;
    effort: string;
    tasks: string[];
  }[];

  policies?: {
    title: string;
    desc: string;
  }[];
}
