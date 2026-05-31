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

  if (status === "Compliant") {
    message =
      "Great job! This control is fully compliant. If you have any further questions or want to optimize further, I’m here to help.";
    buttonText = "Ask AI";
  } else if (status === "Partially Compliant") {
    message =
      "Some gaps have been identified. I can help you strengthen your implementation and move towards full compliance.";
    buttonText = "Improve Plan";
  } else if (status === "Not Compliant") {
    message =
      "Significant gaps detected. I can generate a remediation plan to help you achieve compliance efficiently.";
    buttonText = "Get Remediation Plan";
  } else {
    message = "Let me assist you with insights and recommendations for this control.";
    buttonText = "Get Guidance";
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
          <p className="text-xs text-white/80">Get AI-powered guidance</p>
        </div>
      </div>

      {/* Dynamic Message */}
      <p className="text-sm text-white/90 leading-relaxed">{message}</p>

      {/* CTA */}
      <Button onClick={onOpenDrawer} className="w-full bg-white text-purple-700 hover:bg-white/90">
        {buttonText}
      </Button>
    </div>
  );
}
