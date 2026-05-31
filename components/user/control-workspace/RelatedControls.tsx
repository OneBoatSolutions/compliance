"use client";

import { Link2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useParams } from "next/navigation";

interface RelatedControlsProps {
  controlId?: string;
}

interface RelatedControl {
  id: string;
  code: string;
  title: string;
  type: string;
}

interface ControlDetailsResponse {
  id: string;
  description: string | null;
  metadata: { requirements?: string[] } | null;
  relatedControls: RelatedControl[];
}

export default function RelatedControls({ controlId }: RelatedControlsProps) {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["controlDetails", controlId],
    queryFn: () => apiClient.get<ControlDetailsResponse>(`/api/controls/${controlId}/details`),
    enabled: !!controlId,
  });

  const related = data?.relatedControls || [];

  return (
    <div className="bg-white shadow-sm p-4 rounded-xl border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="text-purple-500" size={18} />
        <p className="font-medium">Related Controls</p>
      </div>

      {/* Links */}
      <div className="space-y-2 text-sm">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : related.length === 0 ? (
          <p className="text-muted-foreground text-xs">No related controls found.</p>
        ) : (
          related.map((item: RelatedControl) => (
            <div
              key={item.id}
              onClick={() => {
                if (assessmentId) {
                  router.push(`/assessments/${assessmentId}/control-workspace/${item.id}`);
                }
              }}
              className="flex justify-between items-center text-primary hover:underline cursor-pointer group"
              title={item.title}
            >
              <span className="truncate mr-2">
                {item.code} - {item.title}
              </span>
              <ExternalLink
                size={14}
                className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
