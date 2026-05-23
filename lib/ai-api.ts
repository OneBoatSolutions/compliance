import { apiClient } from "@/lib/api-client";
import type { GenerateRemediationInput, RemediationResponse } from "@/types/ai";

export const requestRemediation = (
  input: GenerateRemediationInput,
): Promise<RemediationResponse> => {
  return apiClient.post<RemediationResponse, GenerateRemediationInput>("/api/ai/remediation", {
    body: input,
  });
};

const aiApi = {
  requestRemediation,
};

export default aiApi;
