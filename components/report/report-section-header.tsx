interface ReportSectionHeaderProps {
  appName: string;
  sectionNumber: string;
}

export default function ReportSectionHeader({ appName, sectionNumber }: ReportSectionHeaderProps) {
  return (
    <div className="mb-8 border-b border-slate-200 pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{appName}</p>

      <p className="mt-1 text-sm text-slate-500">
        Compliance Readiness Report • Section {sectionNumber}
      </p>
    </div>
  );
}
