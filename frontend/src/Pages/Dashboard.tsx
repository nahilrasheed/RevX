import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, getMyProjects } from '../api/projects';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'reviews', or 'activity'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get user's projects using the dedicated endpoint
        const myProjectsResponse = await getMyProjects();
        if (myProjectsResponse.status === 'success') {
          setUserProjects(myProjectsResponse.data);
        } else {
          setError('Failed to fetch your projects');
        }
        
        // Get all projects for the activity feed
        const allProjectsResponse = await getProjects();
        if (allProjectsResponse.status === 'success') {
          setProjects(allProjectsResponse.data);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => navigate('/upload')} 
            className="px-4 py-2 ring-1 ring-red-200 text-white rounded-lg hover:bg-gray-200 hover:text-black"
          >
            Upload Project
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'projects' 
                ? 'ring-1 ring-red-200 text-white' 
                : 'ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800'
            }`}
          >
            My Projects ({userProjects.length})
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'reviews' 
                ? 'ring-1 ring-red-200 text-white' 
                : 'ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800'
            }`}
          >
            My Reviews
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'activity' 
                ? 'ring-1 ring-red-200 text-white' 
                : 'ring-1 ring-gray-400 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Recent Activity
          </button>
        </div>
        
        {activeTab === 'activity' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-gray-400">No recent activity to display.</p>
            </div>
          </section>
        )}
        
        {activeTab === 'reviews' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-gray-400">You haven't reviewed any projects yet.</p>
            </div>
          </section>
        )}
        
        {activeTab === 'projects' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
            {userProjects.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <p className="text-gray-400">You haven't created any projects yet.</p>
                <button 
                  onClick={() => navigate('/upload')}
                  className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project: any) => (
                  <div 
                    key={project.id} 
                    className="bg-black rounded-lg overflow-hidden ring-1 ring-gray-400 hover:ring-2 hover:ring-red-200 transition cursor-pointer"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="aspect-video bg-gray-700"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-400 line-clamp-2">{project.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-block text-sm ring-1 ring-red-200 text-gray-300 px-3 py-1 rounded-full">
                          {project.category || 'Uncategorized'}
                        </span>
                        <span className="text-sm text-red-200">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
