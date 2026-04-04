/**
 * POST /api/frameworks/:id/controls/import
 * Body: raw CSV text (Content-Type: text/csv or text/plain).
 * Expected columns: code, title, description, category, severity, weight
 * (header row required; column names are matched case-insensitively).
 */
import { Prisma } from "@prisma/client";
import Papa from "papaparse";
import { withErrorHandler } from "@/lib/api-handler";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { controlCsvRowSchema } from "@/lib/validations/framework";

interface RouteContext {
  params: { id: string };
}

const expectedImportColumns = [
  "code",
  "title",
  "description",
  "category",
  "severity",
  "weight",
] as const;

function normalizeHeaderRecord(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k.toLowerCase().trim();
    out[key] = v === null || v === undefined ? "" : String(v).trim();
  }
  return out;
}

export const POST = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAdmin();

  const framework = await prisma.framework.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!framework) {
    return notFoundResponse("Framework not found");
  }

  const raw = await req.text();

  if (!raw.trim()) {
    return errorResponse("Request body must contain CSV data", 400);
  }

  const parsedCsv = Papa.parse<Record<string, unknown>>(raw, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsedCsv.errors.length > 0) {
    return validationErrorResponse(parsedCsv.errors);
  }

  const rows = parsedCsv.data.filter((r) => Object.keys(r).length > 0);

  if (rows.length === 0) {
    return errorResponse("CSV contains no data rows", 400);
  }

  const first = normalizeHeaderRecord(rows[0]);
  const missing = expectedImportColumns.filter((k) => !(k in first));
  if (missing.length > 0) {
    return errorResponse(
      `CSV must include columns: ${expectedImportColumns.join(", ")}. Missing: ${missing.join(", ")}`,
      422,
    );
  }

  const rowErrors: { row: number; message: string; details?: unknown }[] = [];
  const validated: Prisma.ControlCreateManyInput[] = [];

  for (let i = 0; i < rows.length; i++) {
    const normalized = normalizeHeaderRecord(rows[i]);
    const candidate = {
      code: normalized.code ?? "",
      title: normalized.title ?? "",
      description: normalized.description ?? "",
      category: normalized.category === "" ? undefined : (normalized.category ?? undefined),
      severity: normalized.severity === "" ? undefined : normalized.severity,
      weight: normalized.weight === "" ? undefined : Number.parseFloat(normalized.weight),
    };

    const result = controlCsvRowSchema.safeParse(candidate);

    if (!result.success) {
      rowErrors.push({
        row: i + 2,
        message: "Validation failed",
        details: result.error.format(),
      });
      continue;
    }

    validated.push({
      frameworkId: params.id,
      code: result.data.code,
      title: result.data.title,
      description: result.data.description,
      category: result.data.category ?? null,
      severity: result.data.severity,
      weight: result.data.weight,
    });
  }

  if (rowErrors.length > 0) {
    return validationErrorResponse({ rows: rowErrors });
  }

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
