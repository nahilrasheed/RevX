import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { Project, Tag } from '../types/project'; // Import Project and Tag types

const ProjectGrid = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Use Project type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true); // Set loading true at the start
      setError(null); // Reset error
      try {
        const response = await getProjects();
        if (response.status === 'success') {
          // Ensure response.data is an array before setting
          setProjects(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(response.message || 'Failed to load projects');
          setProjects([]); // Clear projects on error
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Error loading projects');
        setProjects([]); // Clear projects on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const displayedProjects = projects; // Use all fetched projects

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Projects</h1>
        <p className="text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple retry
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Projects Grid */}
      <div className="container mx-auto px-6 pb-20">
         {displayedProjects.length === 0 && !isLoading && (
             <p className="text-center text-gray-400 col-span-full py-10">
               No projects found.
             </p>
         )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No projects found for this category.
            </p>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-gray-800 rounded-lg ring-1 ring-gray-600 overflow-hidden hover:ring-2 hover:ring-red-200 transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gray-700">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No images
                    </div>
                  )}
                </div>
                <div className="p-6 ring-2 ring-gray-600 text-white bg-black">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400">{project.description}</p>
                  <span className="inline-block mt-4 text-sm ring-1 ring-red-200 text-white bg-black px-3 py-1 rounded-full">
                    {project.category || 'Uncategorized'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectGrid;
