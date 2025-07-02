import CategoryCard from "./CategoryCard";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type DatabaseCategory = Database["public"]["Tables"]["categories"]["Row"];

interface Category extends DatabaseCategory {
  threads: number;
  posts: number;
  color?: string;
  updated_at?: string;
}

interface CategoryListProps {
  categories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

const CategoryList = ({ categories, onCategorySelect }: CategoryListProps) => {
  // Sort categories by thread count in descending order
  const sortedCategories = [...categories].sort((a, b) => b.threads - a.threads);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Forum Categories</h2>
        <p className="text-gray-600 mb-4">Choose a category to explore discussions and share your experiences.</p>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 gap-4">
        {sortedCategories.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            onSelect={onCategorySelect} 
          />
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-600">There are no forum categories available at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoryList;
