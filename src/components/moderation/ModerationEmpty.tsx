
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ModerationEmpty = () => {
  return (
    <Card>
      <CardContent>
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">No reported posts require moderation at this time.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationEmpty;
