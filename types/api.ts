import { SuggestionSource } from "@/types/ai";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  source?: SuggestionSource | "none";
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
