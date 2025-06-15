
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThreadErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

const ThreadErrorDisplay = ({ error, onDismiss }: ThreadErrorDisplayProps) => {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      <div>
        <p className="text-red-800 font-medium">Error</p>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDismiss}
        className="ml-auto"
      >
        Dismiss
      </Button>
    </div>
  );
};

export default ThreadErrorDisplay;
