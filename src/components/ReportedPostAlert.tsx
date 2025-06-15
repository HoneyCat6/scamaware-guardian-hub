
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/data/threadData";
import { useAuth } from "@/hooks/useAuth";

interface ReportedPostAlertProps {
  post: Post;
}

const ReportedPostAlert = ({ post }: ReportedPostAlertProps) => {
  const { user } = useAuth();
  const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

  if (!post.isReported || !canModerate) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-md flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-orange-600" />
      <div className="flex-1">
        <p className="text-orange-800 font-medium">Reported Post</p>
        <p className="text-orange-700 text-sm">
          This post has been reported {post.reportCount} time{post.reportCount !== 1 ? 's' : ''} and requires moderation.
        </p>
      </div>
      <Badge variant="destructive" className="text-xs">
        {post.reportCount} report{post.reportCount !== 1 ? 's' : ''}
      </Badge>
    </div>
  );
};

export default ReportedPostAlert;
