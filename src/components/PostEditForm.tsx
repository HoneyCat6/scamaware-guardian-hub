import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface PostEditFormProps {
  post: Post;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PostEditForm = ({ post, onSave, onCancel, isLoading }: PostEditFormProps) => {
  const [content, setContent] = useState(post.content);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (content.length > 10000) {
      toast({
        title: "Content too long",
        description: "Please keep your post under 10,000 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(content);
    } catch (error) {
      toast({
        title: "Error saving post",
        description: error instanceof Error ? error.message : "Failed to save post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
              Edit Post
            </label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your post..."
              className="min-h-[120px]"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/10000 characters
              </span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !content.trim() || content === post.content}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostEditForm; 