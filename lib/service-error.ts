import { ApiError } from "@/lib/app-error";
import { errorResponse } from "@/lib/api-helpers";

export function serviceErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode);
  }

  throw error;
}
