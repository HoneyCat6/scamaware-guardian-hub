
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ThreadNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <h1 className="text-2xl font-bold text-gray-900">Thread Not Found</h1>
        </div>
        <p className="text-gray-600 mb-4">
          The thread you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/forums">
            <Button variant="outline">Back to Forums</Button>
          </Link>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThreadNotFound;
