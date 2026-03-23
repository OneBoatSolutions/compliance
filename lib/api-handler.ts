import { NextResponse } from "next/server";

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

export function withErrorHandler(handler: Handler) {
  return async (req: Request, ctx?: unknown) => {
    try {
      return await handler(req, ctx);
    } catch (error: unknown) {
      console.error("API Error:", error);

      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Internal Server Error",
        },
        { status: 500 },
      );
    }
  };
}
