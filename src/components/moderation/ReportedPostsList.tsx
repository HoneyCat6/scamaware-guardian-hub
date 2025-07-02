import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

type ReportedPost = {
  id: number;
  content: string;
  author_id: string;
  author: {
    username: string;
  };
  created_at: string;
  thread_id: number;
  thread: {
    title: string;
  };
  report_count: number;
};

type SupabaseResponse = {
  id: number;
  content: string;
  created_at: string;
  author_id: string;
  author: {
    username: string;
  };
  thread_id: number;
  thread: {
    title: string;
  };
  report_count: number;
};

const ReportedPostsList = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const fetchReportedPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          author_id,
          author:profiles!posts_author_id_fkey(username),
          thread_id,
          thread:threads!posts_thread_id_fkey(title),
          report_count
        `)
        .gt('report_count', 0)
        .order('report_count', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our ReportedPost type
      const transformedPosts = (data as unknown as SupabaseResponse[]).map(post => ({
        id: post.id,
        content: post.content,
        author_id: post.author_id,
        author: post.author,
        created_at: post.created_at,
        thread_id: post.thread_id,
        thread: post.thread,
        report_count: post.report_count
      }));

      setReportedPosts(transformedPosts);
    } catch (err) {
      console.error('Error fetching reported posts:', err);
      toast({
        title: "Error",
        description: "Failed to load reported posts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePost = async (postId: number) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('posts')
        .update({ 
          report_count: 0,
          is_reported: false,
          reviewed_at: new Date().toISOString(),
          reviewer_id: user?.id
        })
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Post approved",
        description: "The reported post has been reviewed and approved.",
      });
      
      // Refresh the list
      fetchReportedPosts();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePost = async (postId: number) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Post removed",
        description: "The reported post has been removed from the forum.",
      });
      
      // Refresh the list
      fetchReportedPosts();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId: string, username: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: true,
          banned_at: new Date().toISOString(),
          banned_by: user.id
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: "User banned",
        description: `User ${username} has been banned from the forum.`,
      });
      
      // Refresh the list
      fetchReportedPosts();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && reportedPosts.length === 0) {
    return <div className="text-center py-8">Loading reported posts...</div>;
  }

  if (reportedPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reported posts to review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportedPosts.map((post) => (
        <Card key={post.id} className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{post.author.username}</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    {post.report_count} report{post.report_count !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Thread: <span className="font-medium">{post.thread.title}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-white rounded border">
              <p className="text-gray-700">{post.content}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportedPostsList;
