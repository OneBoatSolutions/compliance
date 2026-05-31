export default function ReportActions({
  onGenerate,
  onDownload,
  generating,
  downloading,
}: {
  onGenerate: () => void;
  onDownload: () => void;
  generating: boolean;
  downloading: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 mb-4">
      <button
        onClick={onGenerate}
        disabled={generating}
        className="bg-purple-600 text-white px-4 py-2 rounded 
        hover:bg-purple-700 transition disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate Report"}
      </button>

      <button
        onClick={onDownload}
        disabled={downloading}
        className="border px-4 py-2 rounded 
        hover:bg-gray-100 transition disabled:opacity-50"
      >
        {downloading ? "Downloading..." : "Download PDF"}
      </button>
    </div>
  );
}
