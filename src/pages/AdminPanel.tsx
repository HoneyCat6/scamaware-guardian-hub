
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminStats from "@/components/admin/AdminStats";
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          
          <AdminStats />
          
          <div className="mt-8">
            <UserManagement />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
