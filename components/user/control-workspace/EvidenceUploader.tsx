"use client";

import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

export default function EvidenceUploader({
  files = [],
  setFiles,
}: any) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev: any) => [...(prev || []), ...newFiles]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev: any) =>
      (prev || []).filter((_: any, i: number) => i !== index)
    );
  };

  // 🧠 File type icon logic
  const getFileIcon = (file: File) => {
    if (file.type.includes("image")) {
      return <ImageIcon className="text-blue-500" size={18} />;
    }
    return <FileText className="text-red-500" size={18} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-2px">
        <p className="font-medium">Supporting Evidence</p></div>


      {/* 🔥 Drop Zone */}
      <label className="block cursor-pointer">
        <div className="border-2 border-dashed border-primary 
        bg-primary/5 rounded-xl p-6 text-center transition hover:bg-primary/10">

          <Upload className="mx-auto mb-2 text-primary" size={20} />

          <p className="text-sm">
            Drag & drop files or{" "}
            <span className="text-primary underline">browse</span>
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            PDF, PNG, JPG, or XLSX up to 10MB
          </p>
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* 📄 File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file: File, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-lg p-3 bg-muted/30"
            >
              <div className="flex items-center gap-2 text-sm">
                {getFileIcon(file)}
                <span className="truncate">{file.name}</span>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
