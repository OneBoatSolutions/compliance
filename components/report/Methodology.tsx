"use client";

import ReportSectionHeader from "@/components/report/report-section-header";

interface Props {
  appName: string;
}

export default function Methodology({ appName }: Props) {
  const steps = [
    {
      title: "Data Collection",
      description:
        "Assessment responses, organizational information, and evidence submissions are collected and validated.",
    },
    {
      title: "Control Evaluation",
      description:
        "Controls are evaluated against applicable framework requirements and mapped to compliance objectives.",
    },
    {
      title: "Risk Assessment",
      description:
        "Identified gaps are analyzed based on severity, likelihood, and potential business impact.",
    },
    {
      title: "Readiness Scoring",
      description:
        "Compliance readiness scores are calculated using weighted control completion and risk-adjusted metrics.",
    },
  ];

  return (
    <section className=" bg-white rounded-xl shadow p-8 space-y-8 border-t-2 border-primary">
      <ReportSectionHeader appName={appName} sectionNumber="07" />

      <div className="border-l-4 border-purple-600 pl-4">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Assessment Methodology
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          How compliance readiness and risk posture are evaluated.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-purple-100
              bg-gradient-to-br
              from-white
              via-purple-50
              to-white
              p-6
              shadow-[0_10px_30px_rgba(124,58,237,0.08)]
            "
          >
            <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold">
              Step {index + 1}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
