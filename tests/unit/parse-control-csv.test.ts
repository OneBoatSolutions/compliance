import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  parseControlCsvText,
  validateCsvFile,
  csvMaxBytes,
  csvAcceptedMimeTypes,
} from "@/lib/csv/parse-control-csv";

describe("parse-control-csv", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseControlCsvText", () => {
    it("parses simple CSV with headers", () => {
      const csv =
        "code,title,description,category,severity,weight\nC-1,Control One,Desc,General,LOW,1";
      const { rows, fileError } = parseControlCsvText(csv);
      expect(fileError).toBeUndefined();
      expect(rows).toHaveLength(1);
      expect(rows[0].data?.code).toBe("C-1");
      expect(rows[0].data?.title).toBe("Control One");
    });

    it("returns fileError for empty content", () => {
      const result = parseControlCsvText("   ");
      expect(result.fileError).toBe("CSV file is empty");
      expect(result.rows).toEqual([]);
    });

    it("returns fileError when CSV has no data rows", () => {
      const result = parseControlCsvText("code,title,description,category,severity,weight");
      expect(result.fileError).toBe("CSV contains no data rows");
    });

    it("returns fileError when required columns are missing", () => {
      const csv = "code,title\nC-1,Control One";
      const result = parseControlCsvText(csv);
      expect(result.fileError).toContain("CSV must include columns");
    });

    it("returns row-level errors when row data fails schema validation", () => {
      const csv = "code,title,description,category,severity,weight\n,Title,Desc,Cat,LOW,1";
      const { rows, fileError } = parseControlCsvText(csv);
      expect(fileError).toBeUndefined();
      expect(rows).toHaveLength(1);
      expect(rows[0].errors.length).toBeGreaterThan(0);
      expect(rows[0].data).toBeUndefined();
    });

    it("normalizes header names (case-insensitive) and trims values", () => {
      const csv = "  CODE  ,Title,Description,Category,Severity,Weight\nc-1,Title,Desc,Cat,low,1";
      const { rows } = parseControlCsvText(csv);
      expect(rows[0].data?.code).toBe("c-1");
      expect(rows[0].data?.severity).toBe("LOW");
    });

    it("assigns NaN weight when value is empty", () => {
      const csv = "code,title,description,category,severity,weight\nC-1,Title,Desc,Cat,LOW,";
      const { rows } = parseControlCsvText(csv);
      expect(rows[0].errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateCsvFile", () => {
    function file(name: string, size: number, type: string): File {
      return new File([new Uint8Array(size)], name, { type });
    }

    it("rejects non-CSV filenames", () => {
      const f = file("data.txt", 100, "text/plain");
      expect(validateCsvFile(f)).toBe("Only .csv files are accepted");
    });

    it("rejects files exceeding the byte limit", () => {
      const f = file("big.csv", csvMaxBytes + 1, "text/csv");
      expect(validateCsvFile(f)).toContain("MB limit");
    });

    it("rejects unsupported mime types when type is provided", () => {
      const f = file("data.csv", 100, "application/octet-stream");
      expect(validateCsvFile(f)).toContain("Unsupported file type");
    });

    it("accepts valid csv files with allowed mime types", () => {
      const f = file("data.csv", 100, "text/csv");
      expect(validateCsvFile(f)).toBeNull();
    });

    it("accepts csv files without a mime type", () => {
      const f = file("data.csv", 100, "");
      expect(validateCsvFile(f)).toBeNull();
    });

    it("accepts all mime types in csvAcceptedMimeTypes", () => {
      csvAcceptedMimeTypes.forEach((mime) => {
        const f = file("data.csv", 100, mime);
        expect(validateCsvFile(f)).toBeNull();
      });
    });
  });
});
