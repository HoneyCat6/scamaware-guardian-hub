
import { MessageSquare, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    description: string;
    threads: number;
    posts: number;
    color: string;
    lastActivity: string;
  };
  onSelect: (categoryId: number) => void;
}

const CategoryCard = ({ category, onSelect }: CategoryCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1" onClick={() => onSelect(category.id)}>
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
              onSelect(category.id);
            }}
            className="ml-4"
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
