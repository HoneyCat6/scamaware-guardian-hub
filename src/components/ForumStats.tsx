
import { MessageSquare, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ForumStatsProps {
  totalMembers: number;
  totalThreads: number;
  totalPosts: number;
}

const ForumStats = ({ totalMembers, totalThreads, totalPosts }: ForumStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalMembers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Active Members</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalThreads}</div>
          <div className="text-sm text-gray-600">Total Threads</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumStats;
