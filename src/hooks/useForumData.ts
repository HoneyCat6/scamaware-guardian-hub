import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DatabaseThread = Database["public"]["Tables"]["threads"]["Row"];
type DatabaseCategory = Database["public"]["Tables"]["categories"]["Row"];

interface Thread extends DatabaseThread {
  author: { username: string };
  posts: { count: number }[];
  last_post_at?: string;
  is_reported?: boolean;
}

interface Category extends DatabaseCategory {
  threads: number;
  posts: number;
}

export const useForumData = (selectedCategory: number | null, searchQuery: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  // Fetch categories and threads
  useEffect(() => {
    const fetchForumData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("id");

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          throw new Error("Failed to fetch categories");
        }

        // Fetch threads with author and post count
        const { data: threadsData, error: threadsError } = await supabase
          .from("threads")
          .select(`
            *,
            author:profiles(username),
            posts(count)
          `)
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false });

        if (threadsError) {
          console.error("Error fetching threads:", threadsError);
          throw new Error("Failed to fetch threads");
        }

        setCategories(categoriesData || []);
        setThreads(threadsData || []);
      } catch (err) {
        console.error("Forum data fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching forum data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForumData();

    // Set up real-time subscription for threads
    const threadsSubscription = supabase
      .channel("threads-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "threads"
        },
        async (payload) => {
          try {
            // For inserts and updates, fetch the complete thread data with relations
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const { data: threadData, error: threadError } = await supabase
                .from("threads")
                .select(`
                  *,
                  author:profiles(username),
                  posts(count)
                `)
                .eq("id", payload.new.id)
                .single();

              if (threadError) throw threadError;

              setThreads(currentThreads => {
                if (payload.eventType === "INSERT") {
                  return [threadData, ...currentThreads];
                } else {
                  return currentThreads.map(thread =>
                    thread.id === threadData.id ? threadData : thread
                  );
                }
              });
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

  // Calculate updated categories with thread and post counts
  const updatedCategories = useMemo(() => {
    return categories.map(category => {
      const categoryThreads = threads.filter(thread => thread.category_id === category.id);
      const categoryPosts = categoryThreads.reduce((total, thread) => 
        total + (thread.posts?.[0]?.count || 0), 0
      );
      
      return {
        ...category,
        threads: categoryThreads.length,
        posts: categoryPosts
      };
    });
  }, [categories, threads]);

  // Calculate totals
  const totalThreads = threads.length;
  const totalPosts = threads.reduce((total, thread) => 
    total + (thread.posts?.[0]?.count || 0), 0
  );

  // Calculate active threads (threads with posts in the last 24 hours)
  const activeThreads = threads.filter(thread => {
    const lastPostTime = thread.last_post_at || thread.created_at;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(lastPostTime) > twentyFourHoursAgo;
  }).length;

  // Calculate reported threads
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
        thread.author?.username.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, threads]);

  return {
    updatedCategories,
    totalThreads,
    totalPosts,
    activeThreads,
    reportedThreads,
    filteredThreads,
    isLoading,
    error
  };
};
