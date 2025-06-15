
import { useState } from "react";
import { Link } from "react-router-dom";
import { Reply, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ReplyFormProps {
  onSubmit?: (content: string) => Promise<void>;
  placeholder?: string;
}

const ReplyForm = ({ onSubmit, placeholder = "Share your thoughts, experiences, or advice..." }: ReplyFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to post replies.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.trim()) {
      setError("Please enter a message before posting.");
      return;
    }

    if (newPost.trim().length < 10) {
      setError("Your message must be at least 10 characters long.");
      return;
    }

    if (newPost.trim().length > 5000) {
      setError("Your message is too long. Please keep it under 5000 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      if (onSubmit) {
        await onSubmit(newPost.trim());
      } else {
        // Default behavior - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Post submitted!",
        description: "Your reply has been added to the thread.",
      });
      
      setNewPost("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit your reply. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Post a Reply</h3>
          {user.role === 'moderator' || user.role === 'admin' ? (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {user.role === 'admin' ? 'Admin' : 'Moderator'}
            </span>
          ) : null}
        </div>
        
        <form onSubmit={handleSubmitPost}>
          <div className="mb-4">
            <Textarea
              value={newPost}
              onChange={(e) => {
                setNewPost(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              rows={4}
              className={error ? "border-red-500 focus:border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{newPost.length}/5000 characters</span>
              {newPost.trim().length > 0 && newPost.trim().length < 10 && (
                <span className="text-yellow-600">Minimum 10 characters required</span>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newPost.trim() || newPost.trim().length < 10}
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
