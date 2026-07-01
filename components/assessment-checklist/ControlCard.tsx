"use client";

import { Control, type Status } from "@/app/(user)/assessments/[id]/checklist/types";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import StatusDropdown from "./StatusDropdown";
import { toast } from "sonner";
import { useUpdateAssessmentItemMutation } from "@/lib/hooks/use-update-assessment-item-mutation";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  XCircle,
  FileText,
  MoreVertical,
  Sparkles,
  Upload,
} from "lucide-react";

interface Props {
  control: Control;
  assessmentId?: string;
  onStatusChange?: (itemId: string, status: Status) => void;
  isStatusUpdating?: boolean;
  onOpenRemediation?: (context: {
    controlId: string;
    assessmentItemId: string;
    controlTitle: string;
    controlDescription: string;
    framework: string;
    status: string;
    severity: string;
    assessmentId: string;
    userNotes?: string | null;
  }) => void;
}

export default function ControlCard({
  control,
  assessmentId,
  onStatusChange,
  isStatusUpdating = false,
  onOpenRemediation,
}: Props) {
  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [noteText, setNoteText] = useState(control.comments || "");
  const [isFocused, setIsFocused] = useState(false);
  const lastSavedValueRef = useRef(control.comments || "");
  const noteTextRef = useRef(noteText);

  const mutation = useUpdateAssessmentItemMutation(assessmentId || "", {
    checklistQueryPrefix: ["assessment-checklist", assessmentId || ""],
    scoreQueryKey: ["assessment-score", assessmentId || ""],
  });

  // Keep noteTextRef in sync for the unmount cleanup closure
  useEffect(() => {
    noteTextRef.current = noteText;
  }, [noteText]);

  // Sync server-side updates ONLY when control.comments or control.itemId changes, and ONLY if the user isn't typing
  useEffect(() => {
    if (!isFocused) {
      setNoteText(control.comments || "");
      lastSavedValueRef.current = control.comments || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control.comments, control.itemId]);

  const triggerAutoSave = useCallback(() => {
    const finalVal = noteTextRef.current.trim();
    const originalVal = (lastSavedValueRef.current || "").trim();

    if (finalVal !== originalVal) {
      lastSavedValueRef.current = finalVal; // Synchronous lock
      mutation.mutate(
        {
          itemId: control.itemId,
          payload: { comments: finalVal === "" ? null : finalVal },
        },
        {
          onError: () => {
            lastSavedValueRef.current = control.comments || "";
          },
        },
      );
    }
  }, [control.itemId, control.comments, mutation]);

  // Auto-save on collapse
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      triggerAutoSave();
    }
    prevOpenRef.current = open;
  }, [open, triggerAutoSave]);

  // Auto-save on unmount (using ref to avoid premature runs on dependency changes)
  const triggerAutoSaveRef = useRef(triggerAutoSave);
  useEffect(() => {
    triggerAutoSaveRef.current = triggerAutoSave;
  }, [triggerAutoSave]);

  useEffect(() => {
    return () => {
      triggerAutoSaveRef.current();
    };
  }, []);

  const saveIfDirty = useCallback(() => {
    const finalVal = noteText.trim();
    const originalVal = (lastSavedValueRef.current || "").trim();

    if (finalVal !== originalVal) {
      lastSavedValueRef.current = finalVal; // Synchronous lock
      mutation.mutate(
        {
          itemId: control.itemId,
          payload: { comments: finalVal === "" ? null : finalVal },
        },
        {
          onError: () => {
            // Revert lock on error
            lastSavedValueRef.current = control.comments || "";
            toast.error("Failed to save note");
          },
          onSuccess: () => {
            toast.success("Note saved successfully");
          },
        },
      );
    }
  }, [noteText, control.itemId, control.comments, mutation]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const isDirty = noteText.trim() !== (lastSavedValueRef.current || "").trim();
    if (isDirty) {
      saveIfDirty();
    } else if (!mutation.isPending) {
      // Sync to capture any server changes that occurred during focus, but ONLY if we aren't currently saving
      setNoteText(control.comments || "");
      lastSavedValueRef.current = control.comments || "";
    }
  }, [noteText, control.comments, saveIfDirty, mutation.isPending]);
  const statusConfig = {
    COMPLIANT: {
      color: "border-green-500",
      icon: <CheckCircle2 className="text-green-600 w-4 h-4" />,
    },
    PARTIALLY_COMPLIANT: {
      color: "border-yellow-400",
      icon: <AlertCircle className="text-yellow-500 w-4 h-4" />,
    },
    NOT_COMPLIANT: {
      color: "border-red-500",
      icon: <XCircle className="text-red-500 w-4 h-4" />,
    },
    NOT_APPLICABLE: {
      color: "border-blue-500",
      icon: <Circle className="text-blue-500 w-4 h-4" />,
    },
    NOT_STARTED: {
      color: "border-gray-300",
      icon: <Circle className="text-gray-400 w-4 h-4" />,
    },
  };

  const severityStyles = {
    CRITICAL: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-blue-100 text-blue-700",
  };

  return (
    <div
      className={`border-l-4 ${
        statusConfig[control.status]?.color
      } bg-white rounded-xl shadow-sm hover:shadow-md 
transition-shadow transition-all duration-200 overflow-visible`}
    >
      {/* HEADER */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${control.id} ${control.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        onClick={() => setOpen(!open)}
        className="p-5 grid grid-cols-[70%_20%_10%] items-center cursor-pointer focus-visible:ring-2
focus-visible:ring-purple-500
focus-visible:ring-offset-2 focus:outline-none"
      >
        {/* LEFT */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {statusConfig[control.status]?.icon}
            <span className="text-xs font-mono text-gray-800">{control.id}</span>
          </div>

          <h4 className="text-sm font-semibold text-gray-900">{control.title}</h4>

          <span className={`text-xs px-2 py-0.5 rounded ${severityStyles[control.severity]}`}>
            {control.severity}
          </span>
        </div>

        {/* MIDDLE */}
        <div
          className="flex justify-center"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <StatusDropdown
            status={control.status}
            disabled={isStatusUpdating}
            onChange={(newStatus) => onStatusChange?.(control.itemId, newStatus)}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">{control.updatedAt}</span>

          <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
            <FileText size={12} />
            {control.evidenceCount}
          </span>

          <button
            aria-label="More actions"
            className="text-gray-500 hover:text-black focus-visible:ring-2
focus-visible:ring-purple-500
focus-visible:ring-offset-2"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* EXPANDED */}
      {open && (
        <div className="border-t border-slate-200 grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 p-5 bg-gray-50">
          {/* LEFT CONTENT */}
          <div className="space-y-5">
            {/* DESCRIPTION */}
            <div>
              <h5 className="text-sm font-semibold mb-1">Description</h5>
              <p className="text-sm text-gray-700 leading-relaxed">{control.description}</p>
            </div>
            {/* CURRENT STATUS*/}
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center gap-2">
                {statusConfig[control.status]?.icon}
                Status: {control.status}
              </p>
              <p>Updated: {control.updatedAt}</p>
              <button
                onClick={() => toast("Feature coming soon")}
                className="text-purple-600 text-xs hover:underline"
              >
                View history →
              </button>
            </div>

            {/* AI REMEDIATION */}
            {control.status === "NOT_COMPLIANT" && (
              <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white p-5 rounded-xl relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-30 text-4xl">✦</div>

                <p className="font-semibold flex items-center gap-2">
                  <Sparkles size={16} /> Need help fixing this?
                </p>

                <p className="text-sm mt-2 opacity-90">
                  {control.description.length > 240
                    ? `${control.description.slice(0, 237).trim()}...`
                    : control.description}
                </p>

                {assessmentId && onOpenRemediation ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRemediation({
                        controlId: control.id,
                        assessmentItemId: control.itemId,
                        controlTitle: control.title,
                        controlDescription: control.description,
                        framework: control.framework,
                        status: control.status,
                        severity: control.severity,
                        assessmentId: assessmentId,
                        userNotes: control.comments,
                      });
                    }}
                    className="mt-4 inline-block bg-white text-purple-700 px-4 py-2 rounded-md text-sm font-medium focus:outline-none
focus:ring-2
focus:ring-purple-500 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Get AI Remediation Plan →
                  </button>
                ) : assessmentId ? (
                  <Link
                    href={`/assessments/${assessmentId}/control-workspace/${control.id}`}
                    className="mt-4 inline-block bg-white text-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Get AI Remediation Plan →
                  </Link>
                ) : (
                  <button className="mt-4 bg-white text-purple-700 px-4 py-2 rounded-md text-sm font-medium">
                    Get AI Remediation Plan →
                  </button>
                )}
              </div>
            )}

            {/* EVIDENCE */}
            <div>
              <div className="flex items-center justify-between mb-3">
                {/* LEFT TITLE */}
                <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  Evidence ({control.evidenceCount})
                </h5>

                {/* RIGHT BUTTON */}
                <button
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Upload size={16} />
                  Upload Evidence
                </button>
              </div>

              <div className="flex gap-3">
                {assessmentId ? (
                  <Link
                    href={`/assessments/${assessmentId}/control-workspace/${control.id}`}
                    className="inline-flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 text-sm text-purple-600 focus:outline-none
focus:ring-2
focus:ring-purple-500 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <FileText size={16} />
                    View workspace
                  </Link>
                ) : (
                  <div className="text-sm text-gray-500">No evidence available</div>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => toast("Feature coming soon")}
                className="border px-3 py-1 rounded text-sm"
              >
                Request Help
              </button>

              <button
                onClick={() => toast("Feature coming soon")}
                className="border px-3 py-1 rounded text-sm"
              >
                Copy Link
              </button>

              {assessmentId && (
                <Link
                  href={`/assessments/${assessmentId}/control-workspace/${control.id}`}
                  className="border border-[#6d18ff] text-[#6d18ff] px-3 py-1 rounded text-sm hover:bg-[#6d18ff]/5 transition-colors focus:outline-none
focus:ring-2
focus:ring-purple-500 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  View Full Workspace →
                </Link>
              )}
            </div>
          </div>
          <div className="space-y-4 w-full min-w-0 max-w-full p-6 bg-slate-50/55 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <h5 className="text-sm font-semibold text-slate-900">Internal Notes</h5>

              {/* React Focus Status Indicators */}
              <div className="flex items-center gap-2 text-xs font-normal">
                {mutation.isPending && (
                  <span className="text-purple-600 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    Saving...
                  </span>
                )}
                {!mutation.isPending && noteText.trim() !== (control.comments || "").trim() && (
                  <span className="text-amber-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Unsaved changes
                  </span>
                )}
                {!mutation.isPending && noteText.trim() === (control.comments || "").trim() && (
                  <span className="text-green-600 flex items-center gap-1 font-medium animate-fade-in">
                    ✓ Saved
                  </span>
                )}
              </div>
            </div>

            <textarea
              placeholder="Add notes, context, or evidence descriptions for this control..."
              rows={6}
              value={noteText}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={handleBlur}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex gap-3 justify-end">
              {noteText.trim() !== (control.comments || "").trim() && (
                <button
                  onClick={() => {
                    setNoteText(control.comments || "");
                    lastSavedValueRef.current = control.comments || "";
                  }}
                  disabled={mutation.isPending}
                  className="px-4 py-2 text-xs border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Discard Changes
                </button>
              )}

              <button
                onClick={saveIfDirty}
                disabled={mutation.isPending || noteText.trim() === (control.comments || "").trim()}
                className="px-4 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition"
              >
                {mutation.isPending ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* MODAL BOX */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-4">
              <h3 id="upload-title" className="text-base font-semibold text-gray-900">
                Upload evidence demonstrating compliance with: {control.title}
              </h3>
              <button
                aria-label="Close upload dialog"
                onClick={() => setUploadOpen(false)}
                className="text-gray-400 hover:text-black transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 pt-0.5"
              >
                ✕
              </button>
            </div>

            {/* FILE INPUT */}
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-700">Control Requirement:</p>
                <div className="max-h-20 overflow-y-auto pr-1 leading-relaxed">
                  {control.description}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-600">Acceptable evidence types:</span>{" "}
                policy documents, audit logs, screenshots of configurations, and system reports.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Drag & drop your file here</p>

              <input
                aria-label="Upload evidence file"
                type="file"
                className="hidden"
                id={`fileUpload-${control.itemId}`}
              />

              <label
                htmlFor={`fileUpload-${control.itemId}`}
                className="cursor-pointer inline-block mt-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Browse files
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUploadOpen(false)}
                className="px-4 py-2 text-sm border rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>

              <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-200 hover:scale-105 active:scale-95">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
