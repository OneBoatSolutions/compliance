import { create } from "zustand";
import { signIn, signOut } from "next-auth/react";

import { apiClient, ApiClientError, clearAuthToken } from "@/lib/api-client";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import type { User, UserRole } from "@/types/user";

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<User>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.name === "string" &&
    (candidate.role === "USER" || candidate.role === "ADMIN")
  );
}

function resolveUserPayload(payload: unknown, action: "register" | "checkSession"): User {
  if (isUser(payload)) {
    return payload;
  }

  throw new ApiClientError({
    message: `Invalid ${action} response payload`,
    status: 500,
    code: "SERVER_ERROR",
    details: payload,
  });
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
}

export interface AuthActions {
  login: (payload: LoginInput) => Promise<User>;
  register: (payload: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  getRoleHomePath: (role?: UserRole | null) => string;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasHydrated: false,

  getRoleHomePath(role) {
    if (role === "ADMIN") {
      return "/frameworks";
    }

    return "/dashboard";
  },

  async login(payload) {
    set({ isLoading: true });

    try {
      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (!result || result.error) {
        const isLockout = result?.error?.includes("Too many failed login attempts");
        const isCredentialsError = result?.error === "CredentialsSignin" || result?.status === 401;

        throw new ApiClientError({
          message: isLockout
            ? "Too many failed login attempts. Please try again later."
            : isCredentialsError
              ? "Invalid email or password"
              : "Unable to sign in. Please try again.",
          status: isLockout ? 429 : isCredentialsError ? 401 : 500,
          code: isLockout
            ? ("REQUEST_ERROR" as const)
            : isCredentialsError
              ? ("UNAUTHORIZED" as const)
              : ("SERVER_ERROR" as const),
          details: result?.error,
        });
      }

      const response = await apiClient.get<User>("/api/auth/me");
      const user = resolveUserPayload(response, "checkSession");

      set({ user, isAuthenticated: true });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  async register(payload) {
    set({ isLoading: true });

    try {
      const response = await apiClient.post<User, RegisterInput>("/api/auth/register", {
        body: payload,
      });

      const user = resolveUserPayload(response, "register");
      set({ user: null, isAuthenticated: false });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  async logout() {
    set({ isLoading: true });

    try {
      await signOut({ redirect: false });
    } finally {
      clearAuthToken();
      set({ user: null, isAuthenticated: false, isLoading: false, hasHydrated: true });
    }
  },

  async checkSession() {
    set({ isLoading: true });

    try {
      const response = await apiClient.get<User>("/api/auth/me");
      const user = resolveUserPayload(response, "checkSession");
      set({ user, isAuthenticated: true, hasHydrated: true });
    } catch (error) {
      if (error instanceof ApiClientError && error.isUnauthorized) {
        clearAuthToken();
        set({ user: null, isAuthenticated: false, hasHydrated: true });
        return;
      }

      throw error;
    } finally {
      set({ isLoading: false, hasHydrated: true });
    }
  },
}));
