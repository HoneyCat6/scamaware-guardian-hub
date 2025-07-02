import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticleReview } from "@/components/admin/ArticleReview";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ModeratorStats {
  pendingArticles: number;
  approvedArticles: number;
  rejectedArticles: number;
}

const ModeratorPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ModeratorStats>({
    pendingArticles: 0,
    approvedArticles: 0,
    rejectedArticles: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get counts for different article statuses
        const { count: pendingCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { count: approvedCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')
          .eq('reviewer_id', user?.id);

        const { count: rejectedCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected')
          .eq('reviewer_id', user?.id);

        setStats({
          pendingArticles: pendingCount || 0,
          approvedArticles: approvedCount || 0,
          rejectedArticles: rejectedCount || 0
        });
      } catch (error) {
        console.error('Error fetching moderator stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Redirect if not moderator
  if (!user || user.role !== 'moderator') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Moderator Panel</h1>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-700">Pending Articles</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pendingArticles}</p>
              <p className="text-sm text-gray-500 mt-1">Articles awaiting review</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-700">Articles Approved</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.approvedArticles}</p>
              <p className="text-sm text-gray-500 mt-1">Articles you've approved</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-700">Articles Rejected</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejectedArticles}</p>
              <p className="text-sm text-gray-500 mt-1">Articles you've rejected</p>
            </Card>
          </div>

          {/* Article Review Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ArticleReview />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ModeratorPanel; 