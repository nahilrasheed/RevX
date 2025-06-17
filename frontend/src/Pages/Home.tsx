import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { Project } from '../types/project';
import { Star } from 'lucide-react';
import Hero from '../Components/Hero';

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const limit = 6; // Display only top 6 projects

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProjects();
        if (response.status === 'success') {
          setProjects(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(response.message || 'Failed to load projects');
          setProjects([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Error loading projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sort projects by avg_rating (highest first) and limit to specified number
  const displayedProjects = projects
    .sort((a, b) => {
      const ratingA = typeof a.avg_rating === 'number' ? a.avg_rating : 0;
      const ratingB = typeof b.avg_rating === 'number' ? b.avg_rating : 0;
      return ratingB - ratingA;
    })
    .slice(0, limit);

  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Top Rated Projects</h2>
        
        {/* Projects Grid */}
        <div className="container mx-auto px-6 pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Projects</h1>
              <p className="text-gray-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
          ) : displayedProjects.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full py-10">
              No projects found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((project: Project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-gray-800 rounded-lg ring-1 ring-gray-600 overflow-hidden hover:ring-2 hover:ring-purple-300 transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-video bg-gray-700 h-48 overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No images
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-black text-white flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-3 flex-grow">{project.description}</p>
                    
                    {/* Rating display */}
                    <div className="flex items-center mb-3 mt-auto">
                      <Star className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" />
                      <span className="text-sm text-gray-300">
                        {(typeof project.avg_rating === 'number' && project.avg_rating > 0) 
                          ? project.avg_rating.toFixed(1) 
                          : 'No ratings'}
                      </span>
                    </div>
                    
                    {/* Tags display */}
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.tags) && project.tags.length > 0 ? (
                        project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.tag_id}
                            className="inline-block px-2 py-0.5 text-xs font-medium ring-1 ring-purple-400 bg-purple-900/30 text-purple-300 rounded-full"
                          >
                            {tag.tag_name}
                          </span>
                        ))
                      ) : null}
                      {Array.isArray(project.tags) && project.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;