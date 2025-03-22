import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
  // Simulating user authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState('Saumya');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    // Add logout logic (e.g., clear token, redirect)
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold" aria-label="Home">
        <div className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-white" />
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/about" aria-label="About">About</Link>
        <Link to="/explore" aria-label="Explore">Explore</Link>
        <Link to="/community" aria-label="Community">Community</Link>
        <Link to="/profile" aria-label="Profile">Profile</Link>
        <Link to="/contact" aria-label="Contact">Contact</Link>
      </div>

      {/* Authentication Actions */}
      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <span className="p-2 rounded-lg bg-gray-800">{`Logged in as ${username}`}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              aria-label="Sign In"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="p-2 rounded-lg bg-white text-black hover:bg-gray-300"
              aria-label="Register"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
