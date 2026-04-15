"use client";

import { saveControl } from "../../../services/control.services";
import { toast } from "sonner";
import { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightSidebar from "./RightSidebar";
import FooterNav from "./FooterNav";
import ProgressSection from "./ProgressSection";
import TagsInput from "./TagsInput";
import EvidenceUploader from "./EvidenceUploader";
import { AssigneeDueDate } from "./AssigneeDueDate";
import WorkspaceHeader from "./WorkspaceHeader";

export default function ControlWorkspace({ control }: any) {
  const [status, setStatus] = useState(control?.status || "Partially Compliant");
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSave = async (type = "final") => {
    const payload = {
      status,
      comments,
      evidence: files,
      assignee,
      dueDate,
      saveType: type,
    };

    try {
      await saveControl(payload);
      toast.success("Saved successfully");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <WorkspaceHeader />
        <ProgressSection />
      </div>

      {/* Layout */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* LEFT SIDE */}
  <div className="col-span-2 space-y-6">

    <LeftPanel
      status={status}
      setStatus={setStatus}
      comments={comments}
      setComments={setComments}
      control={control}
    />

    <div className="bg-card border rounded-xl p-5 space-y-6">

      <div>
        
        <EvidenceUploader files={files} setFiles={setFiles} />
      </div>

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
  <RightSidebar status={status} />

</div>

      <FooterNav onSave={handleSave} />
    </div>
  );
}
