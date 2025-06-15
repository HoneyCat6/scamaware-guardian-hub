
import { useState } from "react";
import { Link } from "react-router-dom";
import { Reply } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ReplyForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Post submitted!",
      description: "Your reply has been added to the thread.",
    });
    
    setNewPost("");
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Discussion</h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to reply to this thread.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Post a Reply</h3>
        <form onSubmit={handleSubmitPost}>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts, experiences, or advice..."
            rows={4}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newPost.trim()}
              className="flex items-center gap-2"
            >
              <Reply className="w-4 h-4" />
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReplyForm;
