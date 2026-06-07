import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth-helpers";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  try {
    const rateLimited = await rateLimit(req, RATE_LIMIT_CONFIGS.auth);
    if (rateLimited) {
      return rateLimited;
    }

    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { name, companyName, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return errorResponse("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizations: {
          create: {
            name: companyName,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return successResponse(user, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error", 500);
  }
}
