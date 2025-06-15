
import { User, ThumbsUp, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/data/threadData";

interface ThreadPostProps {
  post: Post;
}

const ThreadPost = ({ post }: ThreadPostProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.author}</div>
              <div className="text-sm text-gray-500">{post.createdAt}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadPost;
