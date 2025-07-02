import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForumStats from "@/components/ForumStats";
import CategoryList from "@/components/CategoryList";
import ThreadList from "@/components/ThreadList";
import ForumNavigation from "@/components/ForumNavigation";
import ForumSearch from "@/components/ForumSearch";
import ForumError from "@/components/ForumError";
import ForumHeader from "@/components/ForumHeader";
import ForumGuestPrompt from "@/components/ForumGuestPrompt";
import ForumLoadingSpinner from "@/components/ForumLoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { usePagination } from "@/hooks/usePagination";
import { useForumData } from "@/hooks/useForumData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const Forums = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'categories' | 'recent'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uiLoading, setUiLoading] = useState(false);

  // Check user permissions
  const canCreateThreads = Boolean(user);
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  // Get forum data using custom hook
  const { 
    updatedCategories, 
    totalThreads, 
    totalPosts, 
    activeThreads,
    reportedThreads,
    filteredThreads,
    isLoading: dataLoading,
    error: dataError
  } = useForumData(selectedCategory, searchQuery);

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
    totalItems: filteredThreads.length,
    itemsPerPage: THREADS_PER_PAGE
  });

  // Get current page threads
  const paginatedThreads = filteredThreads.slice(startIndex, endIndex);

  const handleTabChange = (tab: 'categories' | 'recent') => {
    try {
      setUiLoading(true);
      setSelectedCategory(null);
      setSearchQuery("");
      setActiveTab(tab);
      resetPagination();
      setTimeout(() => setUiLoading(false), 200);
    } catch (err) {
      console.error('Error changing tab:', err);
      setUiLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    try {
      setUiLoading(true);
      setSelectedCategory(categoryId);
      setSearchQuery("");
      setActiveTab('recent');
      resetPagination();
      setTimeout(() => setUiLoading(false), 300);
    } catch (err) {
      console.error('Error selecting category:', err);
      setUiLoading(false);
    }
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setActiveTab('categories');
    resetPagination();
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const category = updatedCategories.find(cat => cat.id === selectedCategory);
    return category?.name;
  };

  const formatTimeAgo = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="flex items-center justify-between">
                <span>Error loading forum data: {dataError}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="ml-4"
                >
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = dataLoading || uiLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ForumHeader canModerate={canModerate} userRole={user?.role} />

        <div className="max-w-6xl mx-auto">
          {/* Forum Stats */}
          <ForumStats 
            totalThreads={totalThreads}
            categories={updatedCategories}
            isLoading={isLoading}
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
            <div className="flex items-center gap-4 mb-6">
              <ForumSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultsCount={filteredThreads.length}
                isLoading={isLoading}
              />
              <div className="w-60 shrink-0">
                <select
                  value={selectedCategory ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') setSelectedCategory(null);
                    else setSelectedCategory(Number(val));
                  }}
                  className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="">All Categories</option>
                  {updatedCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Main Content */}
          {isLoading ? (
            <ForumLoadingSpinner />
          ) : activeTab === 'categories' ? (
            <CategoryList 
              categories={updatedCategories}
              onCategorySelect={handleCategorySelect}
            />
          ) : (
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

          {/* Guest Prompt */}
          {!user && !isLoading && (
            <ForumGuestPrompt />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Forums;
