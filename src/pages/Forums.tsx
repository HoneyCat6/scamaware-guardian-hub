import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForumStats from "@/components/ForumStats";
import CategoryList from "@/components/CategoryList";
import ThreadList from "@/components/ThreadList";
import ForumNavigation from "@/components/ForumNavigation";
import { useAuth } from "@/hooks/useAuth";
import { usePagination } from "@/hooks/usePagination";
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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter threads by selected category and search query
  const allFilteredThreads = useMemo(() => {
    let threads = selectedCategory 
      ? categorizedThreads.filter(thread => {
          const category = updatedCategories.find(cat => cat.id === selectedCategory);
          return category && thread.category === category.name;
        })
      : categorizedThreads.sort((a, b) => b.id - a.id);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      threads = threads.filter(thread => 
        thread.title.toLowerCase().includes(query) ||
        thread.content.toLowerCase().includes(query) ||
        thread.author.toLowerCase().includes(query)
      );
    }

    return threads;
  }, [selectedCategory, searchQuery, categorizedThreads, updatedCategories]);

  // Pagination setup
  const THREADS_PER_PAGE = 10;
  const {
    startIndex,
    endIndex,
    currentPage,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    goToPage,
    reset: resetPagination
  } = usePagination({
    totalItems: allFilteredThreads.length,
    itemsPerPage: THREADS_PER_PAGE
  });

  // Get current page threads
  const paginatedThreads = allFilteredThreads.slice(startIndex, endIndex);

  const handleTabChange = (tab: 'categories' | 'recent') => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedCategory(null);
      setSearchQuery("");
      setActiveTab(tab);
      resetPagination();
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
      setSearchQuery("");
      setActiveTab('recent');
      resetPagination();
      setTimeout(() => setIsLoading(false), 300);
    } catch (err) {
      setError('Failed to load category threads');
      setIsLoading(false);
    }
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setActiveTab('categories');
    resetPagination();
  };

  const handleClearError = () => {
    setError(null);
  };

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

          {/* Search Bar - Only show in recent threads view */}
          {activeTab === 'recent' && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2">
                  Found {allFilteredThreads.length} thread{allFilteredThreads.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
              )}
            </div>
          )}

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
                  threads={paginatedThreads}
                  selectedCategory={selectedCategory}
                  selectedCategoryName={getSelectedCategoryName()}
                  canCreateThreads={canCreateThreads}
                  canModerate={canModerate}
                  formatTimeAgo={formatTimeAgo}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  onNextPage={goToNext}
                  onPreviousPage={goToPrevious}
                  onGoToPage={goToPage}
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
