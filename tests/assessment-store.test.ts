import { beforeEach, describe, expect, it, vi } from "vitest";

import { type OnboardingFormValues } from "@/lib/validations/onboarding";
import { useAssessmentStore } from "@/stores/assessment-store";

function jsonResponse(body: unknown, status: number = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const onboardingInput: OnboardingFormValues = {
  productName: "HealthTrack App",
  description: "A healthcare tracking platform",
  services: "Telehealth and monitoring",
  customers: "Clinics and patients",
  problem: "Securely manage health operations",
  dataTypes: ["PII", "PHI"],
  regions: ["US", "EU"],
  otherDataType: "",
  otherRegion: "",
};

describe("assessment onboarding store", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAssessmentStore.getState().reset();
  });

  it("stores localized checklist filters and sort parameters", () => {
    const store = useAssessmentStore.getState();

    store.setChecklistFilters({
      search: "hipaa",
      frameworks: ["fw_hipaa"],
      status: ["NOT_STARTED"],
      severity: ["HIGH"],
    });
    store.setChecklistSortParams({
      by: "updated",
      order: "asc",
    });

    const state = useAssessmentStore.getState();

    expect(state.activeChecklistFilters).toEqual({
      search: "hipaa",
      frameworks: ["fw_hipaa"],
      status: ["NOT_STARTED"],
      severity: ["HIGH"],
    });
    expect(state.activeChecklistSortParams).toEqual({
      by: "updated",
      order: "asc",
    });
  });

  it("tracks selected checklist item and resets checklist view state", () => {
    const store = useAssessmentStore.getState();

    store.setSelectedChecklistItem("item_42");
    store.setChecklistFilters({
      search: "privacy",
      frameworks: ["fw_gdpr"],
      status: ["COMPLIANT"],
      severity: ["MEDIUM"],
    });
    store.setChecklistSortParams({ by: "status", order: "asc" });

    store.resetChecklistViewState();

    const state = useAssessmentStore.getState();

    expect(state.selectedChecklistItemId).toBeNull();
    expect(state.activeChecklistFilters).toEqual({
      search: "",
      frameworks: [],
      status: [],
      severity: [],
    });
    expect(state.activeChecklistSortParams).toEqual({
      by: "severity",
      order: "desc",
    });
  });

  it("submits onboarding and stores mapped framework IDs", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: true,
            data: {
              id: "org_1",
            },
          },
          201,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: true,
            data: [
              {
                frameworkId: "fw_gdpr",
                code: "GDPR",
                name: "General Data Protection Regulation",
                confidence: 92,
                explanation: "Relevant for EU personal data processing.",
                tags: ["privacy", "pii", "eu"],
                controls: 24,
              },
              {
                frameworkId: "fw_hipaa",
                code: "HIPAA",
                name: "Health Insurance Portability and Accountability Act",
                confidence: 74,
                explanation: "Relevant for protected health information.",
                tags: ["healthcare", "phi"],
                controls: 19,
              },
            ],
          },
          200,
        ),
      );

    const result = await useAssessmentStore.getState().submitOnboarding(onboardingInput);

    expect(result.ok).toBe(true);

    const state = useAssessmentStore.getState();
    expect(state.phase).toBe("results");
    expect(state.organizationId).toBe("org_1");
    expect(state.suggestions).toHaveLength(2);
    expect(state.selectedFrameworkIds).toEqual(["fw_gdpr"]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("auto-retries assessment creation once on timeout", async () => {
    useAssessmentStore.setState({
      organizationId: "org_1",
      selectedFrameworkIds: ["fw_gdpr"],
      phase: "results",
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new DOMException("Request aborted", "AbortError"))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: true,
            data: {
              assessmentId: "asm_1",
              totalItems: 20,
            },
          },
          201,
        ),
      );

    const result = await useAssessmentStore.getState().createAssessment();

    expect(result.ok).toBe(true);
    expect(result.assessmentId).toBe("asm_1");
    expect(useAssessmentStore.getState().phase).toBe("success");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("supports manual retry after create-assessment failure", async () => {
    useAssessmentStore.setState({
      organizationId: "org_1",
      selectedFrameworkIds: ["fw_gdpr"],
      phase: "results",
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({ success: false, error: "Server unavailable" }, 500))
      .mockResolvedValueOnce(jsonResponse({ success: false, error: "Server unavailable" }, 500))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: true,
            data: {
              assessmentId: "asm_retry",
              totalItems: 20,
            },
          },
          201,
        ),
      );

    const firstAttempt = await useAssessmentStore.getState().createAssessment();

    expect(firstAttempt.ok).toBe(false);
    expect(useAssessmentStore.getState().phase).toBe("results");
    expect(useAssessmentStore.getState().error?.retryable).toBe(true);

    const retried = await useAssessmentStore.getState().retryLastAction();

    expect(retried).toBe(true);
    expect(useAssessmentStore.getState().phase).toBe("success");
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });
});
