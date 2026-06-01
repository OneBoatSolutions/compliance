"use client";

import ReportSectionHeader from "@/components/report/report-section-header";

interface Props {
  appName: string;
}

export default function FrameworkReference({ appName }: Props) {
  const frameworks = [
    {
      code: "GDPR",
      title: "General Data Protection Regulation",
      description:
        "Protects personal data and privacy rights of individuals within the European Union.",
    },
    {
      code: "HIPAA",
      title: "Health Insurance Portability and Accountability Act",
      description:
        "Protects healthcare information and establishes safeguards for protected health information.",
    },
    {
      code: "PCI-DSS",
      title: "Payment Card Industry Data Security Standard",
      description: "Provides security requirements for organizations handling payment card data.",
    },
  ];

  return (
    <section className=" bg-white rounded-xl shadow p-8 space-y-8 border-t-2 border-primary">
      <ReportSectionHeader appName={appName} sectionNumber="08" />

      <div className="border-l-4 border-purple-600 pl-4">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Framework Reference Guide
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of compliance frameworks included in this assessment.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {frameworks.map((framework) => (
          <div
            key={framework.code}
            className="
              rounded-2xl
              border
              border-purple-100
              bg-white
              p-6
              shadow-lg
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
              {framework.code}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">{framework.title}</h3>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{framework.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
