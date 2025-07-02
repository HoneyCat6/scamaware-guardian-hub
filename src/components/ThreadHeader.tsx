import { User, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type Thread = Database["public"]["Tables"]["threads"]["Row"] & {
  author: { username: string };
  category: { name: string };
  _count: { posts: number };
};

interface ThreadHeaderProps {
  thread: Thread;
}

const ThreadHeader = ({ thread }: ThreadHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {thread.is_pinned && (
                <Badge variant="secondary">Pinned</Badge>
              )}
              <Badge variant="outline">{thread.category.name}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{thread.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{thread.author.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(thread.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{thread._count.posts} replies</span>
              </div>
            </div>
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{thread.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadHeader;
