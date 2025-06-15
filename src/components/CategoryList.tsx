
import CategoryCard from "./CategoryCard";

interface Category {
  id: number;
  name: string;
  description: string;
  threads: number;
  posts: number;
  color: string;
  lastActivity: string;
}

interface CategoryListProps {
  categories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

const CategoryList = ({ categories, onCategorySelect }: CategoryListProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Forum Categories</h2>
        <p className="text-gray-600">Choose a category to explore discussions and share your experiences.</p>
      </div>
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          onSelect={onCategorySelect} 
        />
      ))}
    </div>
  );
};

export default CategoryList;
