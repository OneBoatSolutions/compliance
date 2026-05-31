"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  FileArchive,
  Download,
  FileSpreadsheet,
  CheckCircle,
  File,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

const maxFileSize = 10 * 1024 * 1024; // 10MB
const allowedExtensions = ["pdf", "docx", "xlsx", "txt", "png", "jpg", "jpeg", "csv", "zip"];

// Utility to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface UploadedFile {
  id: string;
  file?: File; // Optional since existing files won't have it
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "success" | "error";
  uploadDate: string;
  uploaderName?: string;
  description: string;
}

export interface ExistingFile {
  id: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  description: string | null;
  uploadedAt: string;
  uploaderName?: string;
}

interface EvidenceUploadResponse {
  evidence: ExistingFile[];
}

interface EvidenceUploaderProps {
  assessmentItemId: string;
  existingFiles?: ExistingFile[];
}

export default function EvidenceUploader({
  assessmentItemId,
  existingFiles,
}: EvidenceUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploads = useRef<{ [key: string]: () => void }>({});
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (existingFiles && existingFiles.length > 0) {
      setFiles((prev) => {
        const newFiles = existingFiles.map((f) => ({
          id: f.id,
          name: f.originalName,
          size: f.fileSize,
          type: f.mimeType,
          progress: 100,
          status: "success" as const,
          uploadDate: new Date(f.uploadedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          uploaderName: f.uploaderName,
          description: f.description || "",
        }));

        const prevLocal = prev.filter((p) => !existingFiles.some((ex) => ex.id === p.id));
        return [...prevLocal, ...newFiles];
      });
    }
  }, [existingFiles]);

  const validateFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      toast.error(`File type not allowed: ${file.name}. Allowed: ${allowedExtensions.join(", ")}`);
      return false;
    }
    if (file.size > maxFileSize) {
      toast.error(`File exceeds 10MB limit: ${file.name}`);
      return false;
    }
    return true;
  };

  const processFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > 20) {
      toast.error("Maximum 20 files per item allowed.");
      return;
    }

    const validFiles = newFiles.filter(validateFile);
    if (validFiles.length === 0) {
      return;
    }

    validFiles.forEach((file) => {
      const id = Math.random().toString(36).substring(7);
      const newUpload: UploadedFile = {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
        uploadDate: new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: "",
      };

      setFiles((prev) => [...prev, newUpload]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assessmentItemId", assessmentItemId);
      formData.append("description", "");

      const { promise, abort } = apiClient.upload<EvidenceUploadResponse>(
        "/api/evidence/upload",
        formData,
        (progress) => {
          setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)));
        },
      );

      activeUploads.current[id] = abort;

      promise
        .then((response) => {
          const uploadedEvidence = response.evidence?.[0];
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    id: uploadedEvidence?.id || id,
                    progress: 100,
                    status: "success",
                    uploaderName: uploadedEvidence?.uploaderName,
                  }
                : f,
            ),
          );
          toast.success(`${file.name} uploaded successfully.`);
        })
        .catch((err) => {
          if (err?.message !== "Aborted") {
            setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error" } : f)));
            toast.error(`Failed to upload ${file.name}`);
          }
        })
        .finally(() => {
          delete activeUploads.current[id];
        });
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = async (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (!fileToRemove) {
      return;
    }

    if (fileToRemove.status === "uploading") {
      const abortFn = activeUploads.current[id];
      if (abortFn) {
        abortFn();
      }
      setFiles((prev) => prev.filter((f) => f.id !== id));
      return;
    }

    if (fileToRemove.status === "success") {
      try {
        await apiClient.delete(`/api/evidence/${fileToRemove.id}`);
        setFiles((prev) => prev.filter((f) => f.id !== id));
        toast.success("File deleted successfully");
      } catch {
        toast.error("Failed to delete file from server");
      }
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const updateDescription = (id: string, description: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, description } : f)));
  };

  const downloadFile = async (fileObj: UploadedFile) => {
    try {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.add(fileObj.id);
        return next;
      });
      const data = await apiClient.get<{ downloadUrl: string }>(`/api/evidence/${fileObj.id}`);
      if (data && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        toast.error("Download URL not found in response");
      }
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(fileObj.id);
        return next;
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["png", "jpg", "jpeg"].includes(extension || "")) {
      return <ImageIcon className="text-blue-500" size={24} />;
    }
    if (["zip", "csv"].includes(extension || "")) {
      return <FileArchive className="text-amber-500" size={24} />;
    }
    if (["xlsx", "csv"].includes(extension || "")) {
      return <FileSpreadsheet className="text-green-500" size={24} />;
    }
    if (["pdf"].includes(extension || "")) {
      return <FileText className="text-red-500" size={24} />;
    }
    return <File className="text-gray-500" size={24} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-lg">Supporting Evidence</h3>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <Upload className="mx-auto mb-3 text-slate-400" size={28} />
        <p className="text-sm font-medium mb-1">
          Drag & drop files here or <span className="text-primary underline">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Supported: PDF, DOCX, XLSX, TXT, PNG, JPG, CSV, ZIP (Max: 10MB)
        </p>
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700">Uploaded Files</h4>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white border rounded-xl p-4 shadow-sm flex flex-col space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-[400px]">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadDate}</span>
                        {file.uploaderName && (
                          <>
                            <span>•</span>
                            <span>{file.uploaderName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === "success" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadFile(file)}
                        disabled={downloadingIds.has(file.id)}
                        title="Download file"
                        className="text-slate-500 hover:text-primary disabled:opacity-50"
                      >
                        {downloadingIds.has(file.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                        ) : (
                          <Download size={16} />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      title="Remove file"
                      className="text-slate-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar or Description Input */}
                {file.status === "uploading" ? (
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Uploading...</span>
                      <span>{Math.round(file.progress)}%</span>
                    </div>
                    <Progress value={file.progress} className="h-2" />
                  </div>
                ) : (
                  <div className="pt-2 border-t flex items-center gap-2 mt-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <Input
                      placeholder="Add a description for this evidence..."
                      value={file.description}
                      onChange={(e) => updateDescription(file.id, e.target.value)}
                      className="h-8 text-sm flex-1 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-all"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
