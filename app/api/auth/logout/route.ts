import { successResponse } from "@/lib/api-helpers";

export async function POST() {
  // This endpoint simply reports success.
  return successResponse({
    message: "Logged out successfully",
  });
}
