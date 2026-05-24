import { ClipboardList, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

interface ControlRequirementsProps {
  controlId?: string;
}

interface ControlDetailsResponse {
  id: string;
  description: string | null;
  metadata: { requirements?: string[] } | null;
  relatedControls: { id: string; code: string; title: string; type: string }[];
}

export default function ControlRequirements({ controlId }: ControlRequirementsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["controlDetails", controlId],
    queryFn: () => apiClient.get<ControlDetailsResponse>(`/api/controls/${controlId}/details`),
    enabled: !!controlId,
  });

  const description = data?.description || "";
  const requirements: string[] =
    data?.metadata?.requirements ||
    (description ? description.split(/\. |\n/).filter((s: string) => s.trim().length > 0) : []);

  return (
    <div className="bg-white shadow-sm p-4 rounded-xl border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="text-primary" size={18} />
        <p className="font-medium">Control Requirements</p>
      </div>

      {/* Items */}
      <div className="space-y-2 text-sm">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : requirements.length === 0 ? (
          <p className="text-muted-foreground text-xs">No specific requirements found.</p>
        ) : (
          requirements.map((req, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-gray-300 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{req}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
