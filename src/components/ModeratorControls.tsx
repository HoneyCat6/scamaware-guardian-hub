
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModeratorControlsProps {
  showModerationPanel: boolean;
  onToggleModerationPanel: () => void;
}

const ModeratorControls = ({ showModerationPanel, onToggleModerationPanel }: ModeratorControlsProps) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-blue-800 font-medium mb-2">Moderator Controls</p>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          Pin Thread
        </Button>
        <Button variant="outline" size="sm">
          Lock Thread
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleModerationPanel}
          className="flex items-center gap-1"
        >
          <Shield className="w-4 h-4" />
          {showModerationPanel ? 'Hide' : 'Show'} Moderation Panel
        </Button>
        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
          Delete Thread
        </Button>
      </div>
    </div>
  );
};

export default ModeratorControls;
