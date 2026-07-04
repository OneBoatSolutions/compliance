import { OnboardingFormValues } from "@/lib/validations/onboarding";
import { SuggestionSource } from "@/types/ai";
import { create } from "zustand";

export interface FrameworkSuggestion {
  frameworkId: string;
  code: string;
  name: string;
  confidence: number;
  explanation: string;
  tags: string[];
  controls: number;
  source?: SuggestionSource;
}

export type OnboardingPhase =
  | "idle"
  | "savingOrg"
  | "aiLoading"
  | "results"
  | "creating"
  | "success";

type RetryAction = "submitOnboarding" | "createAssessment";

interface RetryContext {
  action: RetryAction;
  payload?: OnboardingFormValues;
  organizationId?: string | null;
}

export interface OnboardingFlowError {
  phase: Exclude<OnboardingPhase, "success">;
  message: string;
  retryable: boolean;
  timedOut: boolean;
  attempt: number;
  status?: number;
}

interface SubmitOnboardingResult {
  ok: boolean;
}

interface CreateAssessmentResult {
  ok: boolean;
  assessmentId?: string;
}

export interface ChecklistFrameworkScore {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

export type AssessmentItemStatus =
  | "NOT_STARTED"
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NOT_COMPLIANT"
  | "NOT_APPLICABLE";

export type AssessmentItemSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AssessmentSortField = "severity" | "status" | "id" | "updated";

export type AssessmentSortOrder = "asc" | "desc";

export interface AssessmentChecklistFilters {
  search: string;
  frameworks: string[];
  status: AssessmentItemStatus[];
  severity: AssessmentItemSeverity[];
}

export interface AssessmentSortParams {
  by: AssessmentSortField;
  order: AssessmentSortOrder;
}

interface AssessmentState {
  organizationId: string | null;
  suggestions: FrameworkSuggestion[];
  selectedFrameworkIds: string[];
  onboardingData: OnboardingFormValues | null;
  assessmentId: string | null;
  checklistScore: number | null;
  checklistFrameworkScores: ChecklistFrameworkScore[];
  activeChecklistFilters: AssessmentChecklistFilters;
  activeChecklistSortParams: AssessmentSortParams;
  selectedChecklistItemId: string | null;
  phase: OnboardingPhase;
  error: OnboardingFlowError | null;
  lastRetryContext: RetryContext | null;
  suggestionSource: SuggestionSource | "none" | null;

  setOnboardingData: (data: OnboardingFormValues) => void;
  setOrganizationId: (id: string) => void;
  setSuggestions: (data: FrameworkSuggestion[]) => void;
  setChecklistScore: (score: number, frameworkScores: ChecklistFrameworkScore[]) => void;
  setChecklistFilters: (filters: Partial<AssessmentChecklistFilters>) => void;
  setChecklistSortParams: (params: Partial<AssessmentSortParams>) => void;
  setSelectedChecklistItem: (itemId: string | null) => void;
  resetChecklistViewState: () => void;
  clearChecklistState: () => void;

  clearError: () => void;
  toggleFramework: (id: string) => void;

  submitOnboarding: (
    data: OnboardingFormValues,
    existingOrganizationId?: string | null,
  ) => Promise<SubmitOnboardingResult>;
  createAssessment: () => Promise<CreateAssessmentResult>;
  retryLastAction: () => Promise<boolean>;

  reset: () => void;
}

interface ApiErrorEnvelope {
  success: false;
  error: string;
  details?: unknown;
}

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  source?: SuggestionSource | "none";
}

type ApiEnvelope<T> = ApiErrorEnvelope | ApiSuccessEnvelope<T>;

interface RequestErrorOptions {
  status?: number;
  retryable?: boolean;
  timedOut?: boolean;
  attempt?: number;
}

const requestTimeoutMs = 10000;
const autoRetryLimit = 1;

class OnboardingRequestError extends Error {
  status: number;
  retryable: boolean;
  timedOut: boolean;
  attempt: number;

  constructor(message: string, options: RequestErrorOptions = {}) {
    super(message);
    this.name = "OnboardingRequestError";
    this.status = options.status ?? 0;
    this.retryable = options.retryable ?? false;
    this.timedOut = options.timedOut ?? false;
    this.attempt = options.attempt ?? 1;
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function mapToOrganizationPayload(values: OnboardingFormValues) {
  return {
    productName: values.productName,
    description: values.description,
    services: values.services,
    targetCustomers: values.customers,
    problemSolved: values.problem,

    dataHandled: (values.dataTypes ?? []).map((val) => {
      switch (val) {
        case "PII":
          return "PII (Personally Identifiable Information)";
        case "PHI":
          return "PHI (Protected Health Information)";
        case "Financial":
          return "Financial data";
        case "Payment":
          return "Payment card data";
        case "Biometric":
          return "Biometric data";
        case "Children":
          return "Children data";
        case "Employee":
          return "Employee data";
        default:
          return values.otherDataType || "Other";
      }
    }),

    regions: (values.regions ?? []).map((region) => {
      switch (region) {
        case "US":
          return "United States";
        case "EU":
          return "European Union";
        case "UK":
          return "United Kingdom";
        case "Canada":
          return "Canada";
        case "Australia":
          return "Australia";
        case "APAC":
          return "APAC";
        case "LATAM":
          return "Latin America";
        default:
          return values.otherRegion || "Other";
      }
    }),
  };
}

function mapToAIProfile(values: OnboardingFormValues) {
  return {
    name: values.productName,
    description: values.description,
    services: values.services,
    customers: values.customers,
    problem: values.problem,
    dataHandled: values.dataTypes,
    regions: values.regions,
  };
}

async function fetchCurrentOrganizationId(): Promise<string | null> {
  const organizations = await fetchWithTimeout<Array<{ id: string }>>("/api/organizations", {
    method: "GET",
  });

  return organizations[0]?.id ?? null;
}

async function parseJsonPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as unknown;
  }

  const raw = await response.text();
  return raw.length > 0 ? raw : null;
}

function extractEnvelopeData<T>(payload: unknown, status: number): T {
  if (payload && typeof payload === "object" && "success" in payload) {
    const envelope = payload as ApiEnvelope<T>;
    if (envelope.success) {
      return envelope.data;
    }

    throw new OnboardingRequestError(envelope.error || "Request failed", {
      status,
      retryable: isRetryableStatus(status),
    });
  }

  if (payload === null || payload === undefined) {
    throw new OnboardingRequestError("Server returned an empty response", {
      status,
      retryable: false,
    });
  }

  return payload as T;
}

async function fetchWithTimeout<T>(url: string, init: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      credentials: init.credentials ?? "include",
      signal: controller.signal,
    });

    const payload = await parseJsonPayload(response);

    if (!response.ok) {
      const errorMessage =
        payload && typeof payload === "object" && "error" in payload
          ? String((payload as Partial<ApiErrorEnvelope>).error ?? "Request failed")
          : `Request failed (${response.status})`;

      throw new OnboardingRequestError(errorMessage, {
        status: response.status,
        retryable: isRetryableStatus(response.status),
      });
    }

    return extractEnvelopeData<T>(payload, response.status);
  } catch (error) {
    if (error instanceof OnboardingRequestError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new OnboardingRequestError("Request timed out. Please try again.", {
        status: 408,
        retryable: true,
        timedOut: true,
      });
    }

    throw new OnboardingRequestError("Network error. Please check your connection and retry.", {
      retryable: true,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function executeWithRetry<T>(operation: (attempt: number) => Promise<T>): Promise<T> {
  let attempt = 1;

  while (attempt <= autoRetryLimit + 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (error instanceof OnboardingRequestError) {
        error.attempt = attempt;

        const shouldRetry = error.retryable && attempt <= autoRetryLimit;
        if (!shouldRetry) {
          throw error;
        }

        attempt += 1;
        continue;
      }

      throw error;
    }
  }

  throw new OnboardingRequestError("Request failed after retry", {
    retryable: false,
    attempt: autoRetryLimit + 1,
  });
}

function toFlowError(
  error: unknown,
  phase: Exclude<OnboardingPhase, "success">,
): OnboardingFlowError {
  if (error instanceof OnboardingRequestError) {
    return {
      phase,
      message: error.message,
      retryable: error.retryable,
      timedOut: error.timedOut,
      attempt: error.attempt,
      status: error.status,
    };
  }

  return {
    phase,
    message: "Something went wrong. Please try again.",
    retryable: true,
    timedOut: false,
    attempt: 1,
  };
}

const initialState = {
  organizationId: null,
  suggestions: [],
  selectedFrameworkIds: [],
  onboardingData: null,
  assessmentId: null,
  checklistScore: null,
  checklistFrameworkScores: [],
  activeChecklistFilters: {
    search: "",
    frameworks: [],
    status: [],
    severity: [],
  },
  activeChecklistSortParams: {
    by: "severity" as AssessmentSortField,
    order: "desc" as AssessmentSortOrder,
  },
  selectedChecklistItemId: null,
  phase: "idle" as OnboardingPhase,
  error: null,
  lastRetryContext: null,
  suggestionSource: null,
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  ...initialState,

  setOrganizationId: (id) => set({ organizationId: id }),

  setSuggestions: (data) => {
    const preSelected = [
      ...new Set(data.filter((item) => item.confidence > 85).map((item) => item.frameworkId)),
    ];
    set({ suggestions: data, selectedFrameworkIds: preSelected });
  },

  setOnboardingData: (data) => set({ onboardingData: data }),
  setChecklistScore: (score, frameworkScores) =>
    set({
      checklistScore: score,
      checklistFrameworkScores: frameworkScores,
    }),
  setChecklistFilters: (filters) =>
    set((state) => ({
      activeChecklistFilters: {
        ...state.activeChecklistFilters,
        ...filters,
      },
    })),
  setChecklistSortParams: (params) =>
    set((state) => ({
      activeChecklistSortParams: {
        ...state.activeChecklistSortParams,
        ...params,
      },
    })),
  setSelectedChecklistItem: (itemId) => set({ selectedChecklistItemId: itemId }),
  resetChecklistViewState: () =>
    set({
      activeChecklistFilters: {
        search: "",
        frameworks: [],
        status: [],
        severity: [],
      },
      activeChecklistSortParams: {
        by: "severity",
        order: "desc",
      },
      selectedChecklistItemId: null,
    }),
  clearChecklistState: () =>
    set({
      checklistScore: null,
      checklistFrameworkScores: [],
      activeChecklistFilters: {
        search: "",
        frameworks: [],
        status: [],
        severity: [],
      },
      activeChecklistSortParams: {
        by: "severity",
        order: "desc",
      },
      selectedChecklistItemId: null,
    }),
  clearError: () => set({ error: null }),

  toggleFramework: (id) =>
    set((state) => ({
      selectedFrameworkIds: state.selectedFrameworkIds.includes(id)
        ? state.selectedFrameworkIds.filter((f) => f !== id)
        : [...state.selectedFrameworkIds, id],
    })),

  submitOnboarding: async (data, existingOrganizationId) => {
    const knownOrganizationId = existingOrganizationId ?? get().organizationId;

    set({
      onboardingData: data,
      error: null,
      phase: "savingOrg",
      lastRetryContext: {
        action: "submitOnboarding",
        payload: data,
        organizationId: knownOrganizationId,
      },
    });

    try {
      let organizationId = knownOrganizationId;

      if (!organizationId) {
        organizationId = await executeWithRetry(() => fetchCurrentOrganizationId());
      }

      if (!organizationId) {
        throw new OnboardingRequestError(
          "Workspace is missing. Please register again or contact support.",
          {
            retryable: false,
          },
        );
      }

      const updatedOrganization = await executeWithRetry(() =>
        fetchWithTimeout<{ id: string }>(`/api/organizations/${organizationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mapToOrganizationPayload(data)),
        }),
      );

      if (!updatedOrganization?.id) {
        throw new OnboardingRequestError("Organization ID missing from response", {
          retryable: false,
        });
      }

      organizationId = updatedOrganization.id;

      set({
        organizationId,
        phase: "aiLoading",
        lastRetryContext: {
          action: "submitOnboarding",
          payload: data,
          organizationId,
        },
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

      let payload: unknown;
      let status: number;
      try {
        const response = await fetch("/api/ai/map-compliance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mapToAIProfile(data)),
          credentials: "include",
          signal: controller.signal,
        });
        status = response.status;
        payload = await parseJsonPayload(response);
        if (!response.ok) {
          const errorMessage =
            payload && typeof payload === "object" && "error" in payload
              ? String((payload as Partial<ApiErrorEnvelope>).error ?? "Request failed")
              : `Request failed (${response.status})`;

          throw new OnboardingRequestError(errorMessage, {
            status,
            retryable: isRetryableStatus(status),
          });
        }
      } catch (error) {
        if (error instanceof OnboardingRequestError) {
          throw error;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new OnboardingRequestError("Request timed out. Please try again.", {
            status: 408,
            retryable: true,
            timedOut: true,
          });
        }
        throw new OnboardingRequestError("Network error. Please check your connection and retry.", {
          retryable: true,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!payload || typeof payload !== "object" || !("success" in payload)) {
        throw new OnboardingRequestError("Server returned an empty response", {
          status,
          retryable: false,
        });
      }

      const envelope = payload as {
        success: boolean;
        error?: string;
        data: FrameworkSuggestion[];
        source?: SuggestionSource | "none";
      };

      if (!envelope.success) {
        throw new OnboardingRequestError(envelope.error || "Request failed", {
          status,
          retryable: isRetryableStatus(status),
        });
      }

      const suggestions = envelope.data;
      const responseSource = envelope.source ?? "ai";

      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        throw new OnboardingRequestError("No frameworks returned. Please retry.", {
          retryable: false,
        });
      }

      const mappedSuggestions = suggestions.filter(
        (item) => typeof item.frameworkId === "string" && item.frameworkId.length > 0,
      );

      if (mappedSuggestions.length === 0) {
        throw new OnboardingRequestError("Unable to map frameworks. Please retry.", {
          retryable: true,
        });
      }

      const preSelected = [
        ...new Set(
          mappedSuggestions.filter((item) => item.confidence > 85).map((item) => item.frameworkId),
        ),
      ];

      set({
        organizationId,
        onboardingData: data,
        suggestions: mappedSuggestions,
        selectedFrameworkIds: preSelected,
        suggestionSource: responseSource,
        phase: "results",
        error: null,
        lastRetryContext: null,
      });

      return { ok: true };
    } catch (error) {
      const failurePhase = get().phase === "aiLoading" ? "aiLoading" : "savingOrg";

      set({
        phase: "idle",
        error: toFlowError(error, failurePhase),
      });

      return { ok: false };
    }
  },

  createAssessment: async () => {
    const { organizationId, selectedFrameworkIds } = get();

    if (!organizationId) {
      set({
        error: {
          phase: "creating",
          message: "Organization is missing. Please restart onboarding.",
          retryable: false,
          timedOut: false,
          attempt: 1,
        },
      });

      return { ok: false };
    }

    if (selectedFrameworkIds.length === 0) {
      set({
        error: {
          phase: "creating",
          message: "Select at least one framework.",
          retryable: false,
          timedOut: false,
          attempt: 1,
        },
      });

      return { ok: false };
    }

    set({
      phase: "creating",
      error: null,
      lastRetryContext: { action: "createAssessment" },
    });

    try {
      const assessment = await executeWithRetry(() =>
        fetchWithTimeout<{ assessmentId: string }>("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            organizationId,
            frameworkIds: selectedFrameworkIds,
          }),
        }),
      );

      if (!assessment?.assessmentId) {
        throw new OnboardingRequestError("Assessment ID missing from response", {
          retryable: false,
        });
      }

      set({
        phase: "success",
        assessmentId: assessment.assessmentId,
        error: null,
        lastRetryContext: null,
      });

      return {
        ok: true,
        assessmentId: assessment.assessmentId,
      };
    } catch (error) {
      set({
        phase: "results",
        error: toFlowError(error, "creating"),
      });

      return { ok: false };
    }
  },

  retryLastAction: async () => {
    const retryContext = get().lastRetryContext;

    if (!retryContext) {
      return false;
    }

    if (retryContext.action === "submitOnboarding" && retryContext.payload) {
      const result = await get().submitOnboarding(
        retryContext.payload,
        retryContext.organizationId,
      );
      return result.ok;
    }

    if (retryContext.action === "createAssessment") {
      const result = await get().createAssessment();
      return result.ok;
    }

    return false;
  },

  reset: () => set(initialState),
}));
