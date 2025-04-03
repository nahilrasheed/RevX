import { Code2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold" aria-label="Home">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-white" />
            <span>REV-X</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-red-200" aria-label="Home">Home</Link>
          <Link to="/explore" className="hover:text-red-200" aria-label="Explore">Explore</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-red-200" aria-label="Dashboard">Dashboard</Link>
          )}
          <Link to="/about" className="hover:text-red-200" aria-label="About">About</Link>
        </div>

        {/* Authentication Actions */}
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2" aria-label="Profile">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:inline">{user?.username || 'User'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg ring-1 ring-red-200 text-white bg-black hover:underline"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="p-2 rounded-lg ring-1 ring-red-200 text-white bg-black hover:bg-gray-600 hover:underline"
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
