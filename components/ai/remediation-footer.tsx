import { RefreshCw, Save, FileDown } from "lucide-react";

export default function RemediationFooter({
  onRegenerate,
  onSave,
  onExport,
  regenerating,
}: {
  onRegenerate: () => void;
  onSave: () => void;
  onExport: () => void;
  regenerating: boolean;
}) {
  return (
    <div className="p-4 flex justify-end gap-3 bg-white">
      {/* REGENERATE */}
      <button
        onClick={onRegenerate}
        disabled={regenerating}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md 
             hover:bg-gray-100 transition disabled:opacity-50"
      >
        <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
        {regenerating ? "Regenerating..." : "Regenerate"}
      </button>

      {/* SAVE */}
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md 
                   hover:bg-gray-100 transition"
      >
        <Save size={14} />
        Save Plan
      </button>

      {/* EXPORT */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-1.5 text-sm 
                   bg-purple-600 text-white rounded-md 
                   hover:bg-purple-700 transition"
      >
        <FileDown size={14} />
        Export TXT
      </button>
    </div>
  );
}
