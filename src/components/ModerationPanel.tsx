
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReportedPostsList from "@/components/moderation/ReportedPostsList";
import ModerationEmpty from "@/components/moderation/ModerationEmpty";
import { threadData } from "@/data/threadData";

const ModerationPanel = () => {
  const getReportedPosts = () => {
    const reportedPosts: Array<any> = [];
    
    Object.values(threadData).forEach(thread => {
      thread.posts.forEach(post => {
        if (post.isReported) {
          reportedPosts.push({
            ...post,
            threadId: thread.id,
            threadTitle: thread.title
          });
        }
      });
    });
    
    return reportedPosts.sort((a, b) => b.reportCount - a.reportCount);
  };

  const reportedPosts = getReportedPosts();

  if (reportedPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Moderation Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ModerationEmpty />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Moderation Queue
          <Badge variant="destructive" className="ml-2">
            {reportedPosts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReportedPostsList />
      </CardContent>
    </Card>
  );
};

export default ModerationPanel;
