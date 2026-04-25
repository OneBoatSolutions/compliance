import DiscussionPanel from "./DiscussionPanel";
import RelatedControls from "./RelatedControls";
import ControlRequirements from "./ControlRequirements";
import AuditTrail from "./AuditTrail";
import AIAssistantCard from "./AIAssisstentCard";
export default function RightSidebar({ status }: any) {
  return (
    <div className="space-y-4 ">
      {/* AI Assistant */}
      <AIAssistantCard status={status} />

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
    </div>
  );
}
