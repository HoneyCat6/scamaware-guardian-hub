
import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForumStats from "@/components/ForumStats";
import CategoryList from "@/components/CategoryList";
import ThreadList from "@/components/ThreadList";
import ForumNavigation from "@/components/ForumNavigation";
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

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setActiveTab('categories');
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
          <ForumStats 
            totalMembers={1247}
            totalThreads={totalThreads}
            totalPosts={totalPosts}
          />

          {/* Navigation Bar */}
          <ForumNavigation 
            activeTab={activeTab}
            selectedCategory={selectedCategory}
            selectedCategoryName={getSelectedCategoryName()}
            canCreateThreads={canCreateThreads}
            isLoading={isLoading}
            onTabChange={handleTabChange}
            onClearCategory={handleClearCategory}
          />

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading forum content...</p>
            </div>
          ) : (
            <>
              {/* Forum Categories View */}
              {activeTab === 'categories' && (
                <CategoryList 
                  categories={updatedCategories}
                  onCategorySelect={handleCategorySelect}
                />
              )}

              {/* Recent Threads View */}
              {activeTab === 'recent' && (
                <ThreadList 
                  threads={filteredThreads}
                  selectedCategory={selectedCategory}
                  selectedCategoryName={getSelectedCategoryName()}
                  canCreateThreads={canCreateThreads}
                  canModerate={canModerate}
                  formatTimeAgo={formatTimeAgo}
                />
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
