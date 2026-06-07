import { Sparkles } from "lucide-react";
import { X } from "lucide-react";
import { RemediationData } from "@/services/types";
interface Props {
  data?: RemediationData;
  onClose: () => void;
}

export default function RemediationHeader({ data, onClose }: Props) {
  void data;
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-muted ">
        <div className="p-2 rounded-lg bg-purple-100 shadow-sm">
          <Sparkles className="text-purple-600" size={16} />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold"> AI Remediation Plan</h2>

            {data?.status && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium border ${
                  data.status === "COMPLETED"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : data.status === "ARCHIVED"
                      ? "bg-slate-50 text-slate-700 border-slate-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                }
                        `}
              >
                {data.status}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Actionable steps to achieve compliance</p>
          {data?.updatedAt && (
            <p className="text-xs text-slate-500 mt-1">
              {" "}
              Updated {new Date(data.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="p-1 rounded-md hover:bg-gray-100 transition print:hidden"
      >
        <X size={18} />
      </button>
    </div>
  );
}
