import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface DiscussionPanelProps {
  assessmentId?: string;
  assessmentItemId?: string;
}

export default function DiscussionPanel({ assessmentId, assessmentItemId }: DiscussionPanelProps) {
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const queryClient = useQueryClient();

  const queryKey = ["comments", assessmentId, assessmentItemId];

  const { data: comments = [], isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      apiClient.get<Comment[]>(
        `/api/assessments/${assessmentId}/items/${assessmentItemId}/comments`,
      ),
    enabled: !!assessmentId && !!assessmentItemId,
  });

  const handlePostComment = async () => {
    if (!comment.trim() || !assessmentId || !assessmentItemId) {
      return;
    }

    setIsPosting(true);
    try {
      await apiClient.post(`/api/assessments/${assessmentId}/items/${assessmentItemId}/comments`, {
        body: { content: comment.trim() },
      });

      setComment("");
      queryClient.invalidateQueries({ queryKey });
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  if (!assessmentId || !assessmentItemId) {
    return null;
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="text-purple-600" size={16} />
        <p className="font-semibold">Discussion</p>
      </div>

      {/* Comments */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-5">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center">
            <p className="text-sm text-gray-500">No comments yet. Start the discussion!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50/70
              p-4
            "
            >
              <div className="flex gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback>{c.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm text-slate-900">{c.userName}</p>

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-slate-700 leading-relaxed break-words">
                    {c.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <textarea
          aria-label="Add discussion comment"
          className="
          w-full
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-3
          text-sm
          resize-none
          transition-all
          focus:bg-white
          focus:border-purple-500
          focus:ring-4
          focus:ring-purple-500/10
          outline-none
        "
          rows={4}
          placeholder="Share your observations, evidence notes, or compliance concerns..."
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            {1000 - comment.length} characters remaining
          </p>

          <Button
            aria-label="Post discussion comment"
            disabled={!comment.trim() || isPosting}
            onClick={handlePostComment}
            className=" w-full "
          >
            {isPosting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
