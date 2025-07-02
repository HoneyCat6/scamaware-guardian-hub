import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string };
};

interface ReportedPostAlertProps {
  post: Post;
  canModerate?: boolean;
}

const ReportedPostAlert = ({ post, canModerate }: ReportedPostAlertProps) => {
  const { toast } = useToast();
  const [tablesExist, setTablesExist] = useState(false);

  // Check if tables exist
  useEffect(() => {
    const checkTables = async () => {
      try {
        // Check post_reports table
        const { error: reportsError } = await supabase.from('post_reports').select('*').limit(1);

        if (reportsError) {
          console.error('Tables not found:', { reportsError });
          setTablesExist(false);
          toast({
            title: "Database setup required",
            description: "Please contact an administrator to set up the required database tables.",
            variant: "destructive",
          });
        } else {
          setTablesExist(true);
        }
      } catch (err) {
        console.error('Error checking tables:', err);
        setTablesExist(false);
      }
    };

    checkTables();
  }, [toast]);

  if (!post.is_reported || !canModerate || !tablesExist) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-md flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-orange-600" />
      <div className="flex-1">
        <p className="text-orange-800 font-medium">Reported Post</p>
        <p className="text-orange-700 text-sm">
          This post has been reported {post.report_count} time{post.report_count !== 1 ? 's' : ''} and requires moderation.
        </p>
      </div>
      <Badge variant="destructive" className="text-xs">
        {post.report_count} report{post.report_count !== 1 ? 's' : ''}
      </Badge>
    </div>
  );
};

export default ReportedPostAlert;
