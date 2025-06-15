
import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Eye, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { threadData, Post } from "@/data/threadData";

const ModerationPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get all reported posts
  const getReportedPosts = () => {
    const reportedPosts: Array<Post & { threadId: number; threadTitle: string }> = [];
    
    Object.values(threadData).forEach(thread => {
      thread.posts.forEach(post => {
        if (post.isReported) {
          reportedPosts.push({
            ...post,
            threadId: thread.id,
            threadTitle: thread.title
          });
        }
      });
    });
    
    return reportedPosts.sort((a, b) => b.reportCount - a.reportCount);
  };

  const reportedPosts = getReportedPosts();

  const handleApprovePost = async (postId: number) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Post approved",
        description: "The reported post has been reviewed and approved.",
      });
      
      console.log(`Approved post ${postId}`);
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Post removed",
        description: "The reported post has been removed from the forum.",
      });
      
      console.log(`Removed post ${postId}`);
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

  const handleBanUser = async (username: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "User banned",
        description: `User ${username} has been banned from the forum.`,
      });
      
      console.log(`Banned user ${username}`);
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

  if (reportedPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Moderation Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">No reported posts require moderation at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Moderation Queue
          <Badge variant="destructive" className="ml-2">
            {reportedPosts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportedPosts.map((post) => (
            <Card key={post.id} className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{post.author}</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {post.reportCount} report{post.reportCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Thread: <span className="font-medium">{post.threadTitle}</span>
                    </p>
                    <p className="text-sm text-gray-500">{post.createdAt}</p>
                  </div>
                </div>
                
                <div className="mb-4 p-3 bg-white rounded border">
                  <p className="text-gray-700">{post.content}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/forums/thread/${post.threadId}`, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View in Thread
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprovePost(post.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemovePost(post.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Remove Post
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBanUser(post.author)}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Ban className="w-4 h-4" />
                    Ban User
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationPanel;
