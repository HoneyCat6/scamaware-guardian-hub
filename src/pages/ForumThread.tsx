import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThreadHeader from "@/components/ThreadHeader";
import ThreadPost from "@/components/ThreadPost";
import ReplyForm from "@/components/ReplyForm";
import ModerationPanel from "@/components/ModerationPanel";
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
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold text-red-600">Invalid Thread ID</h1>
          </div>
          <p className="text-gray-600 mb-4">The thread ID provided is not valid.</p>
          <Link to="/forums">
            <Button>Back to Forums</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Thread Not Found</h1>
          </div>
          <p className="text-gray-600 mb-4">
            The thread you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/forums">
              <Button variant="outline">Back to Forums</Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-auto"
              >
                Dismiss
              </Button>
            </div>
          )}

          {/* Moderator Controls */}
          {canModerate && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 font-medium mb-2">Moderator Controls</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  Pin Thread
                </Button>
                <Button variant="outline" size="sm">
                  Lock Thread
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowModerationPanel(!showModerationPanel)}
                  className="flex items-center gap-1"
                >
                  <Shield className="w-4 h-4" />
                  {showModerationPanel ? 'Hide' : 'Show'} Moderation Panel
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                  Delete Thread
                </Button>
              </div>
            </div>
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
          {isLoading && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Processing...</p>
            </div>
          )}

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
