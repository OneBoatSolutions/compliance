"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

export default function RemediationFeedback() {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFeedback = async (value: "yes" | "no") => {
    setSelected(value);
    setLoading(true);

    try {
      // 🔗 API CALL
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          helpful: value === "yes",
          source: "remediation_plan",
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
      
      {/* TEXT */}
      <div>
        <p className="text-sm text-purple-700">
          {submitted
            ? "Thanks for your feedback!"
            : "Was this remediation plan helpful?"}
        </p>
      </div>

      {/* ACTIONS */}
      {!submitted && (
        <div className="flex items-center gap-2">

          <button
            onClick={() => handleFeedback("yes")}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border transition
              ${
                selected === "yes"
                  ? "bg-white border-purple-300 text-purple-700 shadow-sm"
                  : "bg-white/70 hover:bg-white"
              } disabled:opacity-50`}
          >
            <ThumbsUp size={14} />
            Yes
          </button>

          <button
            onClick={() => handleFeedback("no")}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border transition
              ${
                selected === "no"
                  ? "bg-white border-purple-300 text-purple-700 shadow-sm"
                  : "bg-white/70 hover:bg-white"
              } disabled:opacity-50`}
          >
            <ThumbsDown size={14} />
            No
          </button>

        </div>
      )}
    </div>
  );
}
