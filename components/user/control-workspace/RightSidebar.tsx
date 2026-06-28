import DiscussionPanel from "./DiscussionPanel";
import RelatedControls from "./RelatedControls";
import ControlRequirements from "./ControlRequirements";
import AuditTrail from "./AuditTrail";
import AIAssistantCard from "./AIAssisstentCard";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const RemediationDrawer = dynamic(() => import("@/components/ai/remediation-drawer"), {
  ssr: false,
  loading: () => <Skeleton className="h-screen w-full md:w-[78%] ml-auto rounded-l-2xl" />,
});

interface RightSidebarProps {
  control?: {
    id: string;
    itemId: string;
    title: string;
    description: string;
    framework: string;
    severity: string;
    assessmentId: string;
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
        <ControlRequirements controlId={control?.id} />
      </div>
      <div>
        <RelatedControls controlId={control?.id} />
      </div>
      <div>
        <DiscussionPanel assessmentId={control?.assessmentId} assessmentItemId={control?.itemId} />
      </div>

      {/* Audit Trail */}
      <div>
        <AuditTrail assessmentId={control?.assessmentId} assessmentItemId={control?.itemId} />
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
