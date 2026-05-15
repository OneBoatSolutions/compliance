"use client";

import RemediationHeader from "./remediation-header";
import RemediationSidebar from "./remediation-sidebar";
import LoadingState from "@/components/framework-selection/LoadingScreen";
import { useState, useEffect } from "react";
import RemediationFooter from "./remediation-footer";
import { RemediationData } from "@/services/types";
import RemediationTop from "./remediation-topSection";
import PriorityActions from "./remediation-priority-actions";
import PolicyRecommendations from "./policy-recommendations";
import RemediationFeedback from "./remediation-feedback";

import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

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
  useEffect(() => {
    if (open) {
      const fetchRemediation = async () => {
        try {
          setLoading(true);
          const response = await apiClient.post<RemediationData>("/api/ai/remediation", {
            body: {
              controlId,
              controlTitle,
              controlDescription,
              frameworkName: framework,
              currentStatus: status,
              severity,
            },
          });
          setData(response);
        } catch {
          toast.error("Failed to generate remediation plan");
        } finally {
          setLoading(false);
        }
      };

      fetchRemediation();
    }
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

  const safeData = data || ({} as RemediationData);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      setLoading(true);
      const response = await apiClient.post<RemediationData>("/api/ai/remediation", {
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
      setData(response);
      toast.success("Plan regenerated");
    } catch {
      toast.error("Failed to regenerate plan");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleSavePlan = async () => {
    try {
      if (!data) {
        return;
      }
      await apiClient.post("/api/ai/remediation/save", { body: data });
      toast.success("Plan saved");
    } catch {
      toast.error("Failed to save plan");
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await apiClient.getBlob(`/api/ai/remediation/${assessmentItemId}/export`);

      // If the backend returned JSON { url } it would fail as blob or we can just try to see if it's JSON
      if (response.type.includes("application/json")) {
        const text = await response.text();
        const data = JSON.parse(text);
        if (data.url) {
          window.open(data.url, "_blank");
          return;
        }
      }

      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = `remediation-plan-${controlId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.info("Preparing document for printing...");
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* PANEL */}
      <div
        className={`
        relative ml-auto h-full w-full md:w-[78%] bg-white shadow-2xl rounded-l-2xl flex flex-col
        transform transition-all duration-300 ease-in-out
        ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
      >
        {/* HEADER */}
        <RemediationHeader data={safeData} onClose={onClose} />
        {/*  SINGLE SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TOP FULL WIDTH */}
          <RemediationTop data={safeData} />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <LoadingState />
              ) : (
                <>
                  <PriorityActions data={safeData} />
                  <PolicyRecommendations data={safeData} />
                  <RemediationFeedback />
                </>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              <RemediationSidebar />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-white">
          <RemediationFooter
            onRegenerate={handleRegenerate}
            onSave={handleSavePlan}
            onExport={handleExportPDF}
            regenerating={regenerating}
          />
        </div>
      </div>
    </div>
  );
}
