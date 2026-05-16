import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DiscussionPanel() {
  const [comment, setComment] = useState("");
  return (
    <div className="bg-white shadow-sm p-4 rounded-xl border space-y-4">
      <p className="font-medium">Discussion</p>

      {/* Comment */}
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>

        <div className="text-sm">
          <p className="font-medium">Mike Ross</p>
          <p className="text-muted-foreground text-xs">2h ago</p>
          <p className="mt-1">Sarah, the screenshots look good. Can we confirm...</p>
        </div>
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

      <Button size="sm" disabled={!comment.trim()}>
        Post Comment
      </Button>
    </div>
  );
}
