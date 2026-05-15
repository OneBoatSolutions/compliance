import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SeedControl } from "./types";

// ─── CSV Parser (shared pattern with GDPR) ────────────────────────────────────

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

// ─── Title derivation (shared pattern with GDPR) ──────────────────────────────

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

// ─── Severity / weight mapping ────────────────────────────────────────────────

type RequiredSpec = "Required" | "Addressable" | "Required & Addressable" | "N/A";

const severityBySpec: Record<RequiredSpec, "HIGH" | "MEDIUM"> = {
  Required: "HIGH",
  "Required & Addressable": "HIGH",
  Addressable: "MEDIUM",
  "N/A": "MEDIUM",
};

const weightBySpec: Record<RequiredSpec, number> = {
  Required: 3.0,
  "Required & Addressable": 3.0,
  Addressable: 2.0,
  "N/A": 2.0,
};

function toRequiredSpec(value: string): RequiredSpec {
  const trimmed = value.trim();
  if (
    trimmed === "Required" ||
    trimmed === "Addressable" ||
    trimmed === "Required & Addressable" ||
    trimmed === "N/A"
  ) {
    return trimmed;
  }

  throw new Error(
    `Unsupported HIPAA "Required?" value: "${trimmed}". Expected "Required", "Addressable", "Required & Addressable", or "N/A".`,
  );
}

// ─── Reference cleanup ───────────────────────────────────────────────────────

/**
 * The CSV files are encoded in Latin-1 / CP1252 where byte 0xA7 is the
 * section sign (§). The reference field often contains multi-framework
 * references separated by newlines (HIPAA, NIST CSF, HPH CPG, HICP).
 * This function extracts just the primary HIPAA CFR reference.
 */
function cleanReference(raw: string): string {
  // Split multi-line references and find the HIPAA-specific line
  const lines = raw
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const hipaaLine = lines.find((l) => l.startsWith("HIPAA:"));
  if (hipaaLine) {
    return hipaaLine.replace(/^HIPAA:\s*/, "").trim();
  }

  // If no explicit "HIPAA:" prefix, the raw value itself may be a bare CFR ref
  const bareCfr = lines.find((l) => /§?\d{3}\.\d{3}/.test(l));
  if (bareCfr) {
    return bareCfr.trim();
  }

  return raw.trim();
}

// ─── CSV column indices (from header row) ─────────────────────────────────────

// Header: Question #, Question Text, Indicator, Question Responses, Education,
//         Risk, Risk Indicated, Required?, Reference
const colQuestionNum = 0;
const colQuestionText = 1;
const colQuestionResponses = 3;
const colRequired = 7;
const colReference = 8;

// ─── Core parser ──────────────────────────────────────────────────────────────

interface ParsedQuestion {
  questionNum: number;
  questionText: string;
  requiredSpec: RequiredSpec;
  reference: string;
}

function parseSection(
  csvText: string,
  sectionNum: number,
): {
  sectionLabel: string;
  questions: ParsedQuestion[];
} {
  const rows = parseCsv(csvText.replace(/^\uFEFF/, ""));

  if (rows.length < 3) {
    throw new Error(`HIPAA Section ${sectionNum} CSV has fewer than 3 rows (got ${rows.length}).`);
  }

  // Row 0 = section label (e.g. "Section 1 - SRA Basics")
  const sectionLabel = (rows[0][0] ?? "").trim();
  if (!sectionLabel) {
    throw new Error(`HIPAA Section ${sectionNum} CSV is missing its section label in row 1.`);
  }

  // Row 1 = header; Row 2 = "Section Questions"
  // Validate header
  const header = rows[1];
  if (!header || header[colQuestionNum]?.trim() !== "Question #") {
    throw new Error(
      `HIPAA Section ${sectionNum} CSV header mismatch — expected "Question #" in column 1, ` +
        `got "${header?.[colQuestionNum]?.trim() ?? "(empty)"}".`,
    );
  }

  const questions: ParsedQuestion[] = [];

  // Track current question being built
  let currentQuestion: {
    questionNum: number;
    questionText: string;
    requiredSpec: RequiredSpec | null;
    reference: string;
  } | null = null;

  // Data rows start after header (row 1) and "Section Questions" (row 2)
  const dataRows = rows.slice(3);

  for (const row of dataRows) {
    const col0 = (row[colQuestionNum] ?? "").trim();
    const col1 = (row[colQuestionText] ?? "").trim();

    // ── Detect end of questions section ──
    // "Threats & Vulnerabilities" or similar non-question sections appear
    // at the bottom. We stop when we encounter a row whose first cell
    // is NOT a number, NOT empty, and NOT "Notes".
    if (col0 !== "" && !/^\d+$/.test(col0) && col0 !== "Notes") {
      // This is a section divider like "Threats & Vulnerabilities"
      break;
    }

    // ── Question row: col0 is a number AND col1 has text ──
    if (/^\d+$/.test(col0) && col1 !== "") {
      // Flush previous question if present
      if (currentQuestion) {
        // Some questions have no Required? value in any response row.
        // Default to "N/A" (→ MEDIUM severity) for those.
        const spec = currentQuestion.requiredSpec ?? "N/A";
        questions.push({
          questionNum: currentQuestion.questionNum,
          questionText: currentQuestion.questionText,
          requiredSpec: spec,
          reference: currentQuestion.reference,
        });
      }

      currentQuestion = {
        questionNum: parseInt(col0, 10),
        questionText: col1,
        requiredSpec: null,
        reference: "",
      };
      continue;
    }

    // ── Response/metadata row: col0 is empty, Question Responses is populated ──
    if (currentQuestion && col0 === "") {
      // "Notes" rows (col1 === "Notes") are skipped
      if (col1 === "Notes") {
        continue;
      }

      const responseText = (row[colQuestionResponses] ?? "").trim();
      if (!responseText) {
        continue;
      }

      // Capture Required? and Reference from the first response row that has them
      if (currentQuestion.requiredSpec === null) {
        const rawRequired = (row[colRequired] ?? "").trim();
        if (rawRequired) {
          currentQuestion.requiredSpec = toRequiredSpec(rawRequired);
        }

        const rawRef = (row[colReference] ?? "").trim();
        if (rawRef) {
          currentQuestion.reference = cleanReference(rawRef);
        }
      }
    }
  }

  // Flush the last question
  if (currentQuestion) {
    const spec = currentQuestion.requiredSpec ?? "N/A";
    questions.push({
      questionNum: currentQuestion.questionNum,
      questionText: currentQuestion.questionText,
      requiredSpec: spec,
      reference: currentQuestion.reference,
    });
  }

  if (questions.length === 0) {
    throw new Error(`HIPAA Section ${sectionNum} CSV parsed zero questions.`);
  }

  return { sectionLabel, questions };
}

// ─── File discovery & loading ─────────────────────────────────────────────────

function getHipaaDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "..", "..", "HIPAA");
}

function discoverSectionFiles(hipaaDir: string): { filePath: string; sectionNum: number }[] {
  const entries = readdirSync(hipaaDir);
  const sectionPattern = /^Section (\d+)\.csv$/i;

  const sections: { filePath: string; sectionNum: number }[] = [];

  for (const entry of entries) {
    const match = sectionPattern.exec(entry);
    if (match) {
      sections.push({
        filePath: path.join(hipaaDir, entry),
        sectionNum: parseInt(match[1], 10),
      });
    }
  }

  // Sort by section number for deterministic ordering
  sections.sort((a, b) => a.sectionNum - b.sectionNum);

  if (sections.length === 0) {
    throw new Error(
      `No HIPAA Section CSV files found in ${hipaaDir}. Expected files named "Section N.csv".`,
    );
  }

  return sections;
}

// ─── Build SeedControl[] ──────────────────────────────────────────────────────

function loadHipaaControls(): SeedControl[] {
  const hipaaDir = getHipaaDir();
  const sectionFiles = discoverSectionFiles(hipaaDir);
  const controls: SeedControl[] = [];
  const seenCodes = new Set<string>();

  for (const { filePath, sectionNum } of sectionFiles) {
    const csvText = readFileSync(filePath, "latin1");
    const { sectionLabel, questions } = parseSection(csvText, sectionNum);

    for (const q of questions) {
      const code = `HIPAA-S${sectionNum}-Q${q.questionNum}`;

      // Guard against duplicate codes (should not happen with well-formed CSVs)
      if (seenCodes.has(code)) {
        throw new Error(
          `Duplicate HIPAA control code "${code}" — Section ${sectionNum} has ` +
            `duplicate question number ${q.questionNum}.`,
        );
      }
      seenCodes.add(code);

      controls.push({
        code,
        title: deriveTitle(q.questionText),
        description: q.questionText,
        category: sectionLabel,
        severity: severityBySpec[q.requiredSpec],
        weight: weightBySpec[q.requiredSpec],
        metadata: {
          cfrReference: q.reference || null,
          specification: q.requiredSpec,
          section: sectionLabel,
        },
      });
    }
  }

  if (controls.length === 0) {
    throw new Error("HIPAA CSV parsing produced zero controls.");
  }

  process.stdout.write(
    `📋  HIPAA: parsed ${controls.length} controls from ${sectionFiles.length} sections\n`,
  );

  return controls;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const hipaaControls: SeedControl[] = loadHipaaControls();
