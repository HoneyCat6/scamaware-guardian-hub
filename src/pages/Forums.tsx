
import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Clock, Plus, ArrowRight, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { threadData } from "@/data/threadData";

// Forum categories with better organization
const forumCategories = [
  {
    id: 1,
    name: "Scam Reports",
    description: "Report and discuss new scams you've encountered",
    threads: 0,
    posts: 0,
    color: "bg-red-100 text-red-600",
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    name: "Prevention Tips",
    description: "Share and learn scam prevention strategies",
    threads: 0,
    posts: 0,
    color: "bg-blue-100 text-blue-600",
    lastActivity: "4 hours ago"
  },
  {
    id: 3,
    name: "Support & Recovery",
    description: "Support for scam victims and recovery advice",
    threads: 0,
    posts: 0,
    color: "bg-green-100 text-green-600",
    lastActivity: "8 hours ago"
  },
  {
    id: 4,
    name: "General Discussion",
    description: "General cybersecurity and safety discussions",
    threads: 0,
    posts: 0,
    color: "bg-purple-100 text-purple-600",
    lastActivity: "1 day ago"
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

  // Calculate category statistics from thread data
  const categorizedThreads = Object.values(threadData);
  const updatedCategories = forumCategories.map(category => {
    const categoryThreads = categorizedThreads.filter(thread => thread.category === category.name);
    const categoryPosts = categoryThreads.reduce((total, thread) => total + thread.posts.length, 0);
    
    return {
      ...category,
      threads: categoryThreads.length,
      posts: categoryPosts
    };
  });

  const totalThreads = categorizedThreads.length;
  const totalPosts = categorizedThreads.reduce((total, thread) => total + thread.posts.length, 0);

  const handleTabChange = (tab: 'categories' | 'recent') => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedCategory(null);
      setActiveTab(tab);
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
      setActiveTab('recent');
      setTimeout(() => setIsLoading(false), 300);
    } catch (err) {
      setError('Failed to load category threads');
      setIsLoading(false);
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  // Filter threads by selected category
  const filteredThreads = selectedCategory 
    ? categorizedThreads.filter(thread => {
        const category = updatedCategories.find(cat => cat.id === selectedCategory);
        return category && thread.category === category.name;
      })
    : categorizedThreads.sort((a, b) => b.id - a.id); // Sort by newest first

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const category = updatedCategories.find(cat => cat.id === selectedCategory);
    return category?.name;
  };

  const formatTimeAgo = (timeStr: string) => {
    // This would normally calculate actual time difference
    return timeStr;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-600">Error Loading Forums</h1>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" onClick={handleClearError}>
                Dismiss Error
              </Button>
            </div>
          </div>
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
                <div className="text-2xl font-bold text-gray-900">{totalThreads}</div>
                <div className="text-sm text-gray-600">Total Threads</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Bar */}
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
                  ← Back to Categories
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Link to="/forums/recent">
                <Button variant="outline">
                  View All Recent
                </Button>
              </Link>
              {canCreateThreads && (
                <Link to="/forums/create-thread">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Thread
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading forum content...</p>
            </div>
          ) : (
            <>
              {/* Forum Categories View */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Forum Categories</h2>
                    <p className="text-gray-600">Choose a category to explore discussions and share your experiences.</p>
                  </div>
                  {updatedCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1" onClick={() => handleCategorySelect(category.id)}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-4 h-4 rounded-full ${category.color.split(' ')[0]}`}></div>
                              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {category.threads} threads
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{category.threads} threads</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{category.posts} posts</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Last activity: {category.lastActivity}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategorySelect(category.id);
                            }}
                            className="ml-4"
                            title={`Browse ${category.name} discussions`}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Recent Threads View */}
              {activeTab === 'recent' && (
                <div className="space-y-4">
                  {selectedCategory && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {getSelectedCategoryName()} Discussions
                      </h2>
                      <p className="text-gray-600">
                        Showing {filteredThreads.length} thread{filteredThreads.length !== 1 ? 's' : ''} from the {getSelectedCategoryName()} category
                      </p>
                    </div>
                  )}
                  
                  {filteredThreads.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Threads Found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          {selectedCategory 
                            ? `No discussions found in the ${getSelectedCategoryName()} category yet.`
                            : 'No recent threads available at the moment.'
                          }
                        </p>
                        {canCreateThreads && (
                          <Link to="/forums/create-thread">
                            <Button className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Start the First Discussion
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredThreads.map((thread) => (
                        <Card key={thread.id} className="hover:shadow-lg transition-shadow duration-200">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  {thread.isPinned && (
                                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                      📌 Pinned
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {thread.category}
                                  </Badge>
                                  {canModerate && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                      Mod Tools
                                    </Badge>
                                  )}
                                </div>
                                <Link to={`/forums/thread/${thread.id}`}>
                                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                    {thread.title}
                                  </h3>
                                </Link>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {thread.content}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{thread.author}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{thread.posts.length} {thread.posts.length === 1 ? 'reply' : 'replies'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTimeAgo(thread.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <Link to={`/forums/thread/${thread.id}`}>
                                <Button variant="ghost" size="sm" className="ml-4">
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Login Prompt for Guests */}
          {!user && (
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="text-center text-xl">Join Our Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Sign up or log in to participate in discussions, create threads, and help others stay safe online.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/login">
                    <Button variant="outline" size="lg">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg">Sign Up</Button>
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
