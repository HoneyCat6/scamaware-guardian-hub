
import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Clock, Plus, ArrowRight, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

// Mock recent threads data
const recentThreads = [
  {
    id: 1,
    title: "New Bitcoin Investment Scam Alert",
    author: "SafetyFirst",
    replies: 23,
    lastPost: "2 hours ago",
    category: "Scam Reports",
    isPinned: true
  },
  {
    id: 2,
    title: "How to identify fake tech support calls",
    author: "TechExpert",
    replies: 15,
    lastPost: "4 hours ago",
    category: "Prevention Tips",
    isPinned: false
  },
  {
    id: 3,
    title: "Received suspicious email from 'bank'",
    author: "NewUser123",
    replies: 8,
    lastPost: "6 hours ago",
    category: "Scam Reports",
    isPinned: false
  },
  {
    id: 4,
    title: "Recovery after falling for romance scam",
    author: "StayStrong",
    replies: 31,
    lastPost: "8 hours ago",
    category: "Support & Recovery",
    isPinned: false
  },
  {
    id: 5,
    title: "Best practices for online shopping safety",
    author: "SecureShop",
    replies: 19,
    lastPost: "1 day ago",
    category: "Prevention Tips",
    isPinned: false
  },
  {
    id: 6,
    title: "Phishing attempt through WhatsApp",
    author: "WarningBell",
    replies: 12,
    lastPost: "1 day ago",
    category: "Scam Reports",
    isPinned: false
  },
  {
    id: 7,
    title: "How to protect elderly family members",
    author: "FamilyFirst",
    replies: 27,
    lastPost: "2 days ago",
    category: "Prevention Tips",
    isPinned: false
  },
  {
    id: 8,
    title: "Fake charity scam during holidays",
    author: "GiveSafely",
    replies: 16,
    lastPost: "2 days ago",
    category: "Scam Reports",
    isPinned: false
  }
];

const RecentThreads = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreateThreads = Boolean(user);
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Recent Threads</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/forums">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Forums
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Recent Threads</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay up to date with the latest discussions and alerts from our community.
            </p>
            {canModerate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  You have {user?.role} privileges. You can moderate discussions and manage content.
                </p>
              </div>
            )}
          </div>

          {/* Forum Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,247</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">172</div>
                <div className="text-sm text-gray-600">Total Threads</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">960</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex space-x-2">
              <Link to="/forums">
                <Button variant="outline">
                  Categories
                </Button>
              </Link>
              <Button variant="default">
                Recent Threads
              </Button>
            </div>
            {canCreateThreads && (
              <Link to="/forums/create-thread">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Thread
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent threads...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentThreads.map((thread) => (
                <Card key={thread.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {thread.isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {thread.category}
                          </Badge>
                          {canModerate && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                              Mod Tools
                            </Badge>
                          )}
                        </div>
                        <Link to={`/forums/thread/${thread.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                            {thread.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{thread.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{thread.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{thread.lastPost}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/forums/thread/${thread.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Login Prompt for Guests */}
          {!user && (
            <Card className="mt-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Discussion</h3>
                <p className="text-gray-600 mb-4">
                  Sign up or log in to participate in our community discussions, create threads, and help others stay safe online.
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

export default RecentThreads;
