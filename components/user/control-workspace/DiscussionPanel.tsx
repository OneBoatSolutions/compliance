import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DiscussionPanel() {
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
      <textarea className="w-full border rounded-md p-2 text-sm" placeholder="Post a comment..." />

      <Button size="sm">Post Comment</Button>
    </div>
  );
}
