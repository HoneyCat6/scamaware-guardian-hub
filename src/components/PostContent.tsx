import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="prose max-w-none">
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </div>
  );
};

export default PostContent;
