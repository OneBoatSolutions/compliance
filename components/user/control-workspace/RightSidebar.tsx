import DiscussionPanel from "./DiscussionPanel";
import RelatedControls from "./RelatedControls";
import ControlRequirements from "./ControlRequirements";
import AuditTrail from "./AuditTrail";
import AIAssistantCard from "./AIAssisstentCard";
import RemediationDrawer from "@/components/ai/remediation-drawer";
import { useState } from "react";

interface RightSidebarProps {
  control?: {
    id: string;
    itemId: string;
    title: string;
    description: string;
    framework: string;
    severity: string;
  };
  status: string;
}

export default function RightSidebar({ control, status }: RightSidebarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div className="space-y-4 ">
      {/* AI Assistant */}
      <AIAssistantCard status={status} onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Requirements */}
      <div>
        <ControlRequirements />
      </div>
      <div>
        <RelatedControls />
      </div>
      <div>
        <DiscussionPanel />
      </div>

      {/* Audit Trail */}
      <div>
        <AuditTrail />
      </div>

      {/* Remediation Drawer */}
      {control && (
        <RemediationDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          controlId={control.id}
          assessmentItemId={control.itemId}
          controlTitle={control.title}
          controlDescription={control.description}
          framework={control.framework}
          status={status}
          severity={control.severity}
        />
      )}
    </div>
  );
}
