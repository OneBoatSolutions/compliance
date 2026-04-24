"use client";

import { X } from "lucide-react";
import RemediationHeader from "./remediation-header";
import RemediationSummary from "./remediation-summary";
import RemediationActions from "./remediation-p-actions";
import RemediationSidebar from "./remediation-sidebar";
import LoadingState from "@/components/framework-selection/LoadingScreen";
import { useState, useEffect } from "react";
import RemediationFooter from "./remediation-footer";
import { RemediationData } from "@/services/types";
import RemediationTop from "./remediation-topSection";
import PriorityActions from "./remediation-priority-actions";
import PolicyRecommendations from "./policy-recommendations";
import RemediationFeedback from "./remediation-feedback";

export default function RemediationDrawer({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: RemediationData;
}) {
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  useEffect(() => {
    if (open) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 1500); // simulate AI delay
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const safeData = data || {};

  const handleRegenerate = async () => {
    setRegenerating(true); // start spinner
    setLoading(true); // show loading screen

    setTimeout(() => {
      setLoading(false);
      setRegenerating(false); // stop spinner
    }, 1500);
  };

  const handleSavePlan = async () => {
    try {
      console.log("Saving remediation plan...");
      // later → API call

      alert("Plan saved successfully");
    } catch {
      alert("Failed to save plan");
    }
  };

  const handleExportPDF = () => {
    const blob = new Blob(["AI Remediation Plan\n\n(This will be real data later)"], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "remediation-plan.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
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
                  <PriorityActions data={data} />
                  <PolicyRecommendations data={data} />
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
