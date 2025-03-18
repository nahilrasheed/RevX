import { Code2, Search, Menu, X } from 'lucide-react';
const NavBar = () => {
    return (
        <div>
          {/* Navigation */}
          <nav className="border-b border-gray-800">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-8 w-8 text-white" />
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#" className="hover:text-gray-300">About</a>
                  <a href="#" className="hover:text-gray-300">Explore</a>
                  <a href="#" className="hover:text-gray-300">Community</a>
                  <a href="#" className="hover:text-gray-300">Profile</a>
                  <a href="#" className="hover:text-gray-300">Contact</a>
                </div>
                <div className="bg-gray-700 rounded px-4 py-1">
                  Logged in as Saumya
                </div>
              </div>
            </div>
          </nav>
        </div>
        )
}

export default NavBar
