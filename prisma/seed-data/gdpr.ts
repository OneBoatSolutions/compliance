import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SeedControl } from "./types";

type RiskCode = "H" | "M" | "L";
type AreaCode = "Discover" | "Manage" | "Protect" | "Report";

interface RawSeedControl {
  code: string;
  article: string;
  area: AreaCode;
  description: string;
  evidenceRequired: string;
  risk: RiskCode;
  isGateway?: boolean;
}

const categoryByArea: Record<AreaCode, string> = {
  Discover: "Data Discovery & Inventory",
  Manage: "Data Governance & Rights",
  Protect: "Data Protection & Security",
  Report: "Regulatory Compliance & Reporting",
};

const severityByRisk = {
  H: "HIGH",
  M: "MEDIUM",
  L: "LOW",
} as const;

const weightByRisk = {
  H: 3.0,
  M: 2.0,
  L: 1.0,
} as const;

const titleStopwords = new Set([
  "a",
  "all",
  "an",
  "and",
  "are",
  "be",
  "by",
  "can",
  "data",
  "does",
  "for",
  "have",
  "how",
  "in",
  "is",
  "its",
  "of",
  "on",
  "or",
  "organization",
  "org",
  "personal",
  "place",
  "the",
  "there",
  "timely",
  "to",
  "used",
  "using",
  "where",
  "with",
]);

const gatewayConfigMap: Record<
  string,
  {
    title: string;
    description: string;
    area: AreaCode;
    article: string;
    evidenceRequired: string;
  }
> = {
  "GW-CH": {
    title: "Children's data processing gateway",
    description: "Does the organization collect or process personal data of children?",
    area: "Manage",
    article: "Art. 8",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M1.6-M1.8 as N/A",
  },
  "GW-SC": {
    title: "Special category data gateway",
    description:
      "Does the organization process special category personal data (health, biometric, religion, racial origin etc.)?",
    area: "Manage",
    article: "Art. 9",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M1.9-M1.10 as N/A",
  },
  "GW-ADM": {
    title: "Automated decisions gateway",
    description:
      "Does the organization use automated decision-making or profiling that produces legal or similarly significant effects on individuals?",
    area: "Manage",
    article: "Art. 22",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M10.0-M10.4 as N/A",
  },
  "GW-DPO": {
    title: "DPO requirement gateway",
    description:
      "Is the organization required to appoint a Data Protection Officer (public authority, large-scale processing, or special category data)?",
    area: "Manage",
    article: "Art. 37",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M11.0-M11.6 as N/A",
  },
  "GW-ENC": {
    title: "Sensitive data encryption gateway",
    description:
      "Does the organization store or transmit sensitive personal data requiring encryption (e.g., IDs, financial, health data)?",
    area: "Protect",
    article: "Art. 32",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls P2.0-P2.4 as N/A",
  },
  "GW-INT": {
    title: "International transfers gateway",
    description: "Does the organization transfer personal data outside the EU/EEA?",
    area: "Report",
    article: "Art. 45, 46",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls R2.0-R2.5 as N/A",
  },
  "GW-3P": {
    title: "Third-party sharing gateway",
    description:
      "Does the organization share personal data with third-party service providers / processors?",
    area: "Report",
    article: "Art. 28",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls R3.0-R3.5 as N/A",
  },
  "GW-DPIA": {
    title: "High-risk processing gateway",
    description:
      "Does the organization perform high-risk processing activities that require a Data Protection Impact Assessment (DPIA)?",
    area: "Report",
    article: "Art. 35",
    evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls R4.0-R4.6 as N/A",
  },
};

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

function getCsvFilePath(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), "..", "..", "GDPR", "v2_gap_assessment.csv");
}

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
    .replace(/how\/where/gi, "how where")
    .replace(/e\.g\./gi, "")
    .replace(/['".,?]/g, " ")
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

function toAreaCode(value: string): AreaCode {
  if (value === "Discover" || value === "Manage" || value === "Protect" || value === "Report") {
    return value;
  }

  throw new Error(`Unsupported GDPR area value: ${value}`);
}

function toRiskCode(value: string): RiskCode {
  if (value === "H" || value === "M" || value === "L") {
    return value;
  }

  throw new Error(`Unsupported GDPR risk value: ${value}`);
}

function loadRawControls(): RawSeedControl[] {
  const csvText = readFileSync(getCsvFilePath(), "utf8").replace(/^\uFEFF/, "");
  const rows = parseCsv(csvText);
  const headerIndex = rows.findIndex((row) => row[0]?.trim() === "Control ID");

  if (headerIndex === -1) {
    throw new Error("Could not find the GDPR CSV header row.");
  }

  const rawControls: RawSeedControl[] = [];
  const dataRows = rows.slice(headerIndex + 1);

  for (const row of dataRows) {
    const [
      rawCode = "",
      rawArticle = "",
      rawArea = "",
      rawQuestion = "",
      rawEvidence = "",
      rawRisk = "",
    ] = row;
    const code = rawCode.trim();

    if (!code) {
      continue;
    }

    if (/^SECTION\s+/i.test(code) || /^[A-Z]\.\d+:/.test(code)) {
      continue;
    }

    if (code.startsWith("GW-")) {
      const gateway = gatewayConfigMap[code];
      if (!gateway) {
        throw new Error(`Missing gateway config for ${code}`);
      }

      rawControls.push({
        code: `GDPR-${code}`,
        article: gateway.article || rawArticle.trim(),
        area: gateway.area,
        description: gateway.description,
        evidenceRequired: gateway.evidenceRequired,
        risk: "H",
        isGateway: true,
      });
      continue;
    }

    rawControls.push({
      code: `GDPR-${code}`,
      article: rawArticle.trim(),
      area: toAreaCode(rawArea.trim()),
      description: rawQuestion.trim(),
      evidenceRequired: rawEvidence.trim(),
      risk: toRiskCode(rawRisk.trim()),
    });
  }

  if (rawControls.length !== 169) {
    throw new Error(`Expected 169 GDPR controls but parsed ${rawControls.length}.`);
  }

  return rawControls;
}

const rawControls = loadRawControls();

export const gdprControls: SeedControl[] = rawControls.map((control) => {
  const gatewayKey = control.code.replace(/^GDPR-/, "");
  const gatewayConfig = gatewayConfigMap[gatewayKey];
  const title = control.isGateway ? gatewayConfig.title : deriveTitle(control.description);

  return {
    code: control.code,
    title,
    description: control.description,
    category: categoryByArea[control.area],
    severity: control.isGateway ? "HIGH" : severityByRisk[control.risk],
    weight: control.isGateway ? 3.0 : weightByRisk[control.risk],
    ...(control.isGateway ? { isGateway: true } : {}),
    metadata: {
      article: control.article,
      evidenceRequired: control.evidenceRequired,
      area: control.area,
    },
  };
});
