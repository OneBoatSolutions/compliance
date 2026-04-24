"use client";

import { saveControl } from "../../../services/control.services";
import { toast } from "sonner";
import { useState } from "react";
import { AlertTriangleIcon, TriangleAlertIcon } from "lucide-react";
import LeftPanel from "./LeftPanel";
import RightSidebar from "./RightSidebar";
import FooterNav from "./FooterNav";
import ProgressSection from "./ProgressSection";
import TagsInput from "./TagsInput";
import EvidenceUploader from "./EvidenceUploader";
import { AssigneeDueDate } from "./AssigneeDueDate";
import WorkspaceHeader from "./WorkspaceHeader";
import { Save, Sparkles, X } from "lucide-react";
import RemediationDrawer from "@/components/ai/remediation-drawer";
import AIAssistantCard from "./AIAssisstentCard";

export default function ControlWorkspace({ control }: any) {
  const assessmentId = control?.assessmentId;
  const itemId = control?.id;
  // ✅ Status comes from AI (editable by user)
  const [status, setStatus] = useState(
    control?.status || "Partially Compliant"
  );

  // ✅ Gap details prefilled by AI
  const [comments, setComments] = useState(
    control?.aiGapDetails || ""
  );
  

  
  const [openAI, setOpenAI] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [assignee, setAssignee] = useState("");
  const [isSaving, setIsSaving] = useState(false);

// for cancel/reset
const [initialState] = useState({
  status: control?.status || "Partially Compliant",
  comments: control?.aiGapDetails || "",
  files: [],
  assignee: "",
  dueDate: "",
});
const [score, setScore] = useState<number | null>(control?.score ?? 60 );
  const [dueDate, setDueDate] = useState("");

  const handleSave = async (type = "final") => {
  setIsSaving(true);
  

  const payload = {
    status,
    comments,
    evidence: files,
    assignee,
    dueDate,
    saveType: type,
  }; 
   
  
    try {
    const res= await saveControl(assessmentId, itemId, payload);
    if (res?.status) {
  setStatus(res.status);
}

// (optional for future)
if (res?.score) {
  //console.log("Updated score:", res.score);
}
 if (res?.score !== undefined) {
  setScore(res.score);
}

    toast.success("Saved successfully");
  } catch {
    toast.error("Failed to save");

    // rollback (basic)
    setStatus(initialState.status);
    setComments(initialState.comments);
  } finally {
    setIsSaving(false);
  }
  
 
};

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <WorkspaceHeader />
        <ProgressSection score = { score }  />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">

          {/* 🔹 Status + Gap Details (AI + Editable) */}
          <div className="bg-card border rounded-xl p-5 space-y-6">
            {/* ACTIONS */}
              {/* ACTIONS */}
<div className="flex justify-between items-center pt-4 border-t">

  {/* LEFT: Cancel */}
  <button
    onClick={() => {
      setStatus(initialState.status);
      setComments(initialState.comments);
      setFiles(initialState.files);
      setAssignee(initialState.assignee);
      setDueDate(initialState.dueDate);
    }}
    className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md 
               hover:bg-gray-100 transition"
  >
    <X size={16} />
    Cancel
  </button>

  {/* RIGHT: Actions */}
  <div className="flex items-center gap-2">

    

    <button
      onClick={() => handleSave()}
      disabled={isSaving}
      className="flex items-center gap-2 px-3 py-1.5 text-sm 
                 bg-black text-white rounded-md 
                 hover:bg-gray-800 hover:shadow-md 
                 transition disabled:opacity-50"
    >
      <Save size={16} />
      {isSaving ? "Saving..." : "Save"}
    </button>

  </div>
</div>


            {/* STATUS PANEL */}
            <LeftPanel
              status={status}
              setStatus={setStatus}
              comments={comments}
              setComments={setComments}
              control={control}
            />
             

            {/* ✨ AI GAP DETAILS CONTEXT */}
            {/* 🔴 AI GAP INSIGHT (RED BLOCK) */}
<div className="bg-red-50 border border-red-200 border-l-4 border-l-red-400 rounded-lg p-4 space-y-3">

  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
  <AlertTriangleIcon className="text-red-600" size={16} />
  <p className="text-sm font-medium text-red-700">
    AI Detected Compliance Gaps
  </p>
</div>

    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
      Confidence: {control?.aiConfidence || 80}%
    </span>
  </div>

  {/* Summary */}
  <p className="text-sm text-gray-700">
    {control?.aiSummary || "AI has detected compliance gaps in access control implementation."}
  </p>

  {/* Issues */}
  <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
    {(control?.aiIssues || [
      "No MFA enforcement",
      "Missing RBAC",
      "Audit logs not configured"
    ]).map((issue: string, i: number) => (
      <li key={i}>{issue}</li>
    ))}
  </ul>

</div>

          </div>

          {/* 🔹 Evidence + Metadata */}
          <div className="bg-card border rounded-xl p-5 space-y-6">
           

            <EvidenceUploader files={files} setFiles={setFiles} />

            <AssigneeDueDate
              assignee={assignee}
              setAssignee={setAssignee}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />

            <TagsInput />

          </div>

        </div>

        {/* RIGHT SIDE */}
        <RightSidebar status={status}
        onOpenRemediation={() => setOpenAI(true)} />

      </div>

      <FooterNav onSave={handleSave} />
      <RemediationDrawer
          open={openAI}
          onClose={() => setOpenAI(false)}
          data={control}
      />
    </div>
  );
}
