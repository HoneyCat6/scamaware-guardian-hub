import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ForumSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
  isLoading?: boolean;
}

const ForumSearch = ({ searchQuery, onSearchChange, resultsCount, isLoading = false }: ForumSearchProps) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
          disabled={isLoading}
        />
      </div>
      {searchQuery && (
        isLoading ? (
          <Skeleton className="h-5 w-48 mt-2" />
        ) : (
          <p className="text-sm text-gray-600 mt-2">
            Found {resultsCount} thread{resultsCount !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )
      )}
    </div>
  );
};

export default ForumSearch;
