import React from 'react'

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Web Development</a>
                <a href="#" className="block text-gray-400 hover:text-white">App Development</a>
                <a href="#" className="block text-gray-400 hover:text-white">AI ML projects</a>
                <a href="#" className="block text-gray-400 hover:text-white">Security Focussed</a>
                <a href="#" className="block text-gray-400 hover:text-white">Game Development</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Support</a>
                <a href="#" className="block text-gray-400 hover:text-white">Discussions</a>
                <a href="#" className="block text-gray-400 hover:text-white">Developers</a>
                <a href="#" className="block text-gray-400 hover:text-white">Collaboration features</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Report bugs</a>
                <a href="#" className="block text-gray-400 hover:text-white">Ask for Help</a>
                <a href="#" className="block text-gray-400 hover:text-white">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
