
import { MessageSquare, Users, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Forums = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Forums</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with others, share experiences, and learn from our community of scam-awareness advocates.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg mb-8">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-4">Forums Coming Soon!</h2>
              <p className="text-lg opacity-90 mb-6">
                We're building an amazing community space where you can discuss scam prevention, share experiences, and help others stay safe online.
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Launching Soon</p>
                  <p className="text-sm opacity-75">Stay tuned for updates!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Planned Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Discussion Threads</h3>
              </div>
              <p className="text-gray-600">
                Share your experiences, ask questions, and discuss the latest scam trends with our community members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Expert Moderation</h3>
              </div>
              <p className="text-gray-600">
                Our team of cybersecurity experts and moderators will ensure high-quality discussions and accurate information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Scam Reports</h3>
              </div>
              <p className="text-gray-600">
                Report new scams you've encountered and help warn others in the community about emerging threats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Support Groups</h3>
              </div>
              <p className="text-gray-600">
                Connect with others who have experienced scams and find support, advice, and resources for recovery.
              </p>
            </div>
          </div>

          {/* Subscribe for Updates */}
          <div className="bg-white p-8 rounded-lg shadow-lg mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to be notified when forums launch?</h3>
            <p className="text-gray-600 mb-6">
              Create an account today and you'll be among the first to know when our community forums go live!
            </p>
            <div className="flex justify-center">
              <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Join ScamAware Today
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Forums;
