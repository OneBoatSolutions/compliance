import { apiClient } from "@/lib/api-client";
import type { GenerateRemediationInput, RemediationResponse } from "@/types/ai";

const inFlightRemediationRequests = new Map<string, Promise<RemediationResponse>>();

function buildRemediationRequestKey(input: GenerateRemediationInput): string {
  return JSON.stringify({
    frameworkName: input.frameworkName,
    controlId: input.controlId,
    controlTitle: input.controlTitle,
    controlDescription: input.controlDescription,
    currentStatus: input.currentStatus,
    severity: input.severity,
    regenerate: input.regenerate ?? false,
    assessmentId: input.assessmentId ?? "",
    userNotes: input.userNotes ?? "",
    uploadedEvidenceFiles: input.uploadedEvidenceFiles ?? [],
    productDescription: input.productDescription ?? "",
    targetAudience: input.targetAudience ?? "",
  });
}

export const requestRemediation = (
  input: GenerateRemediationInput,
): Promise<RemediationResponse> => {
  const key = buildRemediationRequestKey(input);
  const existing = inFlightRemediationRequests.get(key);

  if (existing) {
    return existing;
  }

  const request = apiClient
    .post<RemediationResponse, GenerateRemediationInput>("/api/ai/remediation", {
      body: input,
    })
    .finally(() => {
      if (inFlightRemediationRequests.get(key) === request) {
        inFlightRemediationRequests.delete(key);
      }
    });

  inFlightRemediationRequests.set(key, request);
  return request;
};

const aiApi = {
  requestRemediation,
};

export default aiApi;
