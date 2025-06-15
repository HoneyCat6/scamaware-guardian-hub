
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/data/threadData";
import { useAuth } from "@/hooks/useAuth";

interface PostHeaderProps {
  post: Post;
}

const PostHeader = ({ post }: PostHeaderProps) => {
  const { user } = useAuth();
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{post.author}</span>
          {canModerate && (
            <Badge variant="outline" className="text-xs">
              {user?.role === 'admin' ? 'Admin' : 'Moderator'}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">{post.createdAt}</div>
      </div>
    </div>
  );
};

export default PostHeader;
