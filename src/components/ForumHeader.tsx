
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ForumHeaderProps {
  canModerate: boolean;
  userRole?: string;
}

const ForumHeader = ({ canModerate, userRole }: ForumHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Forums</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Connect with others, share experiences, and learn from our community of scam-awareness advocates.
      </p>
      {canModerate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            You have {userRole} privileges. You can moderate discussions and manage content.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForumHeader;
