import { Badge } from "@/components/ui/badge";
import { Lock, Pin } from "lucide-react";
import type { Thread } from "@/types/forum";

interface ThreadHeaderProps {
  thread: Thread;
}

const ThreadHeader = ({ thread }: ThreadHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-2xl font-bold">{thread.title}</h1>
        {thread.is_pinned && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Pin className="w-3 h-3" />
            Pinned
          </Badge>
        )}
        {thread.is_locked && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Locked
          </Badge>
        )}
      </div>
      <div className="text-sm text-gray-500">
        Posted by {thread.author.username} in {thread.category.name}
      </div>
    </div>
  );
};

export default ThreadHeader;
