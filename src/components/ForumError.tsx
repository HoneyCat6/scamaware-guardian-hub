
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ForumErrorProps {
  error: string;
  onClearError: () => void;
}

const ForumError = ({ error, onClearError }: ForumErrorProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-red-600">Error Loading Forums</h1>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={onClearError}>
              Dismiss Error
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForumError;
