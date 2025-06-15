import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, User, Clock, ThumbsUp, Flag, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Mock thread data
const threadData = {
  1: {
    id: 1,
    title: "New Bitcoin Investment Scam Alert",
    author: "SafetyFirst",
    createdAt: "2 days ago",
    category: "Scam Reports",
    isPinned: true,
    content: "I've been seeing a lot of reports about a new Bitcoin investment scam that's targeting people through social media ads. The scammers are promising guaranteed returns of 300% in just 30 days. They're using fake celebrity endorsements and creating convincing but fraudulent websites. Please be aware and share this with others who might be vulnerable to these types of scams.",
    posts: [
      {
        id: 1,
        author: "CyberGuard",
        content: "Thanks for sharing this! I've seen similar ads on Facebook. The websites they create look very professional, which makes them even more dangerous.",
        createdAt: "2 days ago",
        likes: 5
      },
      {
        id: 2,
        author: "AlertUser",
        content: "My elderly neighbor almost fell for this exact scam. Thankfully I was able to warn her in time. These scammers are getting more sophisticated.",
        createdAt: "1 day ago",
        likes: 8
      },
      {
        id: 3,
        author: "TechSavvy",
        content: "I've reported several of these fake ads to the social media platforms. Everyone should do the same when they see them!",
        createdAt: "1 day ago",
        likes: 3
      }
    ]
  }
};

const ForumThread = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert string id to number and safely access threadData
  const threadId = id ? parseInt(id, 10) : null;
  const thread = threadId && threadData[threadId as keyof typeof threadData] ? threadData[threadId as keyof typeof threadData] : null;

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

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thread Not Found</h1>
          <Link to="/forums">
            <Button>Back to Forums</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/forums">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Forums
              </Button>
            </Link>
          </div>

          {/* Thread Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {thread.isPinned && (
                      <Badge variant="secondary">Pinned</Badge>
                    )}
                    <Badge variant="outline">{thread.category}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{thread.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{thread.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{thread.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.posts.length} replies</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{thread.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-4 mb-8">
            {thread.posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{post.author}</div>
                        <div className="text-sm text-gray-500">{post.createdAt}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          {user ? (
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
          ) : (
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
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForumThread;
