
import { Link } from "react-router-dom";
import { MessageSquare, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thread } from "@/data/threadData";
import ThreadCard from "./ThreadCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ThreadListProps {
  threads: Thread[];
  selectedCategory: number | null;
  selectedCategoryName: string | null;
  canCreateThreads: boolean;
  canModerate: boolean;
  formatTimeAgo: (timeStr: string) => string;
  currentPage: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onGoToPage: (page: number) => void;
}

const ThreadList = ({ 
  threads, 
  selectedCategory, 
  selectedCategoryName, 
  canCreateThreads,
  canModerate,
  formatTimeAgo,
  currentPage,
  totalPages,
  canGoNext,
  canGoPrevious,
  onNextPage,
  onPreviousPage,
  onGoToPage
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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onGoToPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onGoToPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onGoToPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => onGoToPage(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {selectedCategory && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedCategoryName} Discussions
          </h2>
          <p className="text-gray-600">
            Showing page {currentPage} of {totalPages} ({threads.length} thread{threads.length !== 1 ? 's' : ''} from the {selectedCategoryName} category)
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={onPreviousPage}
                  className={`cursor-pointer ${!canGoPrevious ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={onNextPage}
                  className={`cursor-pointer ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default ThreadList;
