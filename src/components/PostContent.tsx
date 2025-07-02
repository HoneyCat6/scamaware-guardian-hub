import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  return (
    <div className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
      {content}
    </div>
  );
};

export default PostContent;
