// import { Code2, Search, Menu, X } from 'lucide-react';
// const NavBar = () => {
//     return (
//         <div>
//           {/* Navigation */}
//           <nav className="border-b border-gray-800">
//             <div className="container mx-auto px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Code2 className="h-8 w-8 text-white" />
//                 </div>
//                 <div className="hidden md:flex items-center space-x-8">
//                   <a href="#" className="hover:text-gray-300">About</a>
//                   <a href="#" className="hover:text-gray-300">Explore</a>
//                   <a href="#" className="hover:text-gray-300">Community</a>
//                   <a href="#" className="hover:text-gray-300">Profile</a>
//                   <a href="#" className="hover:text-gray-300">Contact</a>
//                 </div>
//                 <div className="bg-gray-700 rounded px-4 py-1">
//                   Logged in as Saumya
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </div>
//         )
// }

// export default NavBar
import { Code2, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Add logout logic here (e.g., clear token, redirect)
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <Link to="/" className="text-xl font-bold"> 
      <div className="flex items-center space-x-2"><Code2 className="h-8 w-8 text-white" />                 </div>
      </Link>
      <div className="flex gap-6">
        <Link to="/about">About</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/community">Community</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">Sign In</Link>
            <Link to="/register" className="p-2 rounded-lg bg-white text-black hover:bg-gray-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
