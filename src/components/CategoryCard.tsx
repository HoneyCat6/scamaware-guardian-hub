import { MessageSquare, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type DatabaseCategory = Database["public"]["Tables"]["categories"]["Row"];

interface Category extends DatabaseCategory {
  threads: number;
  posts: number;
  color?: string;
  updated_at?: string;
}

interface CategoryCardProps {
  category: Category;
  onSelect: (categoryId: number) => void;
}

const CategoryCard = ({ category, onSelect }: CategoryCardProps) => {
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

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
      onClick={() => onSelect(category.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Thread Count Badge */}
          <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{category.threads}</span>
            <span className="text-xs text-blue-600">Threads</span>
          </div>

          {/* Category Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${category.color || 'bg-gray-400'}`}></div>
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-2">{category.description || 'No description available'}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{category.posts} posts</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Updated {formatTimeAgo(category.updated_at || '')}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(category.id);
            }}
            className="flex-shrink-0"
            title={`Browse ${category.name} discussions`}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
