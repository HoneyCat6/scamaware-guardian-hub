
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ForumNavigationProps {
  activeTab: 'categories' | 'recent';
  selectedCategory: number | null;
  selectedCategoryName: string | null;
  canCreateThreads: boolean;
  isLoading: boolean;
  onTabChange: (tab: 'categories' | 'recent') => void;
  onClearCategory: () => void;
}

const ForumNavigation = ({
  activeTab,
  selectedCategory,
  selectedCategoryName,
  canCreateThreads,
  isLoading,
  onTabChange,
  onClearCategory
}: ForumNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'categories' ? 'default' : 'outline'}
          onClick={() => onTabChange('categories')}
          disabled={isLoading}
        >
          Categories
        </Button>
        <Button
          variant={activeTab === 'recent' ? 'default' : 'outline'}
          onClick={() => onTabChange('recent')}
          disabled={isLoading}
        >
          {selectedCategory ? `${selectedCategoryName} Threads` : 'Recent Threads'}
        </Button>
        {selectedCategory && (
          <Button
            variant="ghost"
            onClick={onClearCategory}
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
  );
};

export default ForumNavigation;
