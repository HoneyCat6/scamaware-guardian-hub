
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/data/threadData";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import PostHeader from "@/components/PostHeader";
import PostActions from "@/components/PostActions";
import PostContent from "@/components/PostContent";
import ReportedPostAlert from "@/components/ReportedPostAlert";

interface ThreadPostProps {
  post: Post;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
}

const ThreadPost = ({ post, onDelete, onEdit }: ThreadPostProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

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
        <ReportedPostAlert post={post} />

        <div className="flex items-start justify-between mb-4">
          <PostHeader post={post} />
          <PostActions 
            post={post}
            onDelete={onDelete}
            onEdit={onEdit}
            isLoading={isLoading}
          />
        </div>
        
        <PostContent post={post} />
      </CardContent>
    </Card>
  );
};

export default ThreadPost;
