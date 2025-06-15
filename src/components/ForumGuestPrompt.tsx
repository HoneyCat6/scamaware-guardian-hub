
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ForumGuestPrompt = () => {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-center text-xl">Join Our Community</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 mb-6">
          Sign up or log in to participate in discussions, create threads, and help others stay safe online.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="lg">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="lg">Sign Up</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumGuestPrompt;
