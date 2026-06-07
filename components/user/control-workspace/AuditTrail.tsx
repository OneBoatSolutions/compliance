"use client";

import { CheckCircle, Upload, FilePlus, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface AuditTrailProps {
  assessmentId?: string;
  assessmentItemId?: string;
}

interface TimelineItem {
  id: string;
  type: string;
  date: string;
  user: string;
  details: string;
}

export default function AuditTrail({ assessmentId, assessmentItemId }: AuditTrailProps) {
  const { data: timeline = [], isLoading } = useQuery({
    queryKey: ["auditTrail", assessmentId, assessmentItemId],
    queryFn: () =>
      apiClient.get<TimelineItem[]>(
        `/api/assessments/${assessmentId}/items/${assessmentItemId}/timeline`,
      ),
    enabled: !!assessmentId && !!assessmentItemId,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "EVIDENCE":
        return {
          icon: <Upload size={16} />,
          bg: "bg-blue-100",
          color: "text-blue-600",
        };

      case "COMMENT":
        return {
          icon: <MessageSquare size={16} />,
          bg: "bg-purple-100",
          color: "text-purple-600",
        };

      case "STATUS_CHANGE":
        return {
          icon: <CheckCircle size={16} />,
          bg: "bg-green-100",
          color: "text-green-600",
        };

      default:
        return {
          icon: <FilePlus size={16} />,
          bg: "bg-slate-100",
          color: "text-slate-600",
        };
    }
  };

  if (!assessmentId || !assessmentItemId) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl border">
      <div className="flex items-center gap-2 mb-5">
        <CheckCircle size={16} className="text-purple-600" />
        <p className="font-semibold">Audit Trail</p>
      </div>

      <div className="relative">
        {/* 🔥 CONTINUOUS LINE */}
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-purple-200" />
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : timeline.length === 0 ? (
            <p className="text-xs text-muted-foreground ml-8">No activity yet.</p>
          ) : (
            timeline.map((item: TimelineItem) => (
              <div key={item.id} className="relative flex gap-4 animate-fadeIn items-start">
                {/* 🔵 ICON ON LINE */}
                {(() => {
                  const iconData = getIcon(item.type);

                  return (
                    <div
                      className={` relative z-10 flex items-center justify-center w-10 h-10 rounded-full
                       border shadow-sm shrink-0 ${iconData.bg} ${iconData.color}`}
                    >
                      {iconData.icon}
                    </div>
                  );
                })()}

                {/* 📄 CONTENT */}
                <div className="pb-4 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.user}</p>

                  <p className="text-xs text-muted-foreground">{item.details}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔥 EXTENSION LINE (below last item) */}
        <div className="absolute left-[10px] bottom-[-20px] w-[2px] h-6 bg-muted opacity-50" />
      </div>
    </div>
  );
}
