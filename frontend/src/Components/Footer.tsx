import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from './Categories';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Link 
                    key={index}
                    to={`/explore?category=${category}`} 
                    className="block text-gray-400 hover:text-white"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white">About</Link>
                <Link to="/explore" className="block text-gray-400 hover:text-white">Explore</Link>
                <Link to="/dashboard" className="block text-gray-400 hover:text-white">Dashboard</Link>
                <Link to="/profile" className="block text-gray-400 hover:text-white">Profile</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2">
                <a href="mailto:support@revx.edu" className="block text-gray-400 hover:text-white">Email Us</a>
                <Link to="/about" className="block text-gray-400 hover:text-white">Our Team</Link>
                <a href="https://github.com/Kandarp05/RevX" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white">GitHub Repository</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {currentYear} REV-X. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
