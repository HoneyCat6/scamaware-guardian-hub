import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminStats from "@/components/admin/AdminStats";
import UserManagement from "@/components/admin/UserManagement";
import { ArticleReview } from "@/components/admin/ArticleReview";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPanel = () => {
  const { user } = useAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="articles">Article Review</TabsTrigger>
              {user.role === 'admin' && (
                <TabsTrigger value="users">User Management</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="stats">
              <AdminStats />
            </TabsContent>

            <TabsContent value="articles">
              <ArticleReview />
            </TabsContent>

            {user.role === 'admin' && (
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
