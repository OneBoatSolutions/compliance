"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantCardProps {
  status: string;
  onOpenDrawer?: () => void;
}

export default function AIAssistantCard({ status, onOpenDrawer }: AIAssistantCardProps) {
  // 🧠 Dynamic content
  let message = "";
  let buttonText = "";

  if (status === "Compliant" || status === "COMPLIANT") {
    message =
      "Great job! This control is fully compliant. If you have any further questions or want to optimize further, I’m here to help.";
    buttonText = "Ask AI";
  } else if (status === "Partially Compliant" || status === "PARTIALLY_COMPLIANT") {
    message =
      "Some gaps have been identified. I can help you strengthen your implementation and move towards full compliance.";
    buttonText = "Improve Plan";
  } else if (status === "Not Compliant" || status === "NOT_COMPLIANT") {
    message =
      "Significant gaps detected. I can generate a remediation plan to help you achieve compliance efficiently.";
    buttonText = "Get Remediation Plan";
  } else {
    message = "Let me assist you with insights and recommendations for this control.";
    buttonText = "Get Guidance";
  }

  return (
    <div
      className="
      relative overflow-hidden
      rounded-2xl p-5 text-white shadow-lg
      bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500
    "
    >
      {/* Decorative Glow */}
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="bg-white/20 p-2 rounded-lg">
          <Sparkles size={18} />
        </div>

        <div>
          <p className="font-semibold">AI Assistant</p>
          <p className="text-xs text-white/80">AI-powered compliance guidance</p>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4 relative z-10">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            status === "COMPLIANT"
              ? "bg-green-500/20 text-green-100"
              : status === "PARTIALLY_COMPLIANT"
                ? "bg-yellow-500/20 text-yellow-100"
                : status === "NOT_COMPLIANT"
                  ? "bg-red-500/20 text-red-100"
                  : "bg-white/20 text-white"
          }`}
        >
          {status.replaceAll("_", " ")}
        </span>
      </div>

      {/* Insight */}
      <div className="mb-4 relative z-10">
        <p className="text-sm font-medium text-white">
          {status === "COMPLIANT"
            ? "Control implementation appears complete."
            : status === "PARTIALLY_COMPLIANT"
              ? "Implementation gaps detected."
              : status === "NOT_COMPLIANT"
                ? "Immediate remediation recommended."
                : "Assessment required."}
        </p>
      </div>

      {/* Message */}
      <p className="text-sm text-white/90 leading-relaxed mb-5 relative z-10">{message}</p>

      {/* CTA */}
      <Button
        aria-label="Open AI remediation assistant"
        onClick={onOpenDrawer}
        className="
        relative z-10
        w-full
        bg-white
        text-purple-700
        font-medium
        hover:bg-white
        hover:shadow-md
        transition-all
      "
      >
        {buttonText}
      </Button>
    </div>
  );
}
