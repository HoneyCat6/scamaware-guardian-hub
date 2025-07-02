import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type DatabaseThread = Database["public"]["Tables"]["threads"]["Row"];
type DatabasePost = Database["public"]["Tables"]["posts"]["Row"];
type DatabaseCategory = Database["public"]["Tables"]["categories"]["Row"];

interface ThreadAuthor {
  username: string;
}

export interface Thread extends DatabaseThread {
  author: ThreadAuthor;
  posts: DatabasePost[];
  last_post_at?: string;
  is_reported?: boolean;
}

export interface Post extends DatabasePost {
  author: {
    username: string;
  };
}

export interface Category extends DatabaseCategory {
  threads: number;
  posts: number;
}

export const useForumData = (selectedCategory: number | null = null, searchQuery: string = "") => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("id");

        if (categoriesError) throw categoriesError;

        const { data: threadsData, error: threadsError } = await supabase
          .from("threads")
          .select(`
            *,
            author:profiles(username),
            posts:posts(*)
          `)
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false });

        if (threadsError) throw threadsError;

        // Transform the data to match our interfaces
        const transformedCategories = (categoriesData || []).map((category) => ({
          ...category,
          threads: 0,
          posts: 0
        }));

        const transformedThreads = (threadsData || []).map((thread) => {
          const threadPosts = Array.isArray(thread.posts) ? thread.posts : [];
          const authorData = typeof thread.author === 'object' && thread.author !== null 
            ? thread.author as unknown as { username: string } 
            : null;
          return {
            ...thread,
            author: {
              username: authorData?.username || "Unknown"
            },
            posts: threadPosts,
            last_post_at: threadPosts.length 
              ? threadPosts[threadPosts.length - 1].created_at 
              : thread.created_at,
            is_reported: false
          };
        });

        setCategories(transformedCategories);
        setThreads(transformedThreads);
      } catch (err) {
        console.error("Error fetching forum data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription for threads
    const threadsSubscription = supabase
      .channel('threads-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threads'
        },
        async (payload) => {
          try {
            if (payload.eventType === "INSERT") {
              // Fetch the complete thread data with author and posts
              const { data: newThread, error: threadError } = await supabase
                .from("threads")
                .select(`
                  *,
                  author:profiles(username),
                  posts:posts(*)
                `)
                .eq("id", payload.new.id)
                .single();

              if (threadError) throw threadError;

              // Transform the new thread
              const threadPosts = Array.isArray(newThread.posts) ? newThread.posts : [];
              const authorData = typeof newThread.author === 'object' && newThread.author !== null 
                ? newThread.author as unknown as { username: string } 
                : null;

              const transformedThread: Thread = {
                ...newThread,
                author: {
                  username: authorData?.username || "Unknown"
                },
                posts: threadPosts,
                last_post_at: threadPosts.length 
                  ? threadPosts[threadPosts.length - 1].created_at 
                  : newThread.created_at,
                is_reported: false
              };

              setThreads(currentThreads => [transformedThread, ...currentThreads]);
            } else if (payload.eventType === "UPDATE") {
              setThreads(currentThreads =>
                currentThreads.map(thread =>
                  thread.id === payload.new.id
                    ? { ...thread, ...payload.new }
                    : thread
                )
              );
            } else if (payload.eventType === "DELETE") {
              setThreads(currentThreads =>
                currentThreads.filter(thread => thread.id !== payload.old.id)
              );
            }
          } catch (err) {
            console.error("Error handling thread subscription update:", err);
          }
        }
      )
      .subscribe();

    return () => {
      threadsSubscription.unsubscribe();
    };
  }, []);

  const addThread = (newThread: Thread) => {
    setThreads((currentThreads) => [
      ...currentThreads,
      {
        ...newThread,
        posts: newThread.posts || [],
        last_post_at: newThread.created_at,
        is_reported: false
      }
    ]);
  };

  const updateThread = (updatedThread: Thread) => {
    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === updatedThread.id
          ? {
              ...updatedThread,
              posts: updatedThread.posts || thread.posts,
              last_post_at: updatedThread.posts?.length
                ? updatedThread.posts[updatedThread.posts.length - 1].created_at
                : updatedThread.created_at,
              is_reported: updatedThread.is_reported || false
            }
          : thread
      )
    );
  };

  const deleteThread = (threadId: number) => {
    setThreads((currentThreads) =>
      currentThreads.filter((thread) => thread.id !== threadId)
    );
  };

  // Calculate statistics
  const updatedCategories = useMemo(() => {
    return categories.map(category => {
      const categoryThreads = threads.filter(thread => thread.category_id === category.id);
      const categoryPosts = categoryThreads.reduce((total, thread) => total + thread.posts.length, 0);
      return {
        ...category,
        threads: categoryThreads.length,
        posts: categoryPosts
      };
    });
  }, [categories, threads]);

  const totalThreads = threads.length;
  const totalPosts = threads.reduce((total, thread) => total + thread.posts.length, 0);
  const activeThreads = threads.filter(thread => !thread.is_locked).length;
  const reportedThreads = threads.filter(thread => thread.is_reported).length;

  // Filter threads by selected category and search query
  const filteredThreads = useMemo(() => {
    let filtered = selectedCategory
      ? threads.filter(thread => thread.category_id === selectedCategory)
      : threads;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(thread =>
        thread.title.toLowerCase().includes(query) ||
        thread.content.toLowerCase().includes(query) ||
        thread.author.username.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, threads]);

  return {
    categories: updatedCategories,
    threads,
    isLoading,
    error,
    addThread,
    updateThread,
    deleteThread,
    updatedCategories,
    totalThreads,
    totalPosts,
    activeThreads,
    reportedThreads,
    filteredThreads
  };
};
