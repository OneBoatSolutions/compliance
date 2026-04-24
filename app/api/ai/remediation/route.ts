import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-helpers";
import { generateRemediation } from "@/services/ai-service";

const rateLimitMap = new Map<string, { count: number; reset: number }>();

const LIMIT = 10;
const WINDOW = 60 * 60 * 1000; // 1 hour

const remediationRequestSchema = z.object({
  frameworkName: z.string().trim().min(1),
  controlId: z.string().trim().min(1),
  controlTitle: z.string().trim().min(1),
  controlDescription: z.string().trim().min(1),
  currentStatus: z.string().trim().min(1),
  severity: z.string().trim().min(1),
  regenerate: z.boolean().optional(),
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

function getRegenerateFlag(req: NextRequest, bodyRegenerate?: boolean): boolean {
  const queryValue = req.nextUrl.searchParams.get("regenerate");

  if (queryValue === "true") {
    return true;
  }

  if (queryValue === "false") {
    return false;
  }

  return bodyRegenerate ?? false;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const parsed = remediationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid remediation request",
        },
        { status: 400 },
      );
    }

    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded (10/hour)",
        },
        { status: 429 },
      );
    }

    const data = await generateRemediation({
      ...parsed.data,
      regenerate: getRegenerateFlag(req, parsed.data.regenerate),
    });

    return NextResponse.json({
      success: true,
      data,
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

    if (err instanceof Error && err.message.toLowerCase().includes("timed out")) {
      return NextResponse.json(
        {
          success: false,
          error: "AI remediation request timed out",
        },
        { status: 504 },
      );
    }

    console.error("AI remediation API error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate remediation plan",
      },
      { status: 500 },
    );
  }
}
