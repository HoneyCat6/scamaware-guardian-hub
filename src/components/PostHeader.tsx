import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface PostHeaderProps {
  post: Post;
}

const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{post.author.username}</span>
        </div>
        <div className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
};

export default PostHeader;
