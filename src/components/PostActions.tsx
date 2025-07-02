import { ThumbsUp, Flag, MoreVertical, Trash2, Edit, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface PostActionsProps {
  post: Post;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  isLoading: boolean;
  canModerate?: boolean;
  isAuthor?: boolean;
  isDeleting: boolean;
}

const PostActions = ({ post, onDelete, onEdit, isLoading, canModerate, isAuthor, isDeleting }: PostActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [tablesExist, setTablesExist] = useState(false);

  const canEdit = isAuthor || canModerate;
  const canDelete = isAuthor || canModerate;

  // Check if tables exist
  useEffect(() => {
    const checkTables = async () => {
      try {
        // Check post_likes table
        const { error: likesError } = await supabase.from('post_likes').select('*').limit(1);

        if (likesError) {
          console.error('Tables not found:', { likesError });
          setTablesExist(false);
          toast({
            title: "Database setup required",
            description: "Please contact an administrator to set up the required database tables.",
            variant: "destructive",
          });
        } else {
          setTablesExist(true);
        }
      } catch (err) {
        console.error('Error checking tables:', err);
        setTablesExist(false);
      }
    };

    checkTables();
  }, [toast]);

  // Fetch initial like status and count
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user || !tablesExist) return;

      try {
        // Check if user has liked this post
        const { data: likeData, error: likeError } = await supabase
          .from("post_likes")
          .select()
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .single();

        if (likeError && likeError.code !== "PGRST116") {
          console.error("Error fetching like status:", likeError);
          return;
        }

        setIsLiked(!!likeData);

        // Get total like count
        const { count, error: countError } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        if (countError) {
          console.error("Error fetching like count:", countError);
          return;
        }

        setLikeCount(count || 0);
      } catch (err) {
        console.error("Error in fetchLikeStatus:", err);
      }
    };

    fetchLikeStatus();
  }, [post.id, user, tablesExist]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    if (!tablesExist) {
      toast({
        title: "Database setup required",
        description: "Please contact an administrator to set up the required database tables.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);

      if (isLiked) {
        // Remove like
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        setIsLiked(false);
        setLikeCount(prev => prev - 1);

        toast({
          title: "Like removed",
          description: "You've removed your like from this post.",
        });
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert({
            post_id: post.id,
            user_id: user.id
          });

        if (insertError) throw insertError;

        setIsLiked(true);
        setLikeCount(prev => prev + 1);

        toast({
          title: "Post liked",
          description: "You've liked this post.",
        });
      }
    } catch (err) {
      console.error("Error handling like:", err);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    if (!canEdit) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to edit this post.",
        variant: "destructive",
      });
      return;
    }

    onEdit?.(post.id);
  };

  const handleDelete = async () => {
    if (!canDelete) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete this post.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);

      // Delete post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (deleteError) throw deleteError;

      onDelete?.(post.id);

      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${isLiked ? 'text-blue-500' : ''}`}
        onClick={handleLike}
        disabled={isLoading || actionLoading || !tablesExist}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likeCount}</span>
      </Button>

      {(canEdit || canDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isLoading || actionLoading}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default PostActions;
