import DiscussionPanel from "./DiscussionPanel"
import RelatedControls from "./RelatedControls";
import ControlRequirements from "./ControlRequirements";
import AuditTrail from "./AuditTrail";
import AIAssistantCard from "./AIAssisstentCard";
import { useState } from "react";
  
type Props = {
  status: string;
  onOpenRemediation: () => void;
};

export default function RightSidebar({
  status,
  onOpenRemediation,
}: Props) {


  return (
    <div className="space-y-4 ">

      {/* AI Assistant */}
      <AIAssistantCard
        status={status}
        onOpenRemediation={onOpenRemediation}
/>

        

      {/* Requirements */}
      <div>
        <ControlRequirements/>
      </div>
      <div>
        <RelatedControls/>
      </div>
      <div>
        < DiscussionPanel/>
      </div>

      {/* Audit Trail */}
      <div>
        <AuditTrail/>
      </div>
    </div>
  );
}
