
import { ThumbsUp, Flag, MoreVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Post } from "@/data/threadData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PostActionsProps {
  post: Post;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  isLoading: boolean;
}

const PostActions = ({ post, onDelete, onEdit, isLoading }: PostActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Check user permissions
  const canLike = Boolean(user);
  const canReport = Boolean(user);
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');
  const isOwnPost = user && user.username === post.author;
  const canEdit = isOwnPost || canModerate;
  const canDelete = isOwnPost || canModerate;

  const handleLike = async () => {
    if (!canLike) {
      toast({
        title: "Login required",
        description: "You need to be logged in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      toast({
        title: isLiked ? "Like removed" : "Post liked",
        description: isLiked ? "You've removed your like from this post." : "You've liked this post.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReport = async () => {
    if (!canReport) {
      toast({
        title: "Login required",
        description: "You need to be logged in to report posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Post reported",
        description: "Thank you for reporting this post. Our moderators will review it.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to report post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post.id);
    } else {
      toast({
        title: "Edit functionality",
        description: "Edit functionality will be available soon.",
      });
    }
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onDelete) {
        onDelete(post.id);
      }
      
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${isLiked ? 'text-blue-600' : ''}`}
        onClick={handleLike}
        disabled={isLoading}
      >
        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        {likeCount}
      </Button>
      
      {canReport && !isOwnPost && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleReport}
          disabled={isLoading}
          title="Report this post"
        >
          <Flag className="w-4 h-4" />
        </Button>
      )}

      {(canEdit || canDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isLoading}>
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
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
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
