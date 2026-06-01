"use client";

import ReportSectionHeader from "@/components/report/report-section-header";

interface Props {
  appName: string;
  organization: {
    productName: string;
    description: string;
    services: string;
    targetCustomers: string;
    regions: string[];
    dataHandled: string[];
  };
}

export default function AssessmentScope({ appName, organization }: Props) {
  return (
    <section className=" bg-white rounded-xl shadow p-8 space-y-8 border-t-2 border-primary">
      <ReportSectionHeader appName={appName} sectionNumber="03" />

      <div className="border-l-4 border-purple-600 pl-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-wide uppercase">
          ASSESSMENT SCOPE
        </h2>

        <p className="mt-2 text-slate-500">
          Organizational footprint, operational scope, and data landscape.
        </p>
      </div>

      {/* Application Overview */}
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-white p-6 shadow-[0_10px_30px_rgba(124,58,237,0.08)]">
        <p className="text-xs uppercase tracking-wide text-slate-400">Application Overview</p>

        <h3 className="mt-2 text-xl font-semibold text-slate-900">{organization.productName}</h3>

        <p className="mt-3 text-slate-600 leading-relaxed">{organization.description}</p>
      </div>

      {/* Services + Customers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-white p-6 shadow-[0_10px_30px_rgba(124,58,237,0.08)]">
          <p className="text-xs uppercase tracking-wide text-slate-400">Services</p>

          <p className="mt-3 text-lg font-semibold text-slate-900">{organization.services}</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-white p-6 shadow-[0_10px_30px_rgba(124,58,237,0.08)]">
          <p className="text-xs uppercase tracking-wide text-slate-400">Target Customers</p>

          <p className="mt-3 text-lg font-semibold text-slate-900">
            {organization.targetCustomers}
          </p>
        </div>
      </div>

      {/* Regions */}
      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Regions Covered</h3>

        <div className="flex flex-wrap gap-3">
          {organization.regions.map((region) => (
            <span
              key={region}
              className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium"
            >
              {region}
            </span>
          ))}
        </div>
      </div>

      {/* Data Categories */}
      <div className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Data Categories Handled</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {organization.dataHandled.map((dataType) => (
            <div key={dataType} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-sm font-medium text-slate-700">{dataType}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
