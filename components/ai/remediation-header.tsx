import { Sparkles } from "lucide-react";
import { X } from "lucide-react";
import { RemediationData } from "@/services/types";
type Props = {
  data?: any;
  onClose: () => void;
};

export default function RemediationHeader({ data, onClose }: Props) {
  return (
    <div className="flex items-start justify-between">

        <div className="flex items-center gap-2 px-5 pt-5 py-4 pb-4 border-b border-muted ">
          <div className="p-2 rounded-lg bg-purple-100 shadow-sm">
            <Sparkles className="text-purple-600" size={16} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              AI Remediation Plan
            </h2>
            <p className="text-sm text-muted-foreground">
              Actionable steps to achieve compliance
            </p>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>
        </div>
  );
}

