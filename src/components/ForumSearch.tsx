
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ForumSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
}

const ForumSearch = ({ searchQuery, onSearchChange, resultsCount }: ForumSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {searchQuery && (
        <p className="text-sm text-gray-600 mt-2">
          Found {resultsCount} thread{resultsCount !== 1 ? 's' : ''} matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default ForumSearch;
