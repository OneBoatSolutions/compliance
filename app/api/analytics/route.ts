import { withErrorHandler } from "@/lib/api-handler";
import { errorResponse, successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { getCachedAnalyticsData, type AnalyticsRangeKind } from "@/lib/analytics-data";

interface ParsedAnalyticsRange {
  kind: AnalyticsRangeKind;
  startDate: string | null;
  endDate: string | null;
  error?: string;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateKey(value: string): boolean {
  if (!datePattern.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseRange(req: Request): ParsedAnalyticsRange {
  const url = new URL(req.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (startDate || endDate) {
    if (!startDate || !endDate) {
      return {
        kind: "CUSTOM",
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        error: "Both startDate and endDate are required for custom analytics ranges",
      };
    }

    if (!isValidDateKey(startDate) || !isValidDateKey(endDate)) {
      return {
        kind: "CUSTOM",
        startDate,
        endDate,
        error: "startDate and endDate must be valid YYYY-MM-DD dates",
      };
    }

    if (startDate > endDate) {
      return {
        kind: "CUSTOM",
        startDate,
        endDate,
        error: "startDate must be before or equal to endDate",
      };
    }

    return {
      kind: "CUSTOM",
      startDate,
      endDate,
    };
  }

  const range = url.searchParams.get("range")?.trim().toLowerCase();

  if (range === "last 90 days") {
    return { kind: "LAST_90", startDate: null, endDate: null };
  }

  if (range === "all time") {
    return { kind: "ALL_TIME", startDate: null, endDate: null };
  }

  return { kind: "LAST_30", startDate: null, endDate: null };
}

export const GET = withErrorHandler(async (req: Request) => {
  const session = await requireAuth();
  const range = parseRange(req);

  if (range.error) {
    return errorResponse(range.error, 400);
  }

  const data = await getCachedAnalyticsData(
    session.user.id,
    range.kind,
    range.startDate,
    range.endDate,
  );
  return successResponse(data);
});
