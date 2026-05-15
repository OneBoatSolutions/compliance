import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SeedControl } from "./types";

// ─── CSV Parser (shared pattern with GDPR / HIPAA) ────────────────────────────

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

// ─── Title derivation (shared pattern with GDPR / HIPAA) ──────────────────────

const titleStopwords = new Set([
  "a",
  "all",
  "an",
  "and",
  "are",
  "at",
  "be",
  "by",
  "can",
  "do",
  "does",
  "for",
  "has",
  "have",
  "how",
  "in",
  "is",
  "its",
  "of",
  "on",
  "or",
  "the",
  "there",
  "to",
  "we",
  "what",
  "who",
  "with",
  "within",
  "you",
  "your",
]);

function formatTitleWord(word: string): string {
  const cleanedWord = word.replace(/[^A-Za-z0-9/-]/g, "");
  if (!cleanedWord) {
    return "";
  }

  if (/^[A-Z0-9/-]+$/.test(cleanedWord)) {
    return cleanedWord;
  }

  return cleanedWord[0].toUpperCase() + cleanedWord.slice(1).toLowerCase();
}

function deriveTitle(description: string): string {
  const cleanedDescription = description
    .replace(/\([^)]*\)/g, " ")
    .replace(/e\.g\./gi, "")
    .replace(/['"".,?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sourceWords = cleanedDescription.split(" ");
  const meaningfulWords = sourceWords.filter(
    (word) => word && !titleStopwords.has(word.toLowerCase()),
  );
  const titleWords = (meaningfulWords.length >= 3 ? meaningfulWords : sourceWords)
    .map(formatTitleWord)
    .filter(Boolean)
    .slice(0, 6);

  return titleWords.join(" ");
}

// ─── CSV column indices (from header: Section, Question, Testing, Response) ───

const colSection = 0;
const colQuestion = 1;
const colTesting = 2;
const colResponse = 3;

// ─── Section header detection ─────────────────────────────────────────────────

/**
 * Matches section header rows such as:
 *   "Section 1: Install and Maintain Network Security Controls"
 *   "Section 3 : Protect Stored Account Data"
 *   "Section 12: Support Information Security..."
 *
 * The pattern accommodates inconsistent spacing around the colon.
 */
const sectionHeaderRegex = /^Section\s+(\d+)\s*:\s*(.+)$/i;

/**
 * Matches requirement codes like "1.1", "1.1.1", "12.8.4.1" etc.
 * Must start with a digit and contain at least one dot-separated segment.
 */
const requirementCodeRegex = /^\d+(?:\.\d+)+$/;

// ─── Severity heuristics ──────────────────────────────────────────────────────

/**
 * PCI-DSS does not carry a per-control severity/risk column in the CSV.
 *
 * Instead of defaulting every control to HIGH/3.0, we apply a lightweight
 * heuristic based on the requirement's depth and the section it belongs to.
 *
 * - **Top-level sub-requirements** (e.g., "1.1.1", "3.3.1") are scored HIGH
 *   because they represent core, actionable compliance requirements.
 * - **Deep sub-requirements** (e.g., "3.6.1.4", "12.8.4.1") that are 4+ levels
 *   deep are given MEDIUM, since they are typically more granular procedural
 *   controls subordinate to a parent HIGH requirement.
 *
 * This is a safe default — Task 9 hardcoding can override individual controls.
 */
function deriveSeverity(code: string): { severity: "HIGH" | "MEDIUM"; weight: number } {
  const depth = code.split(".").length;
  if (depth >= 4) {
    return { severity: "MEDIUM", weight: 2.0 };
  }
  return { severity: "HIGH", weight: 3.0 };
}

// ─── File path resolution ─────────────────────────────────────────────────────

function getCsvFilePath(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "..", "..", "PCI-DSS", "PCI-DSS.csv");
}

// ─── Core parser ──────────────────────────────────────────────────────────────

function loadPciControls(): SeedControl[] {
  const filePath = getCsvFilePath();

  let csvText: string;
  try {
    csvText = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  } catch (err) {
    throw new Error(
      `Failed to read PCI-DSS CSV at ${filePath}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error(
      `PCI-DSS CSV has fewer than 2 rows (got ${rows.length}). File may be empty or corrupt.`,
    );
  }

  // ── Validate header row ──
  const header = rows[0];
  const expectedHeader = ["Section", "Question", "Testing", "Response"];
  for (let i = 0; i < expectedHeader.length; i++) {
    const actual = (header[i] ?? "").trim();
    if (actual !== expectedHeader[i]) {
      throw new Error(
        `PCI-DSS CSV header mismatch at column ${i + 1}: expected "${expectedHeader[i]}", got "${actual}".`,
      );
    }
  }

  // ── Parse data rows ──
  const controls: SeedControl[] = [];
  const seenCodes = new Set<string>();
  let currentCategory = "";

  // Response options from Section 1's header row (or first section header that has them)
  let responseOptions = "";

  for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const sectionCol = (row[colSection] ?? "").trim();
    const questionCol = (row[colQuestion] ?? "").trim();
    const testingCol = (row[colTesting] ?? "").trim();
    const responseCol = (row[colResponse] ?? "").trim();

    // ── Skip blank separator rows ──
    if (!sectionCol && !questionCol && !testingCol && !responseCol) {
      continue;
    }

    // ── Detect section header rows ──
    const sectionMatch = sectionHeaderRegex.exec(sectionCol);
    if (sectionMatch) {
      const sectionTitle = sectionMatch[2].trim();
      currentCategory = sectionTitle;

      // Capture response options if present (typically only on Section 1)
      if (responseCol && !responseOptions) {
        responseOptions = responseCol;
      }
      continue;
    }

    // ── Skip rows where Section column is not a valid requirement code ──
    if (!requirementCodeRegex.test(sectionCol)) {
      continue;
    }

    // ── Skip requirement group rows (no question mark → descriptive statement) ──
    // These are top-level requirement descriptions like "1.1", "3.2" etc.
    // that describe the group but are not actionable control questions.
    if (!questionCol || !questionCol.includes("?")) {
      continue;
    }

    // ── Build the control ──
    const code = `PCI-${sectionCol}`;
    const { severity, weight } = deriveSeverity(sectionCol);

    // Guard against duplicate codes
    if (seenCodes.has(code)) {
      throw new Error(`Duplicate PCI-DSS control code "${code}" at CSV row ${rowIdx + 1}.`);
    }
    seenCodes.add(code);

    const metadata: Record<string, unknown> = {
      pciReq: sectionCol,
    };

    if (testingCol) {
      metadata.testingProcedure = testingCol;
    }

    if (responseOptions) {
      metadata.responseOptions = responseOptions;
    }

    controls.push({
      code,
      title: deriveTitle(questionCol),
      description: questionCol,
      category: currentCategory || "Uncategorized",
      severity,
      weight,
      metadata,
    });
  }

  if (controls.length === 0) {
    throw new Error(
      "PCI-DSS CSV parsing produced zero controls. " +
        "Verify that the CSV contains requirement rows with question-mark questions.",
    );
  }

  process.stdout.write(
    `📋  PCI-DSS: parsed ${controls.length} controls from ${getCategoryCount(controls)} sections\n`,
  );

  return controls;
}

function getCategoryCount(controls: SeedControl[]): number {
  const categories = new Set(controls.map((c) => c.category));
  return categories.size;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const pciControls: SeedControl[] = loadPciControls();
