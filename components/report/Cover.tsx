"use client";

import { Printer, FileDown, Download } from "lucide-react";
import { ShieldCheck } from "lucide-react";

interface CoverProps {
  appName: string;
  frameworks: string[];
  generatedAt: string;
  preparedFor: string;
  version: string;

  isGenerating?: boolean;
  isDownloading?: boolean;
  onGenerate: () => void;
  onDownload: () => void;
}

export default function Cover({
  appName,
  frameworks,
  generatedAt,
  preparedFor,
  version,
  isGenerating,
  isDownloading,
  onGenerate,
  onDownload,
}: CoverProps) {
  const formattedDate = new Date(generatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col bg-white overflow-hidden py-8">
      {/*  Top Bar */}
      <div className="flex justify-between items-center px-8 py-4 text-sm border-b bg-white z-10">
        <span className="text-gray-500 font-medium">Compliance Readiness Report</span>

        <div className="flex gap-2">
          {/*  Print */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1 border rounded 
            hover:bg-gray-100 hover:shadow-sm transition"
          >
            <Printer size={14} />
            Print
          </button>

          {/*  Export (Generate) */}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`flex items-center gap-1 px-3 py-1 border rounded transition
            ${isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 hover:shadow-sm"}`}
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900" />
            ) : (
              <FileDown size={14} />
            )}
            {isGenerating ? "Exporting..." : "Export"}
          </button>

          {/* ⬇ Download */}
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className={`flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded transition
            ${isDownloading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700 hover:shadow-md"}`}
          >
            {isDownloading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
            ) : (
              <Download size={14} />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>

      {/*  Background Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-200 rounded-full blur-3xl opacity-40 top-[-100px] right-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-300 rounded-full blur-2xl opacity-30 bottom-[-120px] left-[-80px]" />
      </div>

      {/*  Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow px-6 space-y-6">
        {/* 🔹 Logo */}
        <div className="flex items-center gap-2 justify-center">
          <ShieldCheck className="text-purple-600 w-6 h-6" />
          <span className="font-semibold text-purple-600 text-lg">Cipherion</span>
        </div>

        {/*  Title */}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.3em] text-gray-800 leading-snug">
          COMPLIANCE READINESS
          <br />
          REPORT
        </h1>

        {/* 🔹 App Name */}
        <p className="text-gray-600 font-medium text-lg">{appName}</p>

        {/* 🔹 Frameworks */}
        <div className="flex gap-2 flex-wrap justify-center">
          {frameworks.map((fw, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full 
              hover:bg-purple-200 transition"
            >
              {fw}
            </span>
          ))}
        </div>
      </div>

      {/*  Footer */}
      <div className="relative z-10 text-center pb-10 text-xs text-gray-500 space-y-1">
        <p>Generated on {formattedDate}</p>
        <p>Prepared for {preparedFor}</p>
        <p>Version {version}</p>
      </div>
    </section>
  );
}
