
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
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          console.log('Profile data:', profile, 'Error:', error);
          
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
      console.log('Attempting login for username:', username);
      
      // First, get the user's email from the profiles table using username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, is_banned')
        .eq('username', username)
        .single();

      console.log('Profile lookup result:', profile, 'Error:', profileError);

      if (profileError || !profile) {
        console.log('User not found or error:', profileError);
        return false;
      }

      if (profile.is_banned) {
        console.log('User is banned');
        return false;
      }

      // Sign in with email and password
      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password,
      });

      console.log('Sign in result - Error:', error);
      return !error;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for username:', username);
      
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      console.log('Username check result:', existingUser, 'Error:', checkError);

      if (existingUser) {
        console.log('Username already taken');
        return false; // Username already taken
      }

      // Create a valid email using example.com domain (RFC compliant)
      const tempEmail = `${username}@example.com`;
      console.log('Using email:', tempEmail);

      // Sign up with valid email
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

      console.log('Sign up result:', data, 'Error:', error);

      if (error || !data.user) {
        console.log('Registration failed:', error);
        return false;
      }

      // Since we're using a fake email domain, the user won't get a confirmation email
      // and will be automatically confirmed. The trigger will create their profile.
      
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
    console.log('Update user role:', userId, newRole);
  };

  const deleteUser = (userId: string) => {
    console.log('Delete user:', userId);
  };

  const banUser = (userId: string, bannedBy: string) => {
    console.log('Ban user:', userId, bannedBy);
  };

  const unbanUser = (userId: string) => {
    console.log('Unban user:', userId);
  };

  const getBannedUsers = (): AuthUser[] => {
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
