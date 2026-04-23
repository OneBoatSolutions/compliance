"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ Props type
type Props = {
  status: string;
  onOpenRemediation: () => void;
};

export default function AIAssistantCard({
  status,
  onOpenRemediation,
}: Props) {
  let message = "";
  let buttonText = "";
  let showButton = false;

  // 🧠 Dynamic logic
  if (status === "Compliant") {
    message =
      "This control is fully compliant. You're all set — no further action needed.";
    showButton = false;
  } else if (status === "Partially Compliant") {
    message =
      "Some gaps have been identified. I can help you strengthen your implementation and move towards full compliance.";
    buttonText = "Improve Plan";
    showButton = true;
  } else if (status === "Not Compliant") {
    message =
      "Significant gaps detected. I can generate a remediation plan to help you achieve compliance efficiently.";
    buttonText = "Get Remediation Plan";
    showButton = true;
  } else {
    message =
      "This control is not applicable for your current setup.";
    showButton = false;
  }

  return (
    <div
      className="rounded-xl p-5 text-white shadow-lg 
      bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-2 rounded-md">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="font-semibold">AI Assistant</p>
          <p className="text-xs text-white/80">
            Get AI-powered guidance
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-white/90 leading-relaxed">
        {message}
      </p>

      {/* ✅ Conditional CTA */}
      {showButton && (
        <Button
          onClick={onOpenRemediation}
          className="w-full bg-white text-purple-700 hover:bg-white/90"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
