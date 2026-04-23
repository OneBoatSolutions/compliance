import { mockControls } from "./mockData";
import { apiClient } from "@/lib/api-client";
//import { AxiosResponse } from "axios";

/**
 * 🔹 Types
 */
type SaveControlResponse = {
  score: number;
  status: string;
};

/**
 * 🔹 SAVE CONTROL
 * Calls backend PATCH API
 */


/**
 * 🔹 GET CONTROL (TEMP MOCK)
 * Replace with real API later
 */
export const getControl = async (controlId: string): Promise<any> => {
  try {
    await new Promise((res) => setTimeout(res, 300));
    return mockControls[controlId] || mockControls["test"];
  } catch (error) {
    console.error("Error fetching control:", error);
    throw error;
  }
};

export const saveControl = async (
  assessmentId: string,
  itemId: string,
  payload: any
): Promise<any> => {
  try {
    return await apiClient.patch(
      `/api/assessments/${assessmentId}/items/${itemId}`,
      payload
    );
  } catch (error) {
    console.warn("API failed, using mock fallback");

    // ✅ fallback mock
    return {
      status: payload.status,
      score: Math.floor(Math.random() * 100),
    };
  }
};