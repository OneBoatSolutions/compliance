/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import PriorityBadge from "./priority-badge";

export default function RemediationStep({ step, index }: any) {
  return (
    <Card className="p-5 bg-white shadow-sm border-l-4 border-purple-500">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
            {index + 1}
          </div>
          <h3 className="font-semibold">{step.title}</h3>
        </div>

        <PriorityBadge level={step.priority} />
      </div>

      <p className="text-sm text-gray-500 mb-2">
        Owner: {step.owner} • Effort: {step.hours} hrs
      </p>

      <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
        {step.description.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
