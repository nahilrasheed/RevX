// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../api/projects';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        if (response.status === 'success') {
          // Show all projects on the home page
          setProjects(response.data);
        } else {
          setError('Failed to load projects');
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error loading projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to REV-X</h1>
          <p className="text-lg text-gray-400 mb-8">Discover amazing projects from the community</p>
          
          {isAuthenticated && (
            <div className="space-x-4">
              <button onClick={() => navigate('/upload')} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300">
                Upload Project
              </button>
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                My Dashboard
              </button>
            </div>
          )}
        </div>

        {/* All Projects Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No projects available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-600 transition cursor-pointer"
                >
                  <div className="aspect-video bg-gray-700"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="inline-block text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                        {project.category || 'Uncategorized'}
                      </span>
                      {/* Show project owner info if available */}
                      <span className="text-sm text-gray-400">
                        {project.owner_id === user?.id ? 'Your project' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
