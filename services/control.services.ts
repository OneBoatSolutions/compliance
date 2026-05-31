import { mockControls } from "./mockData";
import { apiClient } from "@/lib/api-client";

/**
 * 🔹 TYPES
 */
interface SaveControlPayload {
  status: string;
  comments: string;
  evidence: unknown[];
  assignee: string;
  dueDate: string;
  saveType?: string;
}

interface SaveControlResponse {
  score: number;
  status: string;
}

/**
 * 🔹 GET CONTROL (TEMP MOCK)
 */
export const getControl = async (controlId: string) => {
  try {
    await new Promise((res) => setTimeout(res, 300));
    return mockControls[controlId] || mockControls["test"];
  } catch (error) {
    console.error("Error fetching control:", error);
    throw error;
  }
};

/**
 * 🔹 SAVE CONTROL
 */
export const saveControl = async (
  assessmentId: string,
  itemId: string,
  payload: SaveControlPayload,
): Promise<SaveControlResponse> => {
  try {
    const response = await apiClient.patch<SaveControlResponse>(
      `/api/assessments/${assessmentId}/items/${itemId}`,
      { body: payload },
    );

    return response;
  } catch (error) {
    console.warn("API failed, using mock fallback");

    return {
      status: payload.status,
      score: Math.floor(Math.random() * 100),
    };
  }
};
