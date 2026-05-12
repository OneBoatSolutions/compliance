/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListChecks } from "lucide-react";

const mockSteps = [
  {
    title: "Implement Role-Based Access Control (RBAC)",
    priority: "HIGH",
    owner: "IT Security Team",
    effort: "40 hours",
    tasks: ["Define roles and permissions", "Map users", "Audit access"],
  },
  {
    title: "Enable Multi-Factor Authentication (MFA)",
    priority: "HIGH",
    owner: "SysAdmin",
    effort: "16 hours",
    tasks: ["Setup MFA", "Test validation"],
  },
];

export default function PriorityActions({ data }: any) {
  const steps = data?.steps || mockSteps;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <ListChecks size={16} className="text-purple-600" />
        <h3 className="font-semibold">Priority Actions</h3>
      </div>

      {steps.map((step: any, i: number) => (
        <div key={i} className="border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-medium">{step.title}</p>

            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              {step.priority}
            </span>
          </div>

          <div className="text-xs text-muted-foreground flex gap-4">
            <span>Owner: {step.owner}</span>
            <span>Effort: {step.effort}</span>
          </div>

          <ul className="text-sm space-y-1 text-muted-foreground">
            {step.tasks.map((t: string, j: number) => (
              <li key={j}>• {t}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
