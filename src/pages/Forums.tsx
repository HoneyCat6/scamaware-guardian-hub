
import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Clock, Plus, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

// Mock forum data
const forumCategories = [
  {
    id: 1,
    name: "Scam Reports",
    description: "Report and discuss new scams you've encountered",
    threads: 45,
    posts: 234,
    color: "bg-red-100 text-red-600"
  },
  {
    id: 2,
    name: "Prevention Tips",
    description: "Share and learn scam prevention strategies",
    threads: 32,
    posts: 186,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 3,
    name: "Support & Recovery",
    description: "Support for scam victims and recovery advice",
    threads: 28,
    posts: 142,
    color: "bg-green-100 text-green-600"
  },
  {
    id: 4,
    name: "General Discussion",
    description: "General cybersecurity and safety discussions",
    threads: 67,
    posts: 398,
    color: "bg-purple-100 text-purple-600"
  }
];

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
  }
];

const Forums = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'categories' | 'recent'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check user permissions
  const canCreateThreads = Boolean(user);
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');
  const isAdmin = user && user.role === 'admin';

  const handleTabChange = (tab: 'categories' | 'recent') => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedCategory(null); // Reset category selection when switching tabs
      setActiveTab(tab);
      // Simulate loading time
      setTimeout(() => setIsLoading(false), 200);
    } catch (err) {
      setError('Failed to load forum data');
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedCategory(categoryId);
      setActiveTab('recent'); // Switch to recent view when category is selected
      // Simulate loading time
      setTimeout(() => setIsLoading(false), 300);
    } catch (err) {
      setError('Failed to load category threads');
      setIsLoading(false);
    }
  };

  // Filter threads by selected category
  const filteredThreads = selectedCategory 
    ? recentThreads.filter(thread => {
        const category = forumCategories.find(cat => cat.id === selectedCategory);
        return category && thread.category === category.name;
      })
    : recentThreads;

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const category = forumCategories.find(cat => cat.id === selectedCategory);
    return category?.name;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Forums</h1>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Forums</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with others, share experiences, and learn from our community of scam-awareness advocates.
          </p>
          {canModerate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                You have {user?.role} privileges. You can moderate discussions and manage content.
              </p>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
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
              <Button
                variant={activeTab === 'categories' ? 'default' : 'outline'}
                onClick={() => handleTabChange('categories')}
                disabled={isLoading}
              >
                Categories
              </Button>
              <Button
                variant={activeTab === 'recent' ? 'default' : 'outline'}
                onClick={() => handleTabChange('recent')}
                disabled={isLoading}
              >
                {selectedCategory ? `${getSelectedCategoryName()} Threads` : 'Recent Threads'}
              </Button>
              {selectedCategory && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory(null);
                    setActiveTab('categories');
                  }}
                  disabled={isLoading}
                >
                  Back to All Categories
                </Button>
              )}
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
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Forum Categories */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  {forumCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1" onClick={() => handleCategorySelect(category.id)}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]}`}></div>
                              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                            </div>
                            <p className="text-gray-600 mb-3">{category.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>{category.threads} threads</span>
                              <span>{category.posts} posts</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategorySelect(category.id);
                              }}
                              title={`View threads in ${category.name}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Recent Threads */}
              {activeTab === 'recent' && (
                <div className="space-y-4">
                  {selectedCategory && (
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {getSelectedCategoryName()} - Recent Threads
                      </h2>
                      <p className="text-gray-600">
                        Showing threads from the {getSelectedCategoryName()} category
                      </p>
                    </div>
                  )}
                  {filteredThreads.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Threads Found</h3>
                        <p className="text-gray-600 mb-4">
                          {selectedCategory 
                            ? `No threads found in the ${getSelectedCategoryName()} category.`
                            : 'No recent threads available at the moment.'
                          }
                        </p>
                        {canCreateThreads && (
                          <Link to="/forums/create-thread">
                            <Button>Create First Thread</Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    filteredThreads.map((thread) => (
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
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Login Prompt for Guests */}
          {!user && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-center">Join the Discussion</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
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

export default Forums;
