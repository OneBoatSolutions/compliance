import { FileText } from "lucide-react";

export default function PolicyRecommendations({ policies }: { policies: string[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-purple-600" />
        <h3 className="font-semibold">Policy Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy) => (
          <div key={policy} className="border rounded-xl p-4">
            <p className="font-medium">{policy}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add or update this policy, then attach approval evidence to the control workspace.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
