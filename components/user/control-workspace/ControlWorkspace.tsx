"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import LeftPanel from "./LeftPanel";
import RightSidebar from "./RightSidebar";
import FooterNav from "./FooterNav";
import ProgressSection from "./ProgressSection";
import { AssigneeDueDate } from "./AssigneeDueDate";
import WorkspaceHeader from "./WorkspaceHeader";
import { apiClient, ApiClientError } from "@/lib/api-client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExistingFile } from "@/components/user/evidence-uploader";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const EvidenceUploader = dynamic(() => import("@/components/user/evidence-uploader"), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full rounded-xl" />,
});

interface ControlData {
  id: string; // The database control ID for API calls
  code: string; // The visual code like GDPR-D1.0
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

type AssessmentItemStatus =
  | "NOT_STARTED"
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NOT_COMPLIANT"
  | "NOT_APPLICABLE";

interface Props {
  control: ControlData;
}

export default function ControlWorkspace({ control }: Props) {
  const [status, setStatus] = useState<AssessmentItemStatus>(
    (control?.status as AssessmentItemStatus) || "NOT_STARTED",
  );
  const router = useRouter();
  const [comments, setComments] = useState(control?.comments || "");
  const [assignee, setAssignee] = useState(control?.owner || "");
  const [dueDate, setDueDate] = useState(control?.targetDate || "");
  const [isSaving, setIsSaving] = useState(false);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
  const [sectionProgress, setSectionProgress] = useState({
    total: 0,
    compliant: 0,
    partiallyCompliant: 0,
    nonCompliant: 0,
    notStarted: 0,
  });

  useEffect(() => {
    if (!control?.assessmentId || !control?.itemId) {
      return;
    }

    const fetchAssessmentItem = async () => {
      try {
        const response = await apiClient.get<{
          status: AssessmentItemStatus;
          comments: string | null;
          owner: string | null;
          targetDate: string | null;
        }>(`/api/assessments/${control.assessmentId}/items/${control.itemId}`);

        setStatus(response.status);
        setComments(response.comments || "");
        setAssignee(response.owner || "");
        setDueDate(response.targetDate?.slice(0, 10) || "");
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEvidence = async () => {
      try {
        const response = await apiClient.get<{ evidence: ExistingFile[] }>(
          `/api/assessments/${control.assessmentId}/items/${control.itemId}`,
        );
        setExistingFiles(response.evidence ?? []);
      } catch (error) {
        console.error("Failed to fetch existing evidence", error);
      }
    };

    const fetchProgress = async () => {
      try {
        const data = await apiClient.get<{
          total: number;
          compliant: number;
          partiallyCompliant: number;
          nonCompliant: number;
          notStarted: number;
        }>(`/api/assessments/${control.assessmentId}/section-progress?controlId=${control.id}`);
        if (data) {
          setSectionProgress(data);
        }
      } catch (error) {
        console.error("Failed to fetch section progress", error);
      }
    };
    fetchAssessmentItem();
    fetchEvidence();
    fetchProgress();
  }, [control?.assessmentId, control?.itemId, control?.id]);

  const handleSave = async (type: "draft" | "final" = "final"): Promise<boolean> => {
    if (!control?.assessmentId || !control?.itemId) {
      toast.error("Missing assessment or item reference");
      return false;
    }

    setIsSaving(true);

    try {
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
        if (dueDate) {
          const parsedDate = new Date(dueDate);
          if (isNaN(parsedDate.getTime())) {
            payload.targetDate = null;
          } else {
            payload.targetDate = parsedDate.toISOString();
          }
        } else {
          payload.targetDate = null;
        }
      }

      // Ensure at least one field is being updated
      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return true;
      }

      await apiClient.patch<{ score: number }>(
        `/api/assessments/${control.assessmentId}/items/${control.itemId}`,
        { body: payload },
      );

      toast.success(type === "draft" ? "Draft saved" : "Changes saved successfully");
      return true;
    } catch (err) {
      if (err instanceof ApiClientError && err.isUnauthorized) {
        toast.error("Session expired. Please refresh and log in again.");
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const { data: assessmentItems } = useQuery({
    queryKey: ["assessment-controls", control.assessmentId],
    queryFn: () =>
      apiClient.get<{
        items: {
          id: string;
          control: {
            code: string;
          };
        }[];
      }>(`/api/assessments/${control.assessmentId}/items?limit=100`),
    enabled: !!control.assessmentId,
  });

  const controls = assessmentItems?.items ?? [];

  const currentIndex = controls.findIndex((item) => item.control.code === control.code);

  const previousControl = currentIndex > 0 ? controls[currentIndex - 1] : null;

  const nextControl =
    currentIndex >= 0 && currentIndex < controls.length - 1 ? controls[currentIndex + 1] : null;

  const handlePreviousControl = () => {
    if (!previousControl) {
      return;
    }

    router.push(
      `/assessments/${control.assessmentId}/control-workspace/${previousControl.control.code}`,
    );
  };
  const handleNextControl = async () => {
    const saveSuccess = await handleSave("final");
    if (!saveSuccess) {
      return;
    }

    if (!nextControl) {
      router.push(`/assessments/${control.assessmentId}/checklist`);
      return;
    }

    router.push(
      `/assessments/${control.assessmentId}/control-workspace/${nextControl.control.code}`,
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/80 via-purple-50/30 to-white
                      p-6 md:p-8"
      >
        <WorkspaceHeader control={control} />
        <ProgressSection {...sectionProgress} />
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
            onSave={() => handleSave("final")}
            isSaving={isSaving}
          />

          <div className="bg-white shadow-sm border rounded-xl p-5 space-y-6">
            <div>
              <EvidenceUploader assessmentItemId={control.itemId} existingFiles={existingFiles} />
            </div>

            <AssigneeDueDate
              assignee={assignee}
              setAssignee={setAssignee}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <RightSidebar control={control} status={status} />
      </div>

      <FooterNav
        onSave={handleSave}
        isSaving={isSaving}
        onPrevious={handlePreviousControl}
        onNext={handleNextControl}
        hasPrevious={!!previousControl}
        hasNext={!!nextControl}
      />
    </div>
  );
}
