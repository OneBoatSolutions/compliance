import { FileText, FileDown, RefreshCw, Save, Loader2 } from "lucide-react";

export default function RemediationFooter({
  onRegenerate,
  onSave,
  onExportPdf,
  onExportMarkdown,
  regenerating,
  saving,
  disabled,
}: {
  onRegenerate: () => void;
  onSave: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  regenerating: boolean;
  saving: boolean;
  disabled: boolean;
}) {
  return (
    <div className="p-4 flex flex-wrap justify-end gap-3 bg-white print:hidden">
      <button
        type="button"
        onClick={onRegenerate}
        disabled={disabled || regenerating}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100 transition disabled:opacity-50"
      >
        <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
        {regenerating ? "Regenerating..." : "Regenerate"}
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={disabled || saving}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100 transition disabled:opacity-50"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "Saving..." : "Save Plan"}
      </button>

      <button
        type="button"
        onClick={onExportMarkdown}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100 transition disabled:opacity-50"
      >
        <FileText size={14} />
        Markdown
      </button>

      <button
        type="button"
        onClick={onExportPdf}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
      >
        <FileDown size={14} />
        Export PDF
      </button>
    </div>
  );
}
