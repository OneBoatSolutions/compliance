"use client";

import LoadingState from "@/components/framework-selection/LoadingScreen";
import type { ExistingFile } from "@/components/user/evidence-uploader";
import { requestRemediation } from "@/lib/ai-api";
import { apiClient } from "@/lib/api-client";
import type { GenerateRemediationInput, RemediationResponse } from "@/types/ai";
import type { RemediationData, RemediationStepData, RemediationStepStatus } from "@/services/types";
import { useCallback, useEffect, useState } from "react";
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
  assessmentId: string;
  controlTitle: string;
  controlDescription: string;
  framework: string;
  status: string;
  severity: string;
  userNotes?: string;
}

interface EvidenceResponse {
  evidence: ExistingFile[];
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
    // Pass through optional enriched fields from the AI response
    businessFit: response.businessFit,
    evidenceValidation: response.evidenceValidation,
    confidence: response.confidence,
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

function formatEvidenceMetadata(files: ExistingFile[]): string[] {
  return files.map((file) => {
    const parts = [
      file.originalName,
      `type: ${file.mimeType}`,
      `size: ${file.fileSize} bytes`,
      `uploaded: ${new Date(file.uploadedAt).toISOString()}`,
      file.description?.trim() ? `note: ${file.description.trim()}` : null,
    ].filter((value): value is string => Boolean(value));

    return parts.join(" | ");
  });
}

export default function RemediationDrawer({
  open,
  onClose,
  controlId,
  assessmentItemId,
  assessmentId,
  controlTitle,
  controlDescription,
  framework,
  status,
  severity,
  userNotes,
}: RemediationDrawerProps) {
  const [data, setData] = useState<RemediationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [updatingStepIndex, setUpdatingStepIndex] = useState<number | null>(null);
  const [evidenceMetadata, setEvidenceMetadata] = useState<string[]>([]);

  const buildRemediationRequest = useCallback(
    (metadata: string[]): GenerateRemediationInput => ({
      controlId,
      controlTitle,
      controlDescription,
      frameworkName: framework,
      currentStatus: status,
      severity,
      assessmentId,
      userNotes: userNotes?.trim() ? userNotes.trim() : undefined,
      uploadedEvidenceFiles: metadata.length > 0 ? metadata : undefined,
    }),
    [
      assessmentId,
      controlDescription,
      controlId,
      controlTitle,
      framework,
      severity,
      status,
      userNotes,
    ],
  );

  // useEffect for the background page scrollbar//
  useEffect(() => {
    if (!open) {
      return;
    }

    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

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
        const [savedPlan, evidenceResponse] = await Promise.all([
          apiClient.get<RemediationData | null>(
            `/api/remediation-plans?assessmentItemId=${encodeURIComponent(assessmentItemId)}`,
          ),
          apiClient
            .get<EvidenceResponse>(
              `/api/assessments/${encodeURIComponent(assessmentId)}/items/${encodeURIComponent(
                assessmentItemId,
              )}`,
            )
            .catch(() => ({ evidence: [] as ExistingFile[] })),
        ]);

        const metadata = formatEvidenceMetadata(evidenceResponse?.evidence ?? []);
        setEvidenceMetadata(metadata);

        if (cancelled) {
          return;
        }

        if (savedPlan) {
          setData(savedPlan);
          return;
        }

        const generated = await requestRemediation(buildRemediationRequest(metadata));

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
    assessmentId,
    controlTitle,
    controlDescription,
    framework,
    status,
    severity,
    userNotes,
    buildRemediationRequest,
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
      const cleanPayload = {
        assessmentItemId: data.assessmentItemId,
        controlId: data.controlId,
        controlTitle: data.controlTitle,
        controlDescription: data.controlDescription,
        frameworkName: data.frameworkName,
        currentStatus: data.currentStatus,
        severity: data.severity,
        title: data.title ?? `Remediation plan for ${data.controlTitle}`,
        summary: data.summary ?? data.controlDescription,
        steps: data.steps.map((step) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          priority: step.priority,
          owner: step.owner,
          estimatedHours: step.estimatedHours,
          status: step.status,
        })),
        policies: data.policies ?? [],
        technicalControls: data.technicalControls ?? [],
      };

      const saved = await apiClient.post<RemediationData, typeof cleanPayload>(
        "/api/remediation-plans",
        {
          body: cleanPayload,
        },
      );
      setData(saved);
      if (showToast) {
        toast.success("Plan saved");
      }
      return saved;
    } catch (err) {
      console.error("Failed to save remediation plan:", err);
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
      const generated = await requestRemediation({
        ...buildRemediationRequest(evidenceMetadata),
        regenerate: true,
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

  const handleExportPDF = async () => {
    setExportingPdf(true);
    const toastId = toast.loading("Generating compliance report PDF...");
    try {
      const response = await apiClient.post<{ success: boolean; fileUrl: string }, never>(
        `/api/reports/${assessmentId}/generate`,
      );

      if (response && response.fileUrl) {
        toast.success("PDF report generated successfully!", { id: toastId });
        window.open(response.fileUrl, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("Missing fileUrl in API response");
      }
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      toast.error("Failed to generate PDF report", { id: toastId });
    } finally {
      setExportingPdf(false);
    }
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

  const isBusy = loading || regenerating || saving || exportingPdf;

  return (
    <div className="remediation-print-container fixed inset-0 z-50 flex overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      <div
        className={`remediation-print-root relative ml-auto h-full w-full md:w-[78%] bg-white shadow-2xl rounded-l-2xl flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <RemediationHeader data={data ?? undefined} onClose={onClose} />

        <div className=" min-h-0 flex-1 overflow-y-auto px-8 py-8 space-y-8">
          {loading || !data ? (
            <LoadingState />
          ) : data.steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-lg font-semibold text-slate-700">
                {" "}
                No remediation actions generated
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                The AI could not generate remediation steps for this control.Try regenerating the
                plan.
              </p>
            </div>
          ) : (
            <>
              <RemediationTop data={data} />

              {/* Business Fit & Confidence */}
              {data.businessFit && (
                <div className="bg-card border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        data.businessFit.applicability === "APPLICABLE"
                          ? "bg-green-100 text-green-700"
                          : data.businessFit.applicability === "NOT_APPLICABLE"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {data.businessFit.applicability.replaceAll("_", " ")}
                    </span>
                    {data.confidence !== undefined && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        Confidence: {data.confidence}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{data.businessFit.rationale}</p>
                </div>
              )}

              {/* Evidence Health */}
              {data.evidenceValidation && (
                <div className="bg-card border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        data.evidenceValidation.overallHealth === "SUFFICIENT"
                          ? "bg-green-100 text-green-700"
                          : data.evidenceValidation.overallHealth === "MISSING"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Evidence: {data.evidenceValidation.overallHealth.replaceAll("_", " ")}
                    </span>
                  </div>
                  {data.evidenceValidation.missingTypes.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Missing: {data.evidenceValidation.missingTypes.join(", ")}
                    </p>
                  )}
                  {data.evidenceValidation.recommendations.length > 0 && (
                    <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
                      {data.evidenceValidation.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

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
