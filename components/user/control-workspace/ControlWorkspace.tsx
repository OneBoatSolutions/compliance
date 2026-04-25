"use client";

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

interface ControlData {
  id: string;
  itemId: string;
  framework: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  weight: number;
  assessmentId: string;
  comments: string | null;
  owner: string | null;
  targetDate: string | null;
}

interface Props {
  control: ControlData;
}

export default function ControlWorkspace({ control }: Props) {
  const [status, setStatus] = useState(control?.status || "NOT_STARTED");
  const [comments, setComments] = useState(control?.comments || "");
  const [files, setFiles] = useState<unknown[]>([]);
  const [assignee, setAssignee] = useState(control?.owner || "");
  const [dueDate, setDueDate] = useState(control?.targetDate || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (type = "final") => {
    if (!control?.assessmentId || !control?.itemId) {
      toast.error("Missing assessment or item reference");
      return;
    }

    setIsSaving(true);

    const payload: Record<string, unknown> = {};

    // Only include changed fields
    if (status !== control.status) {
      payload.status = status;
    }
    if (comments !== (control.comments || "")) {
      payload.comments = comments || null;
    }
    if (assignee !== (control.owner || "")) {
      payload.owner = assignee || null;
    }
    if (dueDate !== (control.targetDate || "")) {
      payload.targetDate = dueDate ? new Date(dueDate).toISOString() : null;
    }

    // Ensure at least one field is being updated
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/assessments/${control.assessmentId}/items/${control.itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save");
      }

      toast.success(type === "draft" ? "Draft saved" : "Changes saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <WorkspaceHeader control={control} />
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

          <div className="bg-white shadow-sm border rounded-xl p-5 space-y-6">
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

      <FooterNav onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
