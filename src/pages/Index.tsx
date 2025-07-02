import { Shield, Users, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinCommunity = () => {
    if (user) {
      toast({
        title: "Already a member",
        description: "You're already part of our community!",
      });
      navigate("/forums");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              ScamAware
            </h1>
            <h2 className="text-2xl md:text-3xl mb-8 opacity-90">
              Your Guardian Hub Against Online Scams
            </h2>
            <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto">
              Stay informed, stay protected. Join our community in the fight against digital deception.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/news">
                <Button size="lg" className="bg-white text-blue-800 hover:bg-gray-100 px-8 py-3 text-lg">
                  Latest Scam News
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-white text-blue-800 hover:bg-gray-100 px-8 py-3 text-lg"
                onClick={handleJoinCommunity}
              >
                {user ? "Go to Forums" : "Join Community"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Defend Against Digital Deception
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive protection through education, community, and real-time alerts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl shadow-lg bg-gradient-to-b from-white to-gray-50 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Latest Scam News</h4>
              <p className="text-gray-600 leading-relaxed">
                Stay updated with the latest scam trends, tactics, and prevention strategies. Our news hub keeps you informed about emerging threats.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl shadow-lg bg-gradient-to-b from-white to-gray-50 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Community Forums</h4>
              <p className="text-gray-600 leading-relaxed">
                Connect with others, share experiences, and learn from a supportive community dedicated to online safety.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl shadow-lg bg-gradient-to-b from-white to-gray-50 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Expert Protection</h4>
              <p className="text-gray-600 leading-relaxed">
                Access curated content from cybersecurity experts and learn proven strategies to protect yourself online.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
