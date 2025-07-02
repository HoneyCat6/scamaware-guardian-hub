import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PostHeader from "@/components/PostHeader";
import PostActions from "@/components/PostActions";
import PostContent from "@/components/PostContent";
import PostEditForm from "@/components/PostEditForm";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface ThreadPostProps {
  post: Post;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  canModerate?: boolean;
  isAuthor?: boolean;
}

const ThreadPost = ({ post, onDelete, onEdit, canModerate, isAuthor }: ThreadPostProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from("posts")
        .update({
          content: content,
          updated_at: new Date().toISOString()
        })
        .eq("id", post.id);

      if (updateError) throw updateError;

      // Update local post data
      post.content = content;
      post.updated_at = new Date().toISOString();

      setIsEditing(false);
      
      toast({
        title: "Post updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (err) {
      console.error("Error updating post:", err);
      const errorMessage = "Failed to update post. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading post</p>
            <p className="text-sm mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isLoading ? 'opacity-50' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <PostHeader post={post} />
          <PostActions 
            post={post}
            onDelete={onDelete}
            onEdit={handleEditStart}
            isLoading={isLoading}
            canModerate={canModerate}
            isAuthor={isAuthor}
            isDeleting={false}
          />
        </div>
        
        {isEditing ? (
          <PostEditForm
            initialContent={post.content}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        ) : (
          <PostContent content={post.content} />
        )}
      </CardContent>
    </Card>
  );
};

export default ThreadPost;
