
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
}

const ReplyForm = ({ onSubmit }: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post replies.",
        variant: "destructive",
      });
      return;
    }

    if (user.isBanned) {
      toast({
        title: "Account suspended",
        description: "Your account has been banned and cannot post replies.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your reply.",
        variant: "destructive",
      });
      return;
    }

    if (content.length > 2000) {
      toast({
        title: "Content too long",
        description: "Please keep your reply under 2000 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent("");
      toast({
        title: "Reply posted",
        description: "Your reply has been successfully posted.",
      });
    } catch (error) {
      toast({
        title: "Error posting reply",
        description: error instanceof Error ? error.message : "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please log in to post a reply.</p>
            <Button variant="outline">
              Log In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user.isBanned) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">Account Suspended</p>
            <p className="text-red-600 text-sm">
              Your account has been banned and cannot post replies.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reply-content" className="block text-sm font-medium text-gray-700 mb-2">
              Post a Reply
            </label>
            <Textarea
              id="reply-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/2000 characters
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReplyForm;
