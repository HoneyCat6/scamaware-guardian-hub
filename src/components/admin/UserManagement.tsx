import { useState, useEffect } from "react";
import { Shield, Trash2, UserX, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const UserManagement = () => {
  const { toast } = useToast();
  const { user, updateUserRole, deleteUser, banUser, unbanUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const bannedUsers = users.filter((u) => u.is_banned);
  const activeUsers = users.filter((u) => !u.is_banned);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username', { ascending: true });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users from database.",
          variant: "destructive",
        });
      } else {
        setUsers(data || []);
        // Log all user IDs for debugging
        console.log('Fetched user IDs:', (data || []).map(u => u.id));
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  // Helper to refresh users after actions
  const refreshUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username', { ascending: true });
    if (!error) setUsers(data || []);
    setLoadingUsers(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, newRole as 'user' | 'moderator' | 'admin');
      toast({
        title: "Role updated",
        description: `User role has been successfully updated to ${newRole}.`,
      });
      await refreshUsers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to delete userId:', userId);
      await deleteUser(userId);
      toast({
        title: "User deleted",
        description: `User ${username} has been successfully deleted.`,
      });
      await refreshUsers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId: string, username: string) => {
    try {
      setIsLoading(true);
      await banUser(userId, user?.id);
      toast({
        title: "User banned",
        description: `User ${username} has been banned from the forum.`,
      });
      await refreshUsers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbanUser = async (userId: string, username: string) => {
    try {
      setIsLoading(true);
      await unbanUser(userId);
      toast({
        title: "User unbanned",
        description: `User ${username} has been unbanned and can now access the forum.`,
      });
      await refreshUsers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to unban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingUsers ? (
              <div>Loading users...</div>
            ) : activeUsers.length === 0 ? (
              <div>No users found.</div>
            ) : (
              activeUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.username}</span>
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'moderator' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={isLoading}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBanUser(user.id, user.username)}
                      disabled={isLoading}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      disabled={isLoading}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banned Users */}
      {bannedUsers.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <UserX className="w-5 h-5" />
              Banned Users ({bannedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bannedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.username}</span>
                      <Badge variant="destructive">Banned</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.bannedAt && (
                      <p className="text-xs text-red-600 mt-1">
                        Banned on {new Date(user.bannedAt).toLocaleDateString()} by {user.bannedBy}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnbanUser(user.id, user.username)}
                    disabled={isLoading}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    Unban
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
