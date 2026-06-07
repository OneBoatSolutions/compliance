"use client";

import LoadingState from "@/components/framework-selection/LoadingScreen";
import { apiClient } from "@/lib/api-client";
import type { RemediationResponse } from "@/types/ai";
import type { RemediationData, RemediationStepData, RemediationStepStatus } from "@/services/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import RemediationHeader from "./remediation-header";
import RemediationSidebar from "./remediation-sidebar";
import RemediationFooter from "./remediation-footer";
import RemediationTop from "./remediation-topSection";
import PriorityActions from "./remediation-priority-actions";
import PolicyRecommendations from "./policy-recommendations";
import RemediationFeedback from "./remediation-feedback";

interface RemediationDrawerProps {
  open: boolean;
  onClose: () => void;
  controlId: string;
  assessmentItemId: string;
  controlTitle: string;
  controlDescription: string;
  framework: string;
  status: string;
  severity: string;
}

function toRemediationData(
  response: RemediationResponse,
  context: Omit<RemediationData, "steps" | "policies" | "technicalControls" | "title">,
): RemediationData {
  return {
    ...context,
    title: `Remediation plan for ${context.controlTitle}`,
    summary: context.controlDescription,
    steps: response.steps.map((step, index) => ({
      ...step,
      status: "TODO",
      sortOrder: index,
    })),
    policies: response.policies,
    technicalControls: response.technicalControls,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function buildMarkdown(data: RemediationData): string {
  const lines = [
    `# ${data.title}`,
    "",
    `- Framework: ${data.frameworkName}`,
    `- Control: ${data.controlId} - ${data.controlTitle}`,
    `- Current status: ${data.currentStatus}`,
    `- Severity: ${data.severity}`,
    "",
    "## Summary",
    "",
    data.summary || data.controlDescription,
    "",
    "## Priority Actions",
    "",
  ];

  data.steps.forEach((step, index) => {
    lines.push(
      `### ${index + 1}. ${step.title}`,
      "",
      `- Status: ${step.status ?? "TODO"}`,
      `- Priority: ${step.priority}`,
      `- Owner: ${step.owner}`,
      `- Estimated hours: ${step.estimatedHours}`,
      "",
      step.description,
      "",
    );
  });

  lines.push("## Policy Recommendations", "", ...data.policies.map((policy) => `- ${policy}`), "");
  lines.push(
    "## Technical Controls",
    "",
    ...data.technicalControls.map((control) => `- ${control}`),
    "",
  );

  return lines.join("\n");
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function RemediationDrawer({
  open,
  onClose,
  controlId,
  assessmentItemId,
  controlTitle,
  controlDescription,
  framework,
  status,
  severity,
}: RemediationDrawerProps) {
  const [data, setData] = useState<RemediationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingStepIndex, setUpdatingStepIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const context = {
      assessmentItemId,
      controlId,
      controlTitle,
      controlDescription,
      frameworkName: framework,
      currentStatus: status,
      severity,
    };

    const loadPlan = async () => {
      try {
        setLoading(true);
        const savedPlan = await apiClient.get<RemediationData | null>(
          `/api/remediation-plans?assessmentItemId=${encodeURIComponent(assessmentItemId)}`,
        );

        if (cancelled) {
          return;
        }

        if (savedPlan) {
          setData(savedPlan);
          return;
        }

        const generated = await apiClient.post<RemediationResponse>("/api/ai/remediation", {
          body: {
            controlId,
            controlTitle,
            controlDescription,
            frameworkName: framework,
            currentStatus: status,
            severity,
          },
        });

        if (!cancelled) {
          setData(toRemediationData(generated, context));
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load remediation plan");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    controlId,
    assessmentItemId,
    controlTitle,
    controlDescription,
    framework,
    status,
    severity,
  ]);

  if (!open) {
    return null;
  }

  const persistPlan = async (showToast: boolean): Promise<RemediationData | null> => {
    if (!data) {
      return null;
    }

    setSaving(true);
    try {
      const saved = await apiClient.post<RemediationData, RemediationData>(
        "/api/remediation-plans",
        {
          body: data,
        },
      );
      setData(saved);
      if (showToast) {
        toast.success("Plan saved");
      }
      return saved;
    } catch {
      if (showToast) {
        toast.error("Failed to save plan");
      }
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setLoading(true);
    try {
      const generated = await apiClient.post<RemediationResponse>("/api/ai/remediation", {
        body: {
          controlId,
          controlTitle,
          controlDescription,
          frameworkName: framework,
          currentStatus: status,
          severity,
          regenerate: true,
        },
      });

      setData(
        toRemediationData(generated, {
          assessmentItemId,
          controlId,
          controlTitle,
          controlDescription,
          frameworkName: framework,
          currentStatus: status,
          severity,
        }),
      );
      toast.success("Plan regenerated");
    } catch {
      toast.error("Failed to regenerate plan");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleStepStatusChange = async (index: number, nextStatus: RemediationStepStatus) => {
    if (!data) {
      return;
    }

    setUpdatingStepIndex(index);
    try {
      let persisted = data;
      if (!persisted.id || !persisted.steps[index]?.id) {
        const saved = await persistPlan(false);
        if (!saved) {
          toast.error("Save the plan before updating steps");
          return;
        }
        persisted = saved;
      }

      const step = persisted.steps[index];
      if (!persisted.id || !step?.id) {
        toast.error("Unable to update step");
        return;
      }

      const updatedStep = await apiClient.patch<RemediationStepData>(
        `/api/remediation-plans/${persisted.id}/steps/${step.id}`,
        {
          body: {
            status: nextStatus,
          },
        },
      );

      const steps = persisted.steps.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updatedStep } : item,
      );

      setData({
        ...persisted,
        status: steps.every((item) => item.status === "DONE") ? "COMPLETED" : "ACTIVE",
        steps,
      });
    } catch {
      toast.error("Failed to update remediation step");
    } finally {
      setUpdatingStepIndex(null);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    if (!data) {
      return;
    }

    downloadText(
      `remediation-plan-${slugify(data.controlId || data.controlTitle)}.md`,
      buildMarkdown(data),
    );
    toast.success("Markdown exported");
  };

  const isBusy = loading || regenerating || saving;

  return (
    <div className="remediation-print-container fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      <div
        className={`remediation-print-root relative ml-auto h-full w-full md:w-[78%] bg-white shadow-2xl rounded-l-2xl flex flex-col transform transition-all duration-300 ease-in-out ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <RemediationHeader data={data ?? undefined} onClose={onClose} />

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
          {loading || !data ? (
            <LoadingState />
          ) : (
            <>
              <RemediationTop data={data} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <PriorityActions
                    steps={data.steps}
                    onStepStatusChange={handleStepStatusChange}
                    updatingStepIndex={updatingStepIndex}
                  />
                  <PolicyRecommendations policies={data.policies} />
                  <RemediationFeedback />
                </div>

                <div className="space-y-8">
                  <RemediationSidebar data={data} />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t bg-white">
          <RemediationFooter
            onRegenerate={handleRegenerate}
            onSave={() => void persistPlan(true)}
            onExportPdf={handleExportPDF}
            onExportMarkdown={handleExportMarkdown}
            regenerating={regenerating}
            saving={saving}
            disabled={!data || isBusy}
          />
        </div>
      </div>
    </div>
  );
}
