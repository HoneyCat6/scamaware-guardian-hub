
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThreadHeader from "@/components/ThreadHeader";
import ThreadPost from "@/components/ThreadPost";
import ReplyForm from "@/components/ReplyForm";
import ModerationPanel from "@/components/ModerationPanel";
import ThreadErrorDisplay from "@/components/ThreadErrorDisplay";
import ThreadNotFound from "@/components/ThreadNotFound";
import InvalidThreadId from "@/components/InvalidThreadId";
import ModeratorControls from "@/components/ModeratorControls";
import ThreadLoadingOverlay from "@/components/ThreadLoadingOverlay";
import { threadData } from "@/data/threadData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ForumThread = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModerationPanel, setShowModerationPanel] = useState(false);

  // Convert string id to number and safely access threadData
  const threadId = id ? parseInt(id, 10) : null;
  const thread = threadId && threadData[threadId as keyof typeof threadData] ? threadData[threadId as keyof typeof threadData] : null;

  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  const handleDeletePost = async (postId: number) => {
    if (!canModerate) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete posts.",
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
        title: "Post deleted",
        description: "The post has been successfully removed.",
      });
      
      // In a real app, you would update the thread data here
      console.log(`Deleting post ${postId}`);
    } catch (err) {
      const errorMessage = "Failed to delete post. Please try again.";
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

  const handleEditPost = (postId: number) => {
    toast({
      title: "Edit functionality",
      description: "Post editing will be available soon.",
    });
    console.log(`Editing post ${postId}`);
  };

  const handleSubmitReply = async (content: string) => {
    if (!user) {
      throw new Error("You must be logged in to post replies.");
    }

    if (!thread) {
      throw new Error("Thread not found.");
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would add the new post to the thread data
      console.log(`Adding reply to thread ${thread.id}:`, content);
      
      // Simulate success
      return Promise.resolve();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit reply.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!threadId || isNaN(threadId)) {
    return <InvalidThreadId />;
  }

  if (!thread) {
    return <ThreadNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/forums">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Forums
              </Button>
            </Link>
          </div>

          {/* Error Display */}
          {error && (
            <ThreadErrorDisplay error={error} onDismiss={() => setError(null)} />
          )}

          {/* Moderator Controls */}
          {canModerate && (
            <ModeratorControls 
              showModerationPanel={showModerationPanel}
              onToggleModerationPanel={() => setShowModerationPanel(!showModerationPanel)}
            />
          )}

          {/* Moderation Panel */}
          {canModerate && showModerationPanel && (
            <div className="mb-6">
              <ModerationPanel />
            </div>
          )}

          {/* Thread Header */}
          <ThreadHeader thread={thread} />

          {/* Loading Overlay */}
          {isLoading && <ThreadLoadingOverlay />}

          {/* Posts */}
          <div className="space-y-4 mb-8">
            {thread.posts.map((post) => (
              <ThreadPost 
                key={post.id} 
                post={post}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            ))}
          </div>

          {/* Reply Form */}
          <ReplyForm onSubmit={handleSubmitReply} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForumThread;
