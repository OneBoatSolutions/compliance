import Papa from "papaparse";
import { z } from "zod";

import { controlCsvRowSchema } from "@/lib/validations/framework";

export const csvMaxBytes = 5 * 1024 * 1024;

export const csvAcceptedMimeTypes = new Set([
  "text/csv",
  "application/csv",
  "text/plain",
  "application/vnd.ms-excel",
]);

const expectedImportColumns = [
  "code",
  "title",
  "description",
  "category",
  "severity",
  "weight",
] as const;

export interface ParsedCsvControlRow {
  rowNumber: number;
  raw: Record<string, string>;
  data?: z.infer<typeof controlCsvRowSchema>;
  errors: string[];
}

function normalizeHeaderRecord(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key.toLowerCase().trim()] =
      value === null || value === undefined ? "" : String(value).trim();
  }
  return out;
}

function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });
}

export function validateCsvFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return "Only .csv files are accepted";
  }

  if (file.size > csvMaxBytes) {
    return `File exceeds the ${csvMaxBytes / (1024 * 1024)}MB limit`;
  }

  if (file.type && !csvAcceptedMimeTypes.has(file.type)) {
    return `Unsupported file type: ${file.type}`;
  }

  return null;
}

export function parseControlCsvText(text: string): {
  rows: ParsedCsvControlRow[];
  fileError?: string;
} {
  const trimmed = text.trim();

  if (!trimmed) {
    return { rows: [], fileError: "CSV file is empty" };
  }

  const parsedCsv = Papa.parse<Record<string, unknown>>(trimmed, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsedCsv.errors.length > 0) {
    return {
      rows: [],
      fileError: parsedCsv.errors.map((error) => error.message).join("; "),
    };
  }

  const dataRows = parsedCsv.data.filter((row) => Object.keys(row).length > 0);

  if (dataRows.length === 0) {
    return { rows: [], fileError: "CSV contains no data rows" };
  }

  const first = normalizeHeaderRecord(dataRows[0]);
  const missing = expectedImportColumns.filter((column) => !(column in first));

  if (missing.length > 0) {
    return {
      rows: [],
      fileError: `CSV must include columns: ${expectedImportColumns.join(", ")}. Missing: ${missing.join(", ")}`,
    };
  }

  const rows: ParsedCsvControlRow[] = dataRows.map((row, index) => {
    const normalized = normalizeHeaderRecord(row);
    const rowNumber = index + 2;

    const weightRaw = normalized.weight ?? "";
    const weightParsed =
      weightRaw === "" ? Number.NaN : Number.parseFloat(weightRaw.replace(",", "."));

    const candidate = {
      code: normalized.code ?? "",
      title: normalized.title ?? "",
      description: normalized.description ?? "",
      category: normalized.category ?? "",
      severity: (normalized.severity ?? "").toUpperCase(),
      weight: weightParsed,
    };

    const result = controlCsvRowSchema.safeParse(candidate);

    if (!result.success) {
      return {
        rowNumber,
        raw: normalized,
        errors: formatZodErrors(result.error),
      };
    }

    return {
      rowNumber,
      raw: normalized,
      data: result.data,
      errors: [],
    };
  });

  return { rows };
}
