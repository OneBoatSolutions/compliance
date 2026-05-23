/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention */
declare module "@prisma/client" {
  export const Role: {
    ADMIN: "ADMIN";
    USER: "USER";
  };

  export const FrameworkStatus: {
    DRAFT: "DRAFT";
    PUBLISHED: "PUBLISHED";
    ARCHIVED: "ARCHIVED";
  };

  export const Severity: {
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
    CRITICAL: "CRITICAL";
  };

  export const AssessmentStatus: {
    DRAFT: "DRAFT";
    IN_PROGRESS: "IN_PROGRESS";
    COMPLETED: "COMPLETED";
  };

  export const ItemStatus: {
    NOT_STARTED: "NOT_STARTED";
    COMPLIANT: "COMPLIANT";
    PARTIALLY_COMPLIANT: "PARTIALLY_COMPLIANT";
    NOT_COMPLIANT: "NOT_COMPLIANT";
    NOT_APPLICABLE: "NOT_APPLICABLE";
  };

  export const ReportType: {
    COMPLIANCE_READINESS: "COMPLIANCE_READINESS";
    EXECUTIVE_SUMMARY: "EXECUTIVE_SUMMARY";
  };

  export const ReportFormat: {
    PDF: "PDF";
    WEB: "WEB";
  };

  export const AIType: {
    COMPLIANCE_MAPPING: "COMPLIANCE_MAPPING";
    REMEDIATION_PLAN: "REMEDIATION_PLAN";
    REPORT_NARRATIVE: "REPORT_NARRATIVE";
  };

  export type Role = (typeof Role)[keyof typeof Role];
  export type FrameworkStatus = (typeof FrameworkStatus)[keyof typeof FrameworkStatus];
  export type Severity = (typeof Severity)[keyof typeof Severity];
  export type AssessmentStatus = (typeof AssessmentStatus)[keyof typeof AssessmentStatus];
  export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];
  export type ReportType = (typeof ReportType)[keyof typeof ReportType];
  export type ReportFormat = (typeof ReportFormat)[keyof typeof ReportFormat];
  export type AIType = (typeof AIType)[keyof typeof AIType];

  export class PrismaClientKnownRequestError extends Error {
    code: string;
  }

  export class PrismaClient {
    [key: string]: any;
    constructor(options?: Record<string, unknown>);
    $transaction<T>(operations: readonly Promise<T>[]): Promise<T[]>;
    $transaction<T>(
      callback: (tx: Prisma.TransactionClient) => Promise<T>,
      options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
    ): Promise<T>;
    $disconnect(): Promise<void>;
  }

  export namespace Prisma {
    export type SortOrder = "asc" | "desc";
    export type InputJsonValue = unknown;
    export const DbNull: unique symbol;

    export type AssessmentItemOrderByWithRelationInput = Record<string, unknown>;
    export type AssessmentItemWhereInput = Record<string, unknown>;
    export type ControlWhereInput = Record<string, unknown>;
    export type ControlUpdateInput = Record<string, unknown>;
    export type ControlCreateManyInput = Record<string, unknown>;
    export type FrameworkUpdateInput = Record<string, unknown>;
    export type FrameworkWhereInput = Record<string, unknown>;
    export type UserWhereInput = Record<string, unknown>;
    export type UserUpdateInput = Record<string, unknown>;
    export type UserSelect = Record<string, unknown>;
    export type UserGetPayload<T> = Record<string, unknown>;

    export enum TransactionIsolationLevel {
      ReadUncommitted = "ReadUncommitted",
      ReadCommitted = "ReadCommitted",
      RepeatableRead = "RepeatableRead",
      Serializable = "Serializable",
    }

    export type TransactionClient = PrismaClient;
    export class PrismaClientKnownRequestError extends Error {
      code: string;
    }
  }
}
