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
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Thread = {
  id: number;
  title: string;
  content: string;
  author_id: string;
  category_id: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author: { username: string };
  category: { name: string };
  _count: { posts: number };
};

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

const ForumThread = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // Convert string id to number
  const threadId = id ? parseInt(id, 10) : null;
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  // Fetch thread and posts
  useEffect(() => {
    const fetchThreadData = async () => {
      if (!threadId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch thread with author and category
        const { data: threadData, error: threadError } = await supabase
          .from("threads")
          .select(`
            *,
            author:profiles(username),
            category:categories(name),
            posts:posts(count)
          `)
          .eq("id", threadId)
          .single();

        if (threadError) throw threadError;
        if (!threadData) throw new Error("Thread not found");

        // Transform the data to match our Thread type
        const transformedThread: Thread = {
          id: threadData.id,
          title: threadData.title,
          content: threadData.content,
          author_id: threadData.author_id,
          category_id: threadData.category_id,
          is_pinned: threadData.is_pinned,
          is_locked: threadData.is_locked,
          created_at: threadData.created_at,
          updated_at: threadData.updated_at,
          author: { username: (threadData.author as any).username },
          category: { name: threadData.category.name },
          _count: { posts: threadData.posts[0].count || 0 }
        };

        setThread(transformedThread);

        // Fetch posts with authors
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(`
            *,
            author:profiles(username)
          `)
          .eq("thread_id", threadId)
          .eq("status", "active")
          .order("created_at", { ascending: true });

        if (postsError) throw postsError;

        // Transform posts data to ensure correct typing
        const transformedPosts: Post[] = postsData?.map(post => ({
          ...post,
          author: { username: (post.author as any).username }
        })) || [];

        setPosts(transformedPosts);

      } catch (err) {
        console.error("Error fetching thread data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load thread data.";
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

    fetchThreadData();

    // Set up real-time subscription for posts
    const postsSubscription = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `thread_id=eq.${threadId}`
        },
        async (payload) => {
          try {
            if (payload.eventType === "INSERT") {
              // Fetch the complete post data with author
              const { data: newPost, error: postError } = await supabase
                .from("posts")
                .select(`
                  *,
                  author:profiles(username)
                `)
                .eq("id", payload.new.id)
                .single();

              if (postError) throw postError;

              // Transform the new post to match our Post type
              const transformedPost: Post = {
                ...newPost,
                author: { username: (newPost.author as any).username }
              };

              setPosts(currentPosts => [...currentPosts, transformedPost]);

              // Update the thread's post count
              if (thread) {
                setThread(currentThread => ({
                  ...currentThread!,
                  _count: { posts: currentThread!._count.posts + 1 }
                }));
              }
            } else if (payload.eventType === "UPDATE") {
              setPosts(currentPosts =>
                currentPosts.map(post =>
                  post.id === payload.new.id
                    ? { ...post, ...payload.new, author: post.author }
                    : post
                )
              );
            } else if (payload.eventType === "DELETE") {
              setPosts(currentPosts =>
                currentPosts.filter(post => post.id !== payload.old.id)
              );

              // Update the thread's post count
              if (thread) {
                setThread(currentThread => ({
                  ...currentThread!,
                  _count: { posts: currentThread!._count.posts - 1 }
                }));
              }
            }
          } catch (err) {
            console.error("Error handling post subscription update:", err);
          }
        }
      )
      .subscribe();

    return () => {
      postsSubscription.unsubscribe();
    };
  }, [threadId, toast]);

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
      
      const { error: deleteError } = await supabase
        .from("posts")
        .update({ status: "deleted" })
        .eq("id", postId);

      if (deleteError) throw deleteError;
      
      toast({
        title: "Post deleted",
        description: "The post has been successfully removed.",
      });
    } catch (err) {
      console.error("Error deleting post:", err);
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
    // This is no longer needed as editing is handled in ThreadPost component
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
      
      const { error: postError } = await supabase
        .from("posts")
        .insert({
          thread_id: thread.id,
          author_id: user.id,
          content: content,
          status: "active",
          is_reported: false,
          report_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (postError) throw postError;
      
      return Promise.resolve();
    } catch (err) {
      console.error("Error submitting reply:", err);
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
    return isLoading ? <ThreadLoadingOverlay /> : <ThreadNotFound />;
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
            {posts.map((post) => (
              <ThreadPost 
                key={post.id} 
                post={post}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
                canModerate={canModerate}
                isAuthor={user?.id === post.author_id}
              />
            ))}
          </div>

          {/* Reply Form */}
          {!thread.is_locked && (
            <ReplyForm onSubmit={handleSubmitReply} />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForumThread;
