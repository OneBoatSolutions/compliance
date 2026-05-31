/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RemediationSummary({ data }: any) {
  return (
    <div className="bg-purple-50 border rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">{data?.controlId || "HIPAA-164.312(a)(1)"}</div>

        <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
          NOT COMPLIANT
        </span>
      </div>

      <h3 className="font-semibold">Access Control</h3>

      <p className="text-sm text-muted-foreground">
        Implement policies and procedures for access control...
      </p>

      <p className="text-sm text-purple-600">Addressing this will improve your score by +4%</p>
    </div>
  );
}
