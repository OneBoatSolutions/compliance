import RemediationStep from "./remediation-step"

export default function PriorityActions({ steps }: any) {
  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Priority Actions</h3>
        <span className="text-xs text-gray-500">
          0/{steps.length} completed
        </span>
      </div>

      {steps.map((step: any, i: number) => (
        <RemediationStep key={i} step={step} index={i} />
      ))}

    </div>
  )
}
