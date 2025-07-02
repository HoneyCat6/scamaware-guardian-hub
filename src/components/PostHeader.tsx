import { Post } from "@/hooks/useForumData";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PostHeaderProps {
  post: Post;
}

const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          {post.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-sm">{post.author.username}</div>
        <div className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          {post.created_at !== post.updated_at && " (edited)"}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
