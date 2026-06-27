/**
 * POST /api/frameworks/:id/controls/import
 * Body: raw CSV text (Content-Type: text/csv or text/plain).
 */
import { Prisma } from "@prisma/client";
import { withErrorHandler } from "@/lib/api-handler";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { csvMaxBytes, parseControlCsvText } from "@/lib/csv/parse-control-csv";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;

  const framework = await prisma.framework.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!framework) {
    return notFoundResponse("Framework not found");
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType && !contentType.includes("text/csv") && !contentType.includes("text/plain")) {
    return errorResponse("Content-Type must be text/csv or text/plain", 415);
  }

  const raw = await req.text();

  if (!raw.trim()) {
    return errorResponse("Request body must contain CSV data", 400);
  }

  if (Buffer.byteLength(raw, "utf8") > csvMaxBytes) {
    return errorResponse(`CSV exceeds the ${csvMaxBytes / (1024 * 1024)}MB limit`, 413);
  }

  const { rows, fileError } = parseControlCsvText(raw);

  if (fileError) {
    return errorResponse(fileError, 422);
  }

  const invalid = rows.filter((row) => row.errors.length > 0);

  if (invalid.length > 0) {
    return validationErrorResponse({
      rows: invalid.map((row) => ({
        row: row.rowNumber,
        message: row.errors.join("; "),
      })),
    });
  }

  const validated: Prisma.ControlCreateManyInput[] = rows
    .filter((row) => row.data)
    .map((row) => ({
      frameworkId: id,
      code: row.data!.code,
      title: row.data!.title,
      description: row.data!.description,
      category: row.data!.category,
      severity: row.data!.severity,
      weight: row.data!.weight,
    }));

  try {
    await prisma.$transaction(
      validated.map((data) =>
        prisma.control.create({
          data: {
            frameworkId: data.frameworkId!,
            code: data.code,
            title: data.title,
            description: data.description,
            category: data.category,
            severity: data.severity,
            weight: data.weight,
          },
        }),
      ),
    );

    return successResponse({ imported: validated.length }, 201);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return errorResponse(
        "Import failed: duplicate control code within this framework or existing data conflict",
        409,
      );
    }
    throw e;
  }
});
