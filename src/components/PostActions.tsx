import { ThumbsUp, Flag, MoreVertical, Trash2, Edit } from "lucide-react";
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
}

const PostActions = ({ post, onDelete, onEdit, isLoading, canModerate, isAuthor }: PostActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReported, setIsReported] = useState(false);
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
        // Check post_reports table
        const { error: reportsError } = await supabase.from('post_reports').select('*').limit(1);

        if (likesError || reportsError) {
          console.error('Tables not found:', { likesError, reportsError });
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

  // Fetch initial report status
  useEffect(() => {
    const fetchReportStatus = async () => {
      if (!user || !tablesExist) return;

      try {
        const { data: reportData, error: reportError } = await supabase
          .from("post_reports")
          .select()
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .single();

        if (reportError && reportError.code !== "PGRST116") {
          console.error("Error fetching report status:", reportError);
          return;
        }

        setIsReported(!!reportData);
      } catch (err) {
        console.error("Error in fetchReportStatus:", err);
      }
    };

    fetchReportStatus();
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

  const handleReport = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to report posts.",
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

    if (isReported) {
      toast({
        title: "Already reported",
        description: "You have already reported this post.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);

      // Add report record
      const { error: reportError } = await supabase
        .from("post_reports")
        .insert({
          post_id: post.id,
          user_id: user.id
        });

      if (reportError) throw reportError;

      // Update post report count
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          is_reported: true,
          report_count: post.report_count + 1
        })
        .eq("id", post.id);

      if (updateError) throw updateError;

      setIsReported(true);

      toast({
        title: "Post reported",
        description: "Thank you for reporting this post. Our moderators will review it.",
      });
    } catch (err) {
      console.error("Error handling report:", err);
      toast({
        title: "Error",
        description: "Failed to report post. Please try again.",
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

      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${isReported ? 'text-red-500' : ''}`}
        onClick={handleReport}
        disabled={isLoading || actionLoading || isReported || !tablesExist}
      >
        <Flag className="w-4 h-4" />
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
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default PostActions;
