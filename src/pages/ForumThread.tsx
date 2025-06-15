
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThreadHeader from "@/components/ThreadHeader";
import ThreadPost from "@/components/ThreadPost";
import ReplyForm from "@/components/ReplyForm";
import { threadData } from "@/data/threadData";

const ForumThread = () => {
  const { id } = useParams();

  // Convert string id to number and safely access threadData
  const threadId = id ? parseInt(id, 10) : null;
  const thread = threadId && threadData[threadId as keyof typeof threadData] ? threadData[threadId as keyof typeof threadData] : null;

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
          <ThreadHeader thread={thread} />

          {/* Posts */}
          <div className="space-y-4 mb-8">
            {thread.posts.map((post) => (
              <ThreadPost key={post.id} post={post} />
            ))}
          </div>

          {/* Reply Form */}
          <ReplyForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForumThread;
