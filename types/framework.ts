export type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";
import { FrameworkStatus, Severity } from "@prisma/client";

export interface Framework {
  id: string;
  code: string;
  name: string;
  description: string;
  region: string;
  category: string;
  version: string;
  effectiveDate: string;
  sourceLink: string | null;
  status: FrameworkStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  _count?: {
    controls: number;
  };
  controls?: Control[];
}

export interface Control {
  id: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string;
  category: string | null;
  severity: Severity;
  weight: number;
  /** Returned by PATCH; omitted from GET /api/frameworks/[id] (not rendered in admin UI). */
  metadata?: unknown;
  /** Returned by PATCH; omitted from GET /api/frameworks/[id] (server-only scoring flag). */
  isGateway?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FrameworkListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FrameworkListData {
  items: Framework[];
  meta: FrameworkListMeta;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface CreateFrameworkPayload {
  code: string;
  name: string;
  description: string;
  region: string;
  category: string;
  version: string;
  effectiveDate: string;
  sourceLink?: string;
}
export interface UpdateFrameworkPayload {
  code?: string;
  name?: string;
  description?: string;
  region?: string;
  category?: string;
  version?: string;
  effectiveDate?: string;
  sourceLink?: string;
}

export interface CreateControlPayload {
  code: string;
  title: string;
  description: string;
  category?: string | null;
  severity?: Severity;
  weight?: number;
}
