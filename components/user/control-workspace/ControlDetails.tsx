import { Badge } from "@/components/ui/badge";

export default function ControlDetails() {
  return (
    <div className="bg-white shadow-sm p-5 rounded-xl border space-y-5">
      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        Workforce supervision is handled via the OKTA provisioning workflow...
      </p>

      {/* Assignee + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm mb-1">Assignee</p>
          <input className="w-full border rounded-md p-2" />
        </div>

        <div>
          <p className="text-sm mb-1">Due Date</p>
          <input type="date" className="w-full border rounded-md p-2" />
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm mb-2">Related Topics</p>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Access Control</Badge>
          <Badge variant="secondary">Security Training</Badge>
          <Badge variant="secondary">Workforce Mgmt</Badge>
        </div>
      </div>
    </div>
  );
}
