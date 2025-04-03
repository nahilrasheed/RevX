import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div>
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to REV-X
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Share, Review, and Explore Projects
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          A platform for students to showcase their work, receive feedback, and discover inspiring projects from peers.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => navigate('/upload')}
                className="px-8 py-3 rounded-lg ring-2 ring-gray-100 text-white bg-black hover:bg-gray-100 hover:text-black font-semibold"
              >
                Upload Project
              </button>
              <button 
                onClick={() => navigate('/explore')}
                className="px-8 py-3 rounded-lg ring-2 ring-gray-600 bg-slate-600 text-white bg-black hover:bg-gray-700 font-semibold"
              >
                Explore Projects
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/explore')}
                className="px-8 py-3 ring-1 ring-red-100 bg-white backdrop-brightness-75 text-black rounded-lg hover:bg-gray-300 font-semibold"
              >
                Explore Projects
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 ring-1 ring-gray-400 text-white rounded-lg hover:bg-gray-700 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;
