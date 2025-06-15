
import { Link } from "react-router-dom";
import { MessageSquare, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thread } from "@/data/threadData";
import ThreadCard from "./ThreadCard";

interface ThreadListProps {
  threads: Thread[];
  selectedCategory: number | null;
  selectedCategoryName: string | null;
  canCreateThreads: boolean;
  canModerate: boolean;
  formatTimeAgo: (timeStr: string) => string;
}

const ThreadList = ({ 
  threads, 
  selectedCategory, 
  selectedCategoryName, 
  canCreateThreads,
  canModerate,
  formatTimeAgo 
}: ThreadListProps) => {
  if (threads.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Threads Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {selectedCategory 
              ? `No discussions found in the ${selectedCategoryName} category yet.`
              : 'No recent threads available at the moment.'
            }
          </p>
          {canCreateThreads && (
            <Link to="/forums/create-thread">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Start the First Discussion
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {selectedCategory && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedCategoryName} Discussions
          </h2>
          <p className="text-gray-600">
            Showing {threads.length} thread{threads.length !== 1 ? 's' : ''} from the {selectedCategoryName} category
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {threads.map((thread) => (
          <ThreadCard 
            key={thread.id} 
            thread={thread} 
            canModerate={canModerate}
            formatTimeAgo={formatTimeAgo}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreadList;
