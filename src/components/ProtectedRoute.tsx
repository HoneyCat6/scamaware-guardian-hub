import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

type UserRole = 'user' | 'moderator' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
  const { user, session } = useAuth();
  const location = useLocation();

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is banned, redirect to login
  if (user?.isBanned) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole && user?.role) {
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 };
    const userLevel = roleHierarchy[user.role];

    if (Array.isArray(requiredRole)) {
      // Check if user's role is in the array of allowed roles
      if (!requiredRole.includes(user.role)) {
        return <Navigate to="/" replace />;
      }
    } else {
      // Single role check using hierarchy
      const requiredLevel = roleHierarchy[requiredRole];
      if (userLevel < requiredLevel) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
