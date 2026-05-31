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
        return <Upload className="text-blue-500" size={16} />;
      case "COMMENT":
        return <MessageSquare className="text-purple-500" size={16} />;
      case "STATUS_CHANGE":
        return <CheckCircle className="text-purple-500" size={16} />;
      case "CREATED":
      default:
        return <FilePlus className="text-gray-400" size={16} />;
    }
  };
  if (!assessmentId || !assessmentItemId) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl border">
      <p className="font-medium mb-5">Audit Trail</p>

      <div className="relative">
        {/* 🔥 CONTINUOUS LINE */}
        <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-primary" />

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
              <div key={item.id} className="relative flex gap-4 animate-fadeIn">
                {/* 🔵 ICON ON LINE */}
                <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white border shadow-sm shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                {/* 📄 CONTENT */}
                <div className="pb-2">
                  <p className="text-sm font-medium">{item.user}</p>
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
