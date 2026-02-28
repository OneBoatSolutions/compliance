import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export function successResponse<T>(data: T, status: number = 200) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(message: string, status: number = 400, details?: unknown) {
  const response: ApiErrorResponse = {
    success: false,
    error: message,
  };

  if (details !== undefined) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = "Resource not found") {
  return errorResponse(message, 404);
}

// 422 used for validation errors
export function validationErrorResponse(errors: unknown) {
  return errorResponse("Validation failed", 422, errors);
}
