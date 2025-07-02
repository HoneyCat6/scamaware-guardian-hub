import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";

interface ReplyFormProps {
  threadId: number;
  onReplySubmitted: () => void;
  isThreadLocked?: boolean;
}

const ReplyForm = ({ threadId, onReplySubmitted, isThreadLocked }: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isThreadLocked) {
      toast({
        title: "Thread is locked",
        description: "You cannot reply to a locked thread.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your reply.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to reply.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          thread_id: threadId,
          author_id: user.id,
          content: content.trim()
        });

      if (error) throw error;

      setContent("");
      onReplySubmitted();
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully."
      });
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isThreadLocked) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
        <p className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          This thread is locked. No new replies can be added.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        className="min-h-[100px]"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="flex items-center gap-1"
      >
        {isSubmitting ? "Posting..." : "Post Reply"}
      </Button>
    </form>
  );
};

export default ReplyForm;
