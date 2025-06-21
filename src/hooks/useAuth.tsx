
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  isBanned?: boolean;
  bannedAt?: string;
  bannedBy?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (userId: string, newRole: string) => void;
  deleteUser: (userId: string) => void;
  banUser: (userId: string, bannedBy: string) => void;
  unbanUser: (userId: string) => void;
  getBannedUsers: () => AuthUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email,
              role: profile.role,
              isBanned: profile.is_banned,
              bannedAt: profile.banned_at,
              bannedBy: profile.banned_by
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: profile.id,
                username: profile.username,
                email: profile.email,
                role: profile.role,
                isBanned: profile.is_banned,
                bannedAt: profile.banned_at,
                bannedBy: profile.banned_by
              });
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First, get the user's email from the profiles table using username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, is_banned')
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        return false;
      }

      if (profile.is_banned) {
        return false;
      }

      // Sign in with email and password
      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password,
      });

      return !error;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return false; // Username already taken
      }

      // Create a temporary email using username
      const tempEmail = `${username}@scamaware.local`;

      // Sign up with temporary email
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error || !data.user) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Mock functions for admin functionality - these would need to be implemented with proper Supabase calls
  const updateUserRole = (userId: string, newRole: string) => {
    // TODO: Implement with Supabase
    console.log('Update user role:', userId, newRole);
  };

  const deleteUser = (userId: string) => {
    // TODO: Implement with Supabase
    console.log('Delete user:', userId);
  };

  const banUser = (userId: string, bannedBy: string) => {
    // TODO: Implement with Supabase
    console.log('Ban user:', userId, bannedBy);
  };

  const unbanUser = (userId: string) => {
    // TODO: Implement with Supabase
    console.log('Unban user:', userId);
  };

  const getBannedUsers = (): AuthUser[] => {
    // TODO: Implement with Supabase
    return [];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
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
