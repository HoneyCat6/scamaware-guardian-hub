import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
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
import type { Thread, Post } from "@/types/forum";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ForumThread = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Convert string id to number
  const threadId = id ? parseInt(id, 10) : null;
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  // Set initial content
  useEffect(() => {
    if (!thread && !isLoading) {
      setThread({
        id: 1,
        title: "Welcome",
        content: "Afiq punya content hello gaiss",
        author_id: "1",
        category_id: 1,
        is_pinned: false,
        is_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        locked_at: null,
        locked_by: null,
        pinned_at: null,
        pinned_by: null,
        author: { username: "system" },
        category: { name: "General" },
        _count: { posts: 0 }
      });
    }
  }, [thread, isLoading]);

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
          locked_at: threadData.locked_at,
          locked_by: threadData.locked_by,
          pinned_at: threadData.pinned_at,
          pinned_by: threadData.pinned_by,
          author: { username: (threadData.author as any).username },
          category: { name: threadData.category.name },
          _count: { posts: threadData.posts[0].count || 0 }
        };

        setThread(transformedThread);

        // Fetch posts with authors
        let query = supabase
          .from("posts")
          .select(`
            *,
            author:profiles(username)
          `)
          .eq("thread_id", threadId)
          .eq("status", "active");

        const { data: postsData, error: postsError } = await query
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
              let query = supabase
                .from("posts")
                .select(`
                  *,
                  author:profiles(username)
                `)
                .eq("id", payload.new.id);

              const { data: newPost, error: postError } = await query.single();

              if (postError) throw postError;
              if (!newPost) return; // Skip if post is reported and user is not a moderator

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

  const handleThreadUpdate = async () => {
    if (!threadId) return;

    try {
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
        locked_at: threadData.locked_at,
        locked_by: threadData.locked_by,
        pinned_at: threadData.pinned_at,
        pinned_by: threadData.pinned_by,
        author: { username: (threadData.author as any).username },
        category: { name: threadData.category.name },
        _count: { posts: threadData.posts[0].count || 0 }
      };

      setThread(transformedThread);
    } catch (err) {
      console.error("Error updating thread data:", err);
      toast({
        title: "Error",
        description: "Failed to update thread status.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription for thread updates
  useEffect(() => {
    if (!threadId) return;

    const threadSubscription = supabase
      .channel('thread-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threads',
          filter: `id=eq.${threadId}`
        },
        (payload) => {
          if (payload.eventType === "UPDATE" && thread) {
            setThread(currentThread => ({
              ...currentThread!,
              ...payload.new,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      threadSubscription.unsubscribe();
    };
  }, [threadId]);

  // Helper: is the current user the thread author?
  const isThreadAuthor = user && thread && user.id === thread.author_id;

  // Edit handlers
  const handleStartEdit = () => {
    setEditTitle(thread.title);
    setEditContent(thread.content);
    setEditMode(true);
  };
  const handleCancelEdit = () => {
    setEditMode(false);
  };
  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("threads")
        .update({ title: editTitle, content: editContent, updated_at: new Date().toISOString() })
        .eq("id", thread.id);
      if (error) throw error;
      setThread({ ...thread, title: editTitle, content: editContent });
      setEditMode(false);
      toast({ title: "Thread updated", description: "Your thread has been updated." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update thread.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  // Delete handler
  const handleDeleteThread = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("threads").delete().eq("id", thread.id);
      if (error) throw error;
      toast({ title: "Thread deleted", description: "Your thread has been deleted." });
      window.location.href = "/forums";
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete thread.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (!threadId) {
    return <InvalidThreadId />;
  }

  if (error) {
    return <ThreadErrorDisplay error={error} onDismiss={() => setError(null)} />;
  }

  if (!thread) {
    return <ThreadNotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {canModerate && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowModerationPanel(!showModerationPanel)}
            >
              Show Mod Tools
            </Button>
          </div>
        )}
        
        {showModerationPanel && canModerate && (
          <ModerationPanel />
        )}

        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/forums">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forums
            </Button>
          </Link>

          {/* Thread header */}
          <ThreadHeader thread={thread} />

          {/* Edit/Delete controls for thread author */}
          {isThreadAuthor && !editMode && (
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleStartEdit}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>Delete</Button>
            </div>
          )}

          {/* Inline edit form */}
          {isThreadAuthor && editMode && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-4">
                <input
                  className="w-full border rounded px-3 py-2 mb-2 text-lg font-bold"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  disabled={isLoading}
                />
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[120px]"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} disabled={isLoading}>Save</Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Thread content (view mode) */}
          {!editMode && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="prose max-w-none">
                {thread.content}
              </div>
            </div>
          )}

          {/* Moderator controls */}
          {canModerate && (
            <ModeratorControls
              showModerationPanel={showModerationPanel}
              onToggleModerationPanel={() => setShowModerationPanel(!showModerationPanel)}
              threadId={thread.id}
              isPinned={thread.is_pinned}
              isLocked={thread.is_locked}
              onThreadUpdate={handleThreadUpdate}
            />
          )}

          {/* Posts */}
          <div className="space-y-6">
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

          {/* Reply form */}
          {user && thread && (
            <div className="mt-6">
              <ReplyForm
                threadId={thread.id}
                onReplySubmitted={handleThreadUpdate}
                isThreadLocked={thread.is_locked}
              />
            </div>
          )}

          {/* Delete confirmation dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Thread</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this thread? This action cannot be undone.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteThread} disabled={isLoading}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />

      {/* Loading overlay */}
      {isLoading && <ThreadLoadingOverlay />}
    </div>
  );
};

export default ForumThread;
