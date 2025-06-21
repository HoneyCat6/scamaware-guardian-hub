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
  updateUserRole: (userId: string, newRole: 'user' | 'moderator' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  banUser: (userId: string, bannedBy: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
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
          // Defer profile fetch to avoid auth deadlocks
          setTimeout(async () => {
            try {
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
            } catch (err) {
              console.error('Error fetching profile:', err);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        // Defer profile fetch
        setTimeout(async () => {
          try {
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
          } catch (err) {
            console.error('Error fetching initial profile:', err);
          }
        }, 0);
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
        .maybeSingle();

      console.log('Profile lookup result:', profile, 'Error:', profileError);

      if (profileError && profileError.code !== 'PGRST116') {
        console.log('Database error:', profileError);
        return false;
      }

      if (!profile) {
        console.log('User not found');
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
        return false;
      }

      // Create email using a more reliable domain
      const tempEmail = `${username}@temp-scamaware.net`;
      console.log('Using email:', tempEmail);

      // Sign up with email
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Sign up result:', data, 'Error:', error);

      if (error) {
        console.log('Registration failed:', error);
        return false;
      }

      if (data.user && !data.session) {
        // User created but needs email confirmation
        console.log('User created, waiting for confirmation');
        return true;
      }

      return !!data.user;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setSession(null);
      window.location.href = '/';
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      console.log('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // In a real implementation, you'd need admin API access to delete auth users
      // For now, just mark as deleted or ban
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: true, banned_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
      console.log('User deleted/banned successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const banUser = async (userId: string, bannedBy: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: true, 
          banned_at: new Date().toISOString(),
          banned_by: bannedBy
        })
        .eq('id', userId);
      
      if (error) throw error;
      console.log('User banned successfully');
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: false, 
          banned_at: null,
          banned_by: null
        })
        .eq('id', userId);
      
      if (error) throw error;
      console.log('User unbanned successfully');
    } catch (error) {
      console.error('Error unbanning user:', error);
      throw error;
    }
  };

  const getBannedUsers = (): AuthUser[] => {
    // This would need to be implemented with a proper query in a real app
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
