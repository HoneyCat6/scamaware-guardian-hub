
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  isBanned?: boolean;
  bannedAt?: string;
  bannedBy?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (userId: number, newRole: string) => void;
  deleteUser: (userId: number) => void;
  banUser: (userId: number, bannedBy: string) => void;
  unbanUser: (userId: number) => void;
  getBannedUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from a backend
const mockUsers: User[] = [
  { id: 1, username: "admin", email: "admin@scamaware.com", role: "admin" },
  { id: 2, username: "moderator", email: "mod@scamaware.com", role: "moderator" },
  { id: 3, username: "user1", email: "user1@example.com", role: "user" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("scamaware_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Check if user is banned
      const currentUser = users.find(u => u.id === parsedUser.id);
      if (currentUser?.isBanned) {
        // Auto-logout banned users
        localStorage.removeItem("scamaware_user");
        setUser(null);
      } else {
        setUser(parsedUser);
      }
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would validate against a backend
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      // Check if user is banned
      if (foundUser.isBanned) {
        return false; // Banned users cannot login
      }
      // In a real app, you'd verify the password hash
      setUser(foundUser);
      localStorage.setItem("scamaware_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      username,
      email,
      role: 'user'
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem("scamaware_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("scamaware_user");
  };

  const updateUserRole = (userId: number, newRole: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole as 'user' | 'moderator' | 'admin' } : u
    ));
  };

  const deleteUser = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const banUser = (userId: number, bannedBy: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { 
        ...u, 
        isBanned: true, 
        bannedAt: new Date().toISOString(),
        bannedBy: bannedBy
      } : u
    ));
    
    // If the banned user is currently logged in, log them out
    if (user && user.id === userId) {
      logout();
    }
  };

  const unbanUser = (userId: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { 
        ...u, 
        isBanned: false, 
        bannedAt: undefined,
        bannedBy: undefined
      } : u
    ));
  };

  const getBannedUsers = () => {
    return users.filter(u => u.isBanned);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUserRole, 
      deleteUser,
      banUser,
      unbanUser,
      getBannedUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper hook to get all users (for admin panel)
export const useUsers = () => {
  const [users] = useState<User[]>(mockUsers);
  return users;
};
