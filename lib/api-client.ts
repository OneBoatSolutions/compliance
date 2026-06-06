import type { ApiResponse } from "@/types/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientErrorShape {
  message: string;
  status: number;
  code: "NETWORK_ERROR" | "UNAUTHORIZED" | "SERVER_ERROR" | "REQUEST_ERROR" | "TOO_MANY_REQUESTS";
  details?: unknown;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: ApiClientErrorShape["code"];
  public readonly details?: unknown;

  constructor({ message, status, code, details }: ApiClientErrorShape) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR";
  }
}

interface ApiErrorBody {
  success: false;
  error: string;
  details?: unknown;
}

interface ApiSuccessBody<TData> {
  success: true;
  data: TData;
}

export type ApiEnvelope<TData> = ApiSuccessBody<TData> | ApiErrorBody;

export interface ApiRequestOptions<TBody = unknown> extends Omit<
  RequestInit,
  "method" | "body" | "headers"
> {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  skipAuth?: boolean;
}

const authTokenStorageKey = "auth_token";

let inMemoryAuthToken: string | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryAuthToken = token;

  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.sessionStorage.removeItem(authTokenStorageKey);
    return;
  }

  window.sessionStorage.setItem(authTokenStorageKey, token);
}

export function getAuthToken(): string | null {
  if (inMemoryAuthToken) {
    return inMemoryAuthToken;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = window.sessionStorage.getItem(authTokenStorageKey);
  if (storedToken) {
    inMemoryAuthToken = storedToken;
  }

  return storedToken;
}

export function clearAuthToken(): void {
  setAuthToken(null);
}

function buildHeaders<TBody>(options: ApiRequestOptions<TBody>): Headers {
  const headers = new Headers(options.headers);
  const token = getAuthToken();

  if (token && !options.skipAuth && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  return headers;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as unknown;
  }

  const raw = await response.text();
  return raw.length > 0 ? raw : null;
}

function normalizeHttpError(status: number, payload: unknown): ApiClientError {
  let message = "Request failed";
  let details: unknown;

  if (payload && typeof payload === "object") {
    const maybePayload = payload as Partial<ApiErrorBody>;
    if (typeof maybePayload.error === "string" && maybePayload.error.length > 0) {
      message = maybePayload.error;
    }
    details = maybePayload.details;
  }

  if (status === 401) {
    return new ApiClientError({
      message: message || "Unauthorized",
      status,
      code: "UNAUTHORIZED",
      details,
    });
  }

  if (status >= 500) {
    return new ApiClientError({
      message: message || "Server error",
      status,
      code: "SERVER_ERROR",
      details,
    });
  }

  return new ApiClientError({
    message,
    status,
    code: "REQUEST_ERROR",
    details,
  });
}

function extractData<TData>(payload: unknown): TData {
  if (payload && typeof payload === "object" && "success" in payload) {
    const apiPayload = payload as ApiEnvelope<TData>;

    if (apiPayload.success) {
      return apiPayload.data;
    }

    throw new ApiClientError({
      message: apiPayload.error || "Request failed",
      status: 400,
      code: "REQUEST_ERROR",
      details: apiPayload.details,
    });
  }

  return payload as TData;
}

export async function apiRequest<TData, TBody = unknown>(
  input: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TData> {
  const method = options.method ?? "GET";

  const requestInit: RequestInit = {
    ...options,
    method,
    headers: buildHeaders(options),
    credentials: options.credentials ?? "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(input, requestInit);
    const payload = await parseResponseBody(response);

    if (!response.ok) {
      throw normalizeHttpError(response.status, payload);
    }

    return extractData<TData>(payload);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError({
        message: "Request was aborted",
        status: 0,
        code: "NETWORK_ERROR",
      });
    }

    throw new ApiClientError({
      message: "Network error. Please check your connection and try again.",
      status: 0,
      code: "NETWORK_ERROR",
      details: error,
    });
  }
}

function get<TData>(input: string, options?: ApiRequestOptions<never>) {
  return apiRequest<TData, never>(input, { ...options, method: "GET" });
}

function post<TData, TBody = unknown>(input: string, options?: ApiRequestOptions<TBody>) {
  return apiRequest<TData, TBody>(input, { ...options, method: "POST" });
}

function put<TData, TBody = unknown>(input: string, options?: ApiRequestOptions<TBody>) {
  return apiRequest<TData, TBody>(input, { ...options, method: "PUT" });
}

function patch<TData, TBody = unknown>(input: string, options?: ApiRequestOptions<TBody>) {
  return apiRequest<TData, TBody>(input, { ...options, method: "PATCH" });
}

function del<TData>(input: string, options?: ApiRequestOptions<never>) {
  return apiRequest<TData, never>(input, { ...options, method: "DELETE" });
}

export function uploadWithProgress<TData>(
  input: string,
  formData: FormData,
  onProgress: (progress: number) => void,
): { promise: Promise<TData>; abort: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<TData>((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      let payload;
      try {
        payload = JSON.parse(xhr.responseText);
      } catch {
        payload = xhr.responseText;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(extractData<TData>(payload));
        } catch (err) {
          reject(err);
        }
      } else {
        reject(normalizeHttpError(xhr.status, payload));
      }
    };

    xhr.onerror = () => reject(normalizeHttpError(0, null));
    xhr.onabort = () => reject(normalizeHttpError(0, { error: "Aborted" }));

    xhr.open("POST", input);

    const token = getAuthToken();
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.setRequestHeader("Accept", "application/json");

    xhr.send(formData);
  });

  return { promise, abort: () => xhr.abort() };
}

export async function getBlob(
  input: string,
  options: ApiRequestOptions<never> = {},
): Promise<Blob> {
  const requestInit: RequestInit = {
    ...options,
    method: "GET",
    headers: buildHeaders(options),
    credentials: options.credentials ?? "include",
  };

  const response = await fetch(input, requestInit);
  if (!response.ok) {
    const payload = await parseResponseBody(response).catch(() => null);
    throw normalizeHttpError(response.status, payload);
  }

  return response.blob();
}

export const apiClient = {
  request: apiRequest,
  get,
  post,
  put,
  patch,
  delete: del,
  upload: uploadWithProgress,
  getBlob,
};

export type { ApiResponse };
