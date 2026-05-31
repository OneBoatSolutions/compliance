import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

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
    <div className="bg-white shadow-sm p-4 rounded-xl border space-y-4">
      <p className="font-medium">Discussion</p>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet. Start the discussion!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{c.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="text-sm">
                <p className="font-medium">{c.userName}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </p>
                <p className="mt-1">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div>
        <textarea
          className="w-full border rounded-md p-2 text-sm"
          placeholder="Post a comment..."
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="text-right text-xs text-muted-foreground mt-1">
          {1000 - comment.length} characters remaining
        </div>
      </div>

      <Button size="sm" disabled={!comment.trim() || isPosting} onClick={handlePostComment}>
        {isPosting ? "Posting..." : "Post Comment"}
      </Button>
    </div>
  );
}
