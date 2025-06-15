
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, Shield, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
}

const mockUsers: User[] = [
  { id: 1, username: "admin", email: "admin@scamaware.com", role: "admin" },
  { id: 2, username: "moderator", email: "mod@scamaware.com", role: "moderator" },
  { id: 3, username: "user1", email: "user1@example.com", role: "user" },
  { id: 4, username: "user2", email: "user2@example.com", role: "user" },
  { id: 5, username: "mod2", email: "mod2@scamaware.com", role: "moderator" },
];

const AdminPanel = () => {
  const { user, updateUserRole, deleteUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = (userId: number, newRole: string) => {
    // Prevent admin from changing their own role
    if (userId === user.id) {
      toast({
        title: "Action not allowed",
        description: "You cannot change your own role.",
        variant: "destructive",
      });
      return;
    }

    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole as 'user' | 'moderator' | 'admin' } : u
    ));
    updateUserRole(userId, newRole);
    
    toast({
      title: "Role updated",
      description: `User role has been changed to ${newRole}.`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    // Prevent admin from deleting themselves
    if (userId === user.id) {
      toast({
        title: "Action not allowed",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    deleteUser(userId);
    
    toast({
      title: "User deleted",
      description: "The user has been successfully removed.",
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage users, roles, and system settings</p>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((targetUser) => (
                  <tr key={targetUser.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(targetUser.role)}
                        <span className="font-medium">{targetUser.username}</span>
                        {targetUser.id === user.id && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{targetUser.email}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(targetUser.role)}`}>
                        {targetUser.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Select
                          value={targetUser.role}
                          onValueChange={(value) => handleRoleChange(targetUser.id, value)}
                          disabled={targetUser.id === user.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(targetUser.id)}
                          disabled={targetUser.id === user.id}
                          className="p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Moderators</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter(u => u.role === 'moderator').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Admins</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
