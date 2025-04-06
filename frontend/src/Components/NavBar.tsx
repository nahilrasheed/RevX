import { Code2, User, ShieldCheck, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

const NavBar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover" aria-label="Home">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-white" />
            <span>REV-X</span>
          </div>
        </Link>

        {/* Navigation Links - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
          <Link to="/" className="hover:text-red-200 transition-all duration-300 ease-in-out cursor-pointer" aria-label="Home">Home</Link>
          <Link to="/explore" className="hover:text-red-200" aria-label="Explore">Explore</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-red-200" aria-label="Dashboard">Dashboard</Link>
          )}
          <Link to="/about" className="hover:text-red-200" aria-label="About">About</Link>
        </div>

        {/* Upload Project Button */}
        {!isDashboard && isAuthenticated && (
          <Link
            to="/upload"
            className="ml-auto p-2 mr-4 rounded-lg bg-white text-black hover:bg-gray-200 transition-all duration-300 ease-in-out"
            aria-label="Upload Project"
          >
            Upload Project
          </Link>
        )}

        {/* Authentication Actions */}
        <div className="relative" ref={dropdownRef}>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg ring-1 ring-gray-600 bg-black hover:bg-gray-700"
                aria-label="Profile Menu"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span>{user?.username || 'User'}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-12 top-0 w-48 bg-gray-900 rounded-lg shadow-lg ring-1 ring-gray-700 z-50">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-white hover:bg-gray-800">
                    <UserCircle className="h-4 w-4 mr-2" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center px-4 py-2 text-white hover:bg-gray-800">
                      <ShieldCheck className="h-4 w-4 mr-2" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link
                to="/login"
                className="p-2 rounded-lg ring-1 ring-white text-white bg-black hover:bg-gray-600 hover:underline"
                aria-label="Sign In"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="p-2 rounded-lg text-black bg-white hover:underline hover:ring-1 hover:ring-red-200"
                aria-label="Register"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
