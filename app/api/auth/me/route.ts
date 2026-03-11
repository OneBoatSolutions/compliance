import { getSession } from "@/lib/auth-helpers";
import { successResponse, unauthorizedResponse } from "@/lib/api-helpers";

export async function GET() {
  const session = await getSession();

  if (!session || !session.user) {
    return unauthorizedResponse();
  }

  const { id, email, name, role } = session.user as {
    id: string;
    email: string;
    name: string;
    role: string;
  };

  return successResponse({
    id,
    email,
    name,
    role,
  });
}
