
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const InvalidThreadId = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-red-600">Invalid Thread ID</h1>
        </div>
        <p className="text-gray-600 mb-4">The thread ID provided is not valid.</p>
        <Link to="/forums">
          <Button>Back to Forums</Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default InvalidThreadId;
