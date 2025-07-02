import { Shield, Pin, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ModeratorControlsProps {
  showModerationPanel: boolean;
  onToggleModerationPanel: () => void;
  threadId: number;
  isPinned: boolean;
  isLocked: boolean;
  onThreadUpdate: () => void;
}

const ModeratorControls = ({ 
  showModerationPanel, 
  onToggleModerationPanel,
  threadId,
  isPinned,
  isLocked,
  onThreadUpdate
}: ModeratorControlsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<{
    pin: boolean;
    lock: boolean;
    delete: boolean;
  }>({
    pin: false,
    lock: false,
    delete: false
  });

  const handlePinThread = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(prev => ({ ...prev, pin: true }));
    try {
      // First check if the user has moderator privileges
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('Failed to verify moderator status');
      if (!profile || !['moderator', 'admin'].includes(profile.role)) {
        throw new Error('You do not have permission to perform this action');
      }

      // Update thread pin status
      const { error: updateError } = await supabase
        .from('threads')
        .update({ 
          is_pinned: !isPinned,
          pinned_at: !isPinned ? new Date().toISOString() : null,
          pinned_by: !isPinned ? user.id : null
        })
        .eq('id', threadId);

      if (updateError) {
        console.error('Error updating thread:', updateError);
        throw new Error('Failed to update thread pin status');
      }

      toast({
        title: isPinned ? "Thread unpinned" : "Thread pinned",
        description: isPinned 
          ? "Thread has been unpinned successfully." 
          : "Thread has been pinned successfully."
      });

      onThreadUpdate();
    } catch (error) {
      console.error('Error updating thread pin status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update thread pin status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, pin: false }));
    }
  };

  const handleLockThread = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(prev => ({ ...prev, lock: true }));
    try {
      // First check if the user has moderator privileges
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('Failed to verify moderator status');
      if (!profile || !['moderator', 'admin'].includes(profile.role)) {
        throw new Error('You do not have permission to perform this action');
      }

      // Update thread lock status
      const { error: updateError } = await supabase
        .from('threads')
        .update({ 
          is_locked: !isLocked,
          locked_at: !isLocked ? new Date().toISOString() : null,
          locked_by: !isLocked ? user.id : null
        })
        .eq('id', threadId);

      if (updateError) {
        console.error('Error updating thread:', updateError);
        throw new Error('Failed to update thread lock status');
      }

      toast({
        title: isLocked ? "Thread unlocked" : "Thread locked",
        description: isLocked 
          ? "Thread has been unlocked successfully." 
          : "Thread has been locked successfully."
      });

      onThreadUpdate();
    } catch (error) {
      console.error('Error updating thread lock status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update thread lock status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, lock: false }));
    }
  };

  const handleDeleteThread = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      return;
    }

    setIsLoading(prev => ({ ...prev, delete: true }));
    try {
      // First check if the user has moderator privileges
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('Failed to verify moderator status');
      if (!profile || !['moderator', 'admin'].includes(profile.role)) {
        throw new Error('You do not have permission to perform this action');
      }

      // Delete the thread (posts will be deleted automatically via cascade)
      const { error: deleteError } = await supabase
        .from('threads')
        .delete()
        .eq('id', threadId);

      if (deleteError) {
        console.error('Error deleting thread:', deleteError);
        throw new Error('Failed to delete thread');
      }

      toast({
        title: "Thread deleted",
        description: "Thread has been deleted successfully."
      });

      // Navigate to forums page after deletion
      navigate('/forums');
    } catch (error) {
      console.error('Error deleting thread:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete thread. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showModerationPanel && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePinThread}
            disabled={isLoading.pin}
            className="flex items-center gap-2"
          >
            <Pin className={`w-4 h-4 ${isPinned ? 'text-yellow-500' : ''}`} />
            {isPinned ? "Unpin" : "Pin"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLockThread}
            disabled={isLoading.lock}
            className="flex items-center gap-2"
          >
            <Lock className={`w-4 h-4 ${isLocked ? 'text-red-500' : ''}`} />
            {isLocked ? "Unlock" : "Lock"}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteThread}
            disabled={isLoading.delete}
          >
            Delete Thread
          </Button>
        </>
      )}
    </div>
  );
};

export default ModeratorControls;
