import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getComplianceFallback, mapCompliance } from "@/services/ai-service";
import { requireAuth } from "@/lib/auth-helpers";

// in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; reset: number }>();

const LIMIT = 10;
const WINDOW = 60 * 60 * 1000; // 1 hour

const orgProfileSchema = z.object({
  name: z.string(),
  description: z.string(),
  services: z.string(),
  customers: z.string(),
  problem: z.string(),
  dataHandled: z.array(z.string()),
  regions: z.array(z.string()),
});

function checkRateLimit(userId: string) {
  const now = Date.now();

  const entry = rateLimitMap.get(userId);

  if (!entry || entry.reset < now) {
    rateLimitMap.set(userId, {
      count: 1,
      reset: now + WINDOW,
    });
    return true;
  }

  if (entry.count >= LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const parsed = orgProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid organization profile" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded (10/hour)" },
        { status: 429 },
      );
    }

    // Timeout handling (10s)
    const result = await Promise.race([
      mapCompliance(parsed.data),
      new Promise((resolve, reject) => setTimeout(() => reject(new Error("Timeout")), 10000)),
    ]);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (err instanceof Error && err.message.toLowerCase().includes("unauthorized")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "Timeout") {
      const fallback = await getComplianceFallback();

      return NextResponse.json({
        success: true,
        data: fallback,
      });
    }

    console.error("Map compliance API error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate framework suggestions",
      },
      { status: 500 },
    );
  }
}
