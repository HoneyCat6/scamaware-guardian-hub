
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">ScamAware</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-blue-600 transition-colors ${isActive('/') ? 'text-blue-600 font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/news" 
              className={`text-gray-700 hover:text-blue-600 transition-colors ${isActive('/news') ? 'text-blue-600 font-semibold' : ''}`}
            >
              News
            </Link>
            <Link 
              to="/forums" 
              className={`text-gray-700 hover:text-blue-600 transition-colors ${isActive('/forums') ? 'text-blue-600 font-semibold' : ''}`}
            >
              Forums
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`text-gray-700 hover:text-blue-600 transition-colors ${isActive('/admin') ? 'text-blue-600 font-semibold' : ''}`}
                  >
                    Admin Panel
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Welcome, {user.username} ({user.role})
                </span>
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/news" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link 
                to="/forums" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Forums
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2">
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">
                    Welcome, {user.username} ({user.role})
                  </span>
                  <Button onClick={handleLogout} variant="destructive" size="sm" className="w-fit">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-fit">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-fit">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
