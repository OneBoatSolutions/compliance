"use client";

import { useEffect, useState } from "react";

// UI Sections
import HeaderCard from "./header-card";
import PriorityActions from "./priority-actions";
import RecommendedTools from "./recommended-tools";
import Timeline from "./timeline";
import CostSummary from "./cost-summary";
import FeedbackBar from "./remediation-feedback";
import RemediationActions from "./remediation-actions";
import PolicySection from "./policy-section";
import AiLoader from "./ai-loader";

// Types
interface Step {
  id: number;
  title: string;
  description: string[];
  owner: string;
  hours: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface Props {
  status: string;
}

export default function RemediationPlan({ status }: Props) {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);

  // 🚀 Fetch / simulate AI data
  useEffect(() => {
    // ❌ Do not run if compliant
    if (status === "Compliant" || status === "Not Applicable") {
      return;
    }

    setLoading(true);

    // 🔁 Simulated API call
    setTimeout(() => {
      setSteps([
        {
          id: 1,
          title: "Implement Role-Based Access Control (RBAC)",
          description: [
            "Define organizational roles and permissions",
            "Map users to roles",
            "Audit access logs",
          ],
          owner: "IT Security Team",
          hours: 40,
          priority: "HIGH",
        },
        {
          id: 2,
          title: "Enable Multi-Factor Authentication (MFA)",
          description: ["Integrate MFA provider", "Enforce MFA for all users"],
          owner: "SysAdmin",
          hours: 16,
          priority: "HIGH",
        },
        {
          id: 3,
          title: "Enable Cloud Monitoring",
          description: ["Set up logging", "Configure alerts"],
          owner: "DevOps",
          hours: 24,
          priority: "MEDIUM",
        },
      ]);

      setLoading(false);
    }, 1200);
  }, [status]);

  // ❌ Hide component for compliant states
  if (status === "Compliant" || status === "Not Applicable") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 🧠 AI Header */}
      <div>
        <h2 className="text-lg font-semibold">AI Remediation Plan</h2>
        <p className="text-sm text-muted-foreground">
          Actionable steps to achieve compliance for this control
        </p>
      </div>

      {/* 🔄 Loading */}
      {loading ? (
        <AiLoader />
      ) : (
        <>
          {/* 🔹 Top Purple Card */}
          <HeaderCard />

          {/* 🔹 Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Steps */}
            <div className="lg:col-span-2 space-y-4">
              <PriorityActions steps={steps} />
            </div>

            {/* RIGHT: Sidebar */}
            <div className="space-y-4">
              <RecommendedTools />
              <Timeline />
              <CostSummary />
            </div>
          </div>

          {/* 🔹 Policy Section */}
          <PolicySection />

          {/* 🔹 Feedback */}
          <FeedbackBar />

          {/* 🔹 Floating Actions */}
          <RemediationActions />
        </>
      )}
    </div>
  );
}
