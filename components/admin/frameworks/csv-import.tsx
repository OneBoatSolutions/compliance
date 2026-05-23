"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  csvMaxBytes,
  parseControlCsvText,
  validateCsvFile,
  type ParsedCsvControlRow,
} from "@/lib/csv/parse-control-csv";

interface Props {
  frameworkId: string;
  refresh: () => Promise<void>;
  disabled: boolean;
}

export function CsvImport({ frameworkId, refresh, disabled }: Props) {
  const [parsedRows, setParsedRows] = useState<ParsedCsvControlRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [csvText, setCsvText] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const validRows = useMemo(
    () => parsedRows.filter((row) => row.errors.length === 0 && row.data),
    [parsedRows],
  );
  const invalidRows = useMemo(
    () => parsedRows.filter((row) => row.errors.length > 0),
    [parsedRows],
  );
  const canImport = validRows.length > 0 && invalidRows.length === 0 && !fileError && !disabled;

  function resetImport() {
    setParsedRows([]);
    setFileName("");
    setCsvText("");
    setFileError(null);
    setFileInputKey((previous) => previous + 1);
  }

  async function confirmImport() {
    if (!canImport) {
      return;
    }

    try {
      setImporting(true);

      const response = await fetch(`/api/frameworks/${frameworkId}/controls/import`, {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: csvText,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message ?? "Import failed");
        return;
      }

      toast.success(`Imported ${result.data?.imported ?? validRows.length} controls`);
      await refresh();
      resetImport();
    } catch {
      toast.error("Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-white shadow-[0_10px_40px_rgba(109,24,255,0.06)]">
      <div className="border-b border-[#f5f5f5] px-8 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b5cf6]">
          Bulk Operations
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
          CSV Control Import
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#737373]">
          Upload compliance controls in bulk. Rows with validation errors are highlighted and must
          be fixed before import.
        </p>
      </div>

      <div className="p-8">
        <div className="rounded-2xl border border-dashed border-[#c4b5fd] bg-[#faf7ff] p-8">
          <input
            key={fileInputKey}
            disabled={disabled}
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              const validationError = validateCsvFile(file);
              if (validationError) {
                setFileError(validationError);
                setParsedRows([]);
                setFileName(file.name);
                return;
              }

              if (file.size > csvMaxBytes) {
                setFileError(`File exceeds the ${csvMaxBytes / (1024 * 1024)}MB limit`);
                return;
              }

              setFileName(file.name);
              setFileError(null);

              const reader = new FileReader();
              reader.onload = () => {
                const text = String(reader.result ?? "");
                setCsvText(text);

                const { rows, fileError: parseError } = parseControlCsvText(text);
                setParsedRows(rows);
                setFileError(parseError ?? null);
              };
              reader.readAsText(file);
            }}
            className="block w-full text-sm text-[#525252] file:mr-4 file:rounded-xl file:border-0 file:bg-[#6d18ff] file:px-5 file:py-3 file:font-semibold file:text-white hover:file:bg-[#5412cc]"
          />

          {fileName ? (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#ede9fe] bg-white px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#171717]">{fileName}</p>
                <p className="mt-1 text-xs text-[#737373]">
                  {invalidRows.length > 0
                    ? `${invalidRows.length} row(s) need fixes before import`
                    : `${validRows.length} valid row(s) ready`}
                </p>
              </div>
              <button
                type="button"
                onClick={resetImport}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          ) : null}

          {fileError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {fileError}
            </div>
          ) : null}

          <div className="mt-4 text-sm text-[#737373]">
            Required columns:
            <span className="ml-2 font-medium text-[#171717]">
              code, title, description, category, severity, weight
            </span>
          </div>
        </div>

        {parsedRows.length > 0 ? (
          <>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#171717]">Import Preview</h3>
                <p className="mt-1 text-sm text-[#737373]">
                  {validRows.length} valid · {invalidRows.length} with errors
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#ededed]">
              <table className="w-full">
                <thead className="bg-[#fafafa]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#737373]">
                      Row
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#737373]">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#737373]">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#737373]">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#737373]">
                      Issues
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row) => {
                    const hasErrors = row.errors.length > 0;
                    return (
                      <tr
                        key={`${row.rowNumber}-${row.raw.code}`}
                        className={`border-t border-[#f5f5f5] ${hasErrors ? "bg-red-50" : "hover:bg-[#fcfbff]"}`}
                      >
                        <td className="px-4 py-3 text-sm text-[#525252]">{row.rowNumber}</td>
                        <td className="px-4 py-3 font-medium text-[#171717]">
                          {row.raw.code || "—"}
                        </td>
                        <td className="px-4 py-3 text-[#525252]">{row.raw.title || "—"}</td>
                        <td className="px-4 py-3 text-[#525252]">{row.raw.severity || "—"}</td>
                        <td className="px-4 py-3 text-sm text-red-600">
                          {hasErrors ? row.errors.join("; ") : "Valid"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!canImport || importing}
                onClick={() => void confirmImport()}
                className="rounded-2xl bg-[#6d18ff] px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(109,24,255,0.25)] transition hover:scale-[1.02] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing
                  ? "Importing..."
                  : invalidRows.length > 0
                    ? "Fix errors to import"
                    : "Confirm Import"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
