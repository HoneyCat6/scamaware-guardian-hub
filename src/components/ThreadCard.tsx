import { Link } from "react-router-dom";
import { MessageSquare, Clock, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type DatabaseThread = Database["public"]["Tables"]["threads"]["Row"];

interface Thread extends DatabaseThread {
  author: { username: string };
  posts: { count: number }[];
}

interface ThreadCardProps {
  thread: Thread;
  canModerate?: boolean;
  formatTimeAgo: (timeStr: string) => string;
}

const ThreadCard = ({ thread, canModerate, formatTimeAgo }: ThreadCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {thread.is_pinned && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  📌 Pinned
                </Badge>
              )}
              {thread.is_locked && (
                <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                  🔒 Locked
                </Badge>
              )}
              {canModerate && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  Mod Tools
                </Badge>
              )}
            </div>
            <Link to={`/forums/thread/${thread.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                {thread.title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {thread.content}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{thread.author.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{thread.posts[0]?.count || 0} {thread.posts[0]?.count === 1 ? 'reply' : 'replies'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(thread.created_at)}</span>
              </div>
            </div>
          </div>
          <Link to={`/forums/thread/${thread.id}`}>
            <Button variant="ghost" size="sm" className="ml-4">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadCard;
