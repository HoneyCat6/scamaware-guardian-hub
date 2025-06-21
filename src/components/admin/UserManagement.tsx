
import { useState } from "react";
import { Shield, Trash2, UserX, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const UserManagement = () => {
  const { toast } = useToast();
  const { updateUserRole, deleteUser, banUser, unbanUser, getBannedUsers } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Mock users data - in a real app this would come from an API
  const mockUsers = [
    { id: "1aef5b14-e3a9-4e51-8dca-191c86cde512", username: "admin", email: "admin@scamaware.com", role: "admin" as const },
    { id: "2bef5b14-e3a9-4e51-8dca-191c86cde513", username: "moderator", email: "mod@scamaware.com", role: "moderator" as const },
    { id: "3cef5b14-e3a9-4e51-8dca-191c86cde514", username: "user1", email: "user1@example.com", role: "user" as const },
    { id: "4def5b14-e3a9-4e51-8dca-191c86cde515", username: "user2", email: "user2@example.com", role: "user" as const },
  ];

  const bannedUsers = getBannedUsers();

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, newRole);
      
      toast({
        title: "Role updated",
        description: `User role has been successfully updated to ${newRole}.`,
      });
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
      await deleteUser(userId);
      
      toast({
        title: "User deleted",
        description: `User ${username} has been successfully deleted.`,
      });
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
      await banUser(userId, "admin");
      
      toast({
        title: "User banned",
        description: `User ${username} has been banned from the forum.`,
      });
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
            {mockUsers.map((user) => (
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
            ))}
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
