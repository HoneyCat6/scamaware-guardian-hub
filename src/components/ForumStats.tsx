import { MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type DatabaseCategory = Database["public"]["Tables"]["categories"]["Row"];

interface Category extends DatabaseCategory {
  threads: number;
  posts: number;
  color?: string;
  updated_at?: string;
}

interface ForumStatsProps {
  totalThreads: number;
  categories: Category[];
  isLoading?: boolean;
}

const ForumStats = ({ totalThreads, categories, isLoading = false }: ForumStatsProps) => {
  // Get top 3 most active categories
  const topCategories = [...categories]
    .sort((a, b) => b.threads - a.threads)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 text-center">
              <Skeleton className="w-8 h-8 mx-auto mb-2 rounded-full" />
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Threads Card */}
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalThreads}</div>
          <div className="text-sm text-gray-600">Total Threads</div>
        </CardContent>
      </Card>

      {/* Most Active Categories Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">Most Active Categories</span>
          </div>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${category.color || 'bg-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{category.threads}</span>
                </div>
              </div>
            ))}
            {topCategories.length === 0 && (
              <div className="text-center text-gray-500 text-sm">
                No active categories yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumStats;
