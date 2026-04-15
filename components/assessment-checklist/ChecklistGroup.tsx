import { type Control, type Status } from "@/app/(user)/assessments/[id]/checklist/types";
import { useState } from "react";
import ControlCard from "./ControlCard";
import { ChevronDown, Plus } from "lucide-react";
interface Props {
  framework: string;
  controls: Control[];
  onStatusChange?: (itemId: string, status: Status) => void;
  updatingItemId?: string | null;
}

export default function ChecklistGroup({
  framework,
  controls,
  onStatusChange,
  updatingItemId,
}: Props) {
  const [open, setOpen] = useState(true);
  const completed = controls.filter((c) => c.status === "COMPLIANT").length;
  const total = controls.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const [globalUploadOpen, setGlobalUploadOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-visible">
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className={`p-4 cursor-pointer flex justify-between items-center transition border-l-4 ${
          open
            ? "bg-purple-50 border-purple-600"
            : "bg-gray-100 border-transparent hover:bg-gray-200"
        }`}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/*  CHEVRON */}
          <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />

          {/* Title + progress text */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {framework} - Administrative Safeguards
            </h3>
            <p className="text-xs text-gray-500">
              ({completed}/{total} completed)
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/*  Mini progress bar */}
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600" style={{ width: `${percent}%` }} />
          </div>

          {/* Score badge */}
          <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">
            {percent}%
          </span>
        </div>
      </div>

      {/* Content */}
      {open && (
        <div className="space-y-3 p-3 bg-gray-50">
          {controls.map((c: Control) => (
            <ControlCard
              key={c.itemId}
              control={c}
              onStatusChange={onStatusChange}
              isStatusUpdating={updatingItemId === c.itemId}
            />
          ))}
        </div>
      )}
      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* Tooltip */}
        <span
          className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap 
    bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 
    group-hover:opacity-100 transition"
        >
          Quick Add Evidence
        </span>

        {/* Button */}
        <button
          onClick={() => setGlobalUploadOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 
    text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          <Plus size={22} />
        </button>
      </div>
      {/* GLOBAL UPLOAD MODAL */}
      {globalUploadOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Quick Add Evidence</h3>
              <button
                onClick={() => setGlobalUploadOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* OPTIONAL: SELECT CONTROL */}
            <select className="w-full border rounded-lg p-2 text-sm">
              <option>Select Control</option>
              {controls.map((c) => (
                <option key={c.id}>
                  {c.id} - {c.title}
                </option>
              ))}
            </select>

            {/* FILE INPUT */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Drag & drop your file here</p>

              <input type="file" className="hidden" id="globalUpload" />

              <label
                htmlFor="globalUpload"
                className="cursor-pointer inline-block mt-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Browse files
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setGlobalUploadOpen(false)}
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
