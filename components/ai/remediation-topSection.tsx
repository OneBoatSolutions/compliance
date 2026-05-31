import { RemediationData } from "@/services/types";

export default function RemediationTop({ data }: { data: RemediationData }) {
  const completedSteps = data.steps.filter((step) => step.status === "DONE").length;
  const scoreImpact = Math.max(1, Math.round(data.steps.length * 1.5));

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border rounded-xl p-5 flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <span className="bg-white px-2 py-1 rounded border">{data.controlId}</span>
            <span className="bg-purple-100 px-2 py-1 rounded">{data.frameworkName}</span>
            <span className="bg-orange-100 px-2 py-1 rounded text-orange-600">
              {data.severity} SEVERITY
            </span>
          </div>

          <h3 className="font-semibold">{data.controlTitle}</h3>

          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{data.controlDescription}</p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            {data.currentStatus.replaceAll("_", " ")}
          </span>

          <p className="text-xs text-purple-600 mt-2">
            {completedSteps}/{data.steps.length} steps complete
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated score impact +{scoreImpact}%
          </p>
        </div>
      </div>
    </div>
  );
}
