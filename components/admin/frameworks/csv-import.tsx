"use client";

import { useState } from "react";

import Papa from "papaparse";

import { CreateControlPayload } from "@/types/framework";

interface Props {
  frameworkId: string;

  refresh: () => Promise<void>;
  disabled: boolean;
}
interface CsvControlRow {
  code: string;

  title: string;

  description?: string;

  category?: string;

  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  weight?: string;
}

export function CsvImport({ frameworkId, refresh, disabled }: Props) {
  const [rows, setRows] = useState<CreateControlPayload[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [csvText, setCsvText] = useState("");

  async function confirmImport() {
    const response = await fetch(`/api/frameworks/${frameworkId}/controls/import`, {
      method: "POST",
      headers: {
        "Content-Type": "text/csv",
      },
      body: csvText,
    });

    if (!response.ok) {
      const error = await response.json();

      console.log(error);

      alert("Import failed");

      return;
    }

    await refresh();

    setRows([]);
    setFileName("");
    setCsvText("");

    setFileInputKey((previous) => previous + 1);
  }
  function cancelImport() {
    setRows([]);

    setFileName("");

    setFileInputKey((previous) => previous + 1);
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
          Upload compliance controls in bulk using a CSV file. Preview all parsed controls before
          committing them to the framework.
        </p>
      </div>

      <div className="p-8">
        <div className="rounded-2xl border border-dashed border-[#c4b5fd] bg-[#faf7ff] p-8">
          <input
            key={fileInputKey}
            disabled={disabled}
            type="file"
            accept=".csv"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              setFileName(file.name);

              const reader = new FileReader();

              reader.onload = () => {
                const text = reader.result as string;

                setCsvText(text);

                Papa.parse<CsvControlRow>(text, {
                  header: true,
                  skipEmptyLines: true,

                  complete(results) {
                    const formattedRows: CreateControlPayload[] = results.data
                      .filter((row) => row.code && row.title)
                      .map((row) => ({
                        code: row.code.trim(),
                        title: row.title.trim(),
                        description: row.description?.trim() || "",
                        category: row.category?.trim() || "",
                        severity: row.severity || "MEDIUM",
                        weight: Number(row.weight) || 1,
                      }));

                    setRows(formattedRows);
                  },
                });
              };

              reader.readAsText(file);
            }}
            className="block w-full text-sm text-[#525252] file:mr-4 file:rounded-xl file:border-0 file:bg-[#6d18ff] file:px-5 file:py-3 file:font-semibold file:text-white hover:file:bg-[#5412cc]"
          />
          {fileName ? (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#ede9fe] bg-white px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#171717]">{fileName}</p>

                <p className="mt-1 text-xs text-[#737373]">CSV file ready for import</p>
              </div>

              <button
                type="button"
                onClick={cancelImport}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          ) : null}

          <div className="mt-4 text-sm text-[#737373]">
            Accepted format:
            <span className="ml-2 font-medium text-[#171717]">
              code, title, description, category, severity, weight
            </span>
          </div>
        </div>

        {rows.length > 0 ? (
          <>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#171717]">Import Preview</h3>

                <p className="mt-1 text-sm text-[#737373]">
                  {rows.length} controls ready for import
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f0ff] px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b5cf6]">
                  Parsed Rows
                </p>

                <p className="mt-1 text-2xl font-bold text-[#171717]">{rows.length}</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#ededed]">
              <table className="w-full">
                <thead className="bg-[#fafafa]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                      Code
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                      Title
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.code}
                      className="border-t border-[#f5f5f5] transition hover:bg-[#fcfbff]"
                    >
                      <td className="px-6 py-4 font-medium text-[#171717]">{row.code}</td>

                      <td className="px-6 py-4 text-[#525252]">{row.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                disabled={disabled}
                onClick={() => void confirmImport()}
                className="rounded-2xl bg-[#6d18ff] px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(109,24,255,0.25)] transition hover:scale-[1.02] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Import
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
