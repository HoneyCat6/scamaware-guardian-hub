
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
  const [currentThread, setCurrentThread] = useState(
    threadId && threadData[threadId as keyof typeof threadData] 
      ? threadData[threadId as keyof typeof threadData] 
      : null
  );

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
      
      // Remove the post from the current thread
      if (currentThread) {
        const updatedThread = {
          ...currentThread,
          posts: currentThread.posts.filter(post => post.id !== postId)
        };
        setCurrentThread(updatedThread);
      }
      
      toast({
        title: "Post deleted",
        description: "The post has been successfully removed.",
      });
      
      console.log(`Deleted post ${postId}`);
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

    if (!currentThread) {
      throw new Error("Thread not found.");
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new post object
      const newPost = {
        id: Math.max(...currentThread.posts.map(p => p.id)) + 1,
        author: user.username,
        content: content,
        createdAt: "Just now",
        likes: 0,
        isReported: false,
        reportCount: 0
      };
      
      // Add the new post to the thread
      const updatedThread = {
        ...currentThread,
        posts: [...currentThread.posts, newPost]
      };
      
      setCurrentThread(updatedThread);
      
      console.log(`Adding reply to thread ${currentThread.id}:`, content);
      
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

  if (!currentThread) {
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
          <ThreadHeader thread={currentThread} />

          {/* Loading Overlay */}
          {isLoading && <ThreadLoadingOverlay />}

          {/* Posts */}
          <div className="space-y-4 mb-8">
            {currentThread.posts.map((post) => (
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
