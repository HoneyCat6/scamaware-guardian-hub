
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

  // Get forum data using custom hook
  const { updatedCategories, totalThreads, totalPosts, filteredThreads } = useForumData(selectedCategory, searchQuery);

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
    return <ForumError error={error} onClearError={handleClearError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ForumHeader canModerate={canModerate} userRole={user?.role} />

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
            <ForumSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultsCount={filteredThreads.length}
            />
          )}

          {isLoading ? (
            <ForumLoadingSpinner />
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
          {!user && <ForumGuestPrompt />}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Forums;
