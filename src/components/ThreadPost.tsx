import { User, ThumbsUp, Flag, MoreVertical, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Post } from "@/data/threadData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ThreadPostProps {
  post: Post;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
}

const ThreadPost = ({ post, onDelete, onEdit }: ThreadPostProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      toast({
        title: isLiked ? "Like removed" : "Post liked",
        description: isLiked ? "You've removed your like from this post." : "You've liked this post.",
      });
    } catch (err) {
      setError('Failed to update like');
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Post reported",
        description: "Thank you for reporting this post. Our moderators will review it.",
      });
    } catch (err) {
      setError('Failed to report post');
      toast({
        title: "Error",
        description: "Failed to report post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      setError(null);
      
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
      setError('Failed to delete post');
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
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
    <Card className={`${isLoading ? 'opacity-50' : ''} ${post.isReported && canModerate ? 'border-orange-300 bg-orange-50' : ''}`}>
      <CardContent className="p-6">
        {/* Moderator Alert for Reported Posts */}
        {post.isReported && canModerate && (
          <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-md flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div className="flex-1">
              <p className="text-orange-800 font-medium">Reported Post</p>
              <p className="text-orange-700 text-sm">
                This post has been reported {post.reportCount} time{post.reportCount !== 1 ? 's' : ''} and requires moderation.
              </p>
            </div>
            <Badge variant="destructive" className="text-xs">
              {post.reportCount} report{post.reportCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
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
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadPost;
