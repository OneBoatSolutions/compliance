import { NextResponse } from "next/server";
import { forbiddenResponse, unauthorizedResponse } from "@/lib/api-helpers";

type HandlerWithoutContext = (req: Request) => Promise<Response>;
type HandlerWithContext<TContext> = (req: Request, ctx: TContext) => Promise<Response>;

export function withErrorHandler(handler: HandlerWithoutContext): HandlerWithoutContext;
export function withErrorHandler<TContext>(
  handler: HandlerWithContext<TContext>,
): HandlerWithContext<TContext>;

export function withErrorHandler<TContext>(
  handler: HandlerWithoutContext | HandlerWithContext<TContext>,
) {
  return async (req: Request, ctx?: TContext) => {
    try {
      if (ctx === undefined) {
        return await (handler as HandlerWithoutContext)(req);
      }

      return await (handler as HandlerWithContext<TContext>)(req, ctx);
    } catch (error: unknown) {
      console.error("API Error:", error);

      const message = error instanceof Error ? error.message : "Internal Server Error";

      if (message.startsWith("401")) {
        return unauthorizedResponse();
      }

      if (message.startsWith("403")) {
        return forbiddenResponse();
      }

      return NextResponse.json(
        {
          error: message,
        },
        { status: 500 },
      );
    }
  };
}
