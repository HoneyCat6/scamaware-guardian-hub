import type { Database } from "@/integrations/supabase/types";

export type Thread = Database["public"]["Tables"]["threads"]["Row"] & {
  author: { username: string };
  category: { name: string };
  _count: { posts: number };
};

export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
}; 