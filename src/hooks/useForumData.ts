
import { useMemo } from "react";
import { threadData } from "@/data/threadData";
import { forumCategories } from "@/data/forumCategories";

export const useForumData = (selectedCategory: number | null, searchQuery: string) => {
  // Calculate category statistics from thread data
  const categorizedThreads = Object.values(threadData);
  
  const updatedCategories = useMemo(() => {
    return forumCategories.map(category => {
      const categoryThreads = categorizedThreads.filter(thread => thread.category === category.name);
      const categoryPosts = categoryThreads.reduce((total, thread) => total + thread.posts.length, 0);
      
      return {
        ...category,
        threads: categoryThreads.length,
        posts: categoryPosts
      };
    });
  }, [categorizedThreads]);

  const totalThreads = categorizedThreads.length;
  const totalPosts = categorizedThreads.reduce((total, thread) => total + thread.posts.length, 0);

  // Filter threads by selected category and search query
  const filteredThreads = useMemo(() => {
    let threads = selectedCategory 
      ? categorizedThreads.filter(thread => {
          const category = updatedCategories.find(cat => cat.id === selectedCategory);
          return category && thread.category === category.name;
        })
      : categorizedThreads.sort((a, b) => b.id - a.id);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      threads = threads.filter(thread => 
        thread.title.toLowerCase().includes(query) ||
        thread.content.toLowerCase().includes(query) ||
        thread.author.toLowerCase().includes(query)
      );
    }

    return threads;
  }, [selectedCategory, searchQuery, categorizedThreads, updatedCategories]);

  return {
    updatedCategories,
    totalThreads,
    totalPosts,
    filteredThreads
  };
};
