import { Sparkles } from "lucide-react";
import { RemediationData } from "@/services/types";
import { X } from "lucide-react";


export default function RemediationTop({
  data,
}: {
  data?: RemediationData;
}) {
  return (
    <div className="space-y-4">

      {/* HEADER */}
      
      {/* CARD */}
      <div className="bg-purple-50 border rounded-xl p-5 flex justify-between items-start">

        <div>
          <div className="flex gap-2 text-xs mb-2">
            <span className="bg-white px-2 py-1 rounded border">
              HIPAA-164.312(a)(1)
            </span>
            <span className="bg-purple-100 px-2 py-1 rounded">
              HIPAA
            </span>
            <span className="bg-orange-100 px-2 py-1 rounded text-orange-600">
              HIGH SEVERITY
            </span>
          </div>

          <h3 className="font-semibold">Access Control</h3>

          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Implement policies and procedures for access control...
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            NOT COMPLIANT
          </span>

          <p className="text-xs text-purple-600 mt-2">
            Improves score by +4%
          </p>
        </div>

      </div>
    </div>
  );
}
