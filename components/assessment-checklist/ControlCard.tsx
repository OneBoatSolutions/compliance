"use client";

import { Control, type Status } from "@/app/(user)/assessments/[id]/checklist/types";
import { useState } from "react";
import Link from "next/link";
import StatusDropdown from "./StatusDropdown";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  XCircle,
  FileText,
  MoreVertical,
  Sparkles,
  Plus,
  Upload,
  User,
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
  const [commentsOpen, setCommentsOpen] = useState(true);
  const isOwn = true; // later from backend (user auth)
  const [uploadOpen, setUploadOpen] = useState(false);

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
      } bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-visible`}
    >
      {/* HEADER */}
      <div
        onClick={() => setOpen(!open)}
        className="p-5 grid grid-cols-[70%_20%_10%] items-center cursor-pointer"
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
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
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

          <button className="text-gray-500 hover:text-black">
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
              <button className="text-purple-600 text-xs hover:underline">View history →</button>
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
                      });
                    }}
                    className="mt-4 inline-block bg-white text-purple-700 px-4 py-2 rounded-md text-sm font-medium"
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
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition"
                >
                  <Upload size={16} />
                  Upload Evidence
                </button>
              </div>

              <div className="flex gap-3">
                {assessmentId ? (
                  <Link
                    href={`/assessments/${assessmentId}/control-workspace/${control.id}`}
                    className="inline-flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 text-sm text-purple-600"
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
              {control.status !== "COMPLIANT" && (
                <button
                  disabled={isStatusUpdating}
                  onClick={() => onStatusChange?.(control.itemId, "COMPLIANT")}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Mark as Compliant
                </button>
              )}

              <button className="border px-3 py-1 rounded text-sm">Request Help</button>

              <button className="border px-3 py-1 rounded text-sm">Copy Link</button>

              {assessmentId && (
                <Link
                  href={`/assessments/${assessmentId}/control-workspace/${control.id}`}
                  className="border border-[#6d18ff] text-[#6d18ff] px-3 py-1 rounded text-sm hover:bg-[#6d18ff]/5 transition-colors"
                >
                  View Full Workspace →
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="space-y-5 w-full min-w-0 max-w-full p-6">
            <h5
              onClick={() => setCommentsOpen(!commentsOpen)}
              className="text-sm font-semibold cursor-pointer flex justify-between items-center"
            >
              Comments (2)
              <span>{commentsOpen ? "−" : "+"}</span>
            </h5>

            {/* COMMENTS LIST */}
            {commentsOpen && (
              <div className="space-y-4">
                {/* Comment 1 */}
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                    <User size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Sarah</p>
                        <span className="text-xs text-gray-400">1h ago</span>
                      </div>

                      {/* ✅ ADD THIS */}
                      {isOwn && (
                        <div className="flex gap-2 text-xs text-gray-400">
                          <button className="hover:text-black">Edit</button>
                          <button className="text-red-500 hover:text-red-600">Delete</button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      Starting the risk assessment. I&apos;ll need input from the DevOps team
                      regarding infrastructure exposure.
                    </p>
                  </div>
                </div>

                {/* Comment 2 */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-sm font-medium">
                    <User size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">You</p>
                        <span className="text-xs text-gray-400">1h ago</span>
                      </div>

                      {/* ✅ ADD THIS */}
                      {isOwn && (
                        <div className="flex gap-2 text-xs text-gray-400">
                          <button className="hover:text-black">Edit</button>
                          <button className="text-red-500 hover:text-red-600">Delete</button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">
                      Uploaded the draft template for review. Let&apos;s aim to complete this by
                      Friday.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DIVIDER */}
            <div className="border-t border-slate-200 " />

            {/* ADD COMMENT */}
            <div className="relative w-full">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                className="w-full border border-slate-200 bg-white rounded-xl p-4 pr-14 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* FLOATING BUTTON (CORRECT POSITION) */}
              <button className="absolute right-3 bottom-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg">
                <Plus size={18} />
              </button>
            </div>

            {/* POST BUTTON */}
            <button className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition">
              Post Comment
            </button>
          </div>
        </div>
      )}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* MODAL BOX */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Upload Evidence</h3>
              <button
                onClick={() => setUploadOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* FILE INPUT */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Drag & drop your file here</p>

              <input type="file" className="hidden" id="fileUpload" />

              <label
                htmlFor="fileUpload"
                className="cursor-pointer inline-block mt-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Browse files
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUploadOpen(false)}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>

              <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
