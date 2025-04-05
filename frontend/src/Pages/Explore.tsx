import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getProjects } from '../api/projects';
import { categories } from '../Components/Categories';

// Add this interface at the top of the file
interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  image_urls?: string[];
  // Add other project properties as needed
}

const Explore = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        if (response.status === 'success') {
          setProjects(response.data);
          setFilteredProjects(response.data);
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

  useEffect(() => {
    // Filter projects based on search term and category
    let results = projects;
    
    if (selectedCategory) {
      results = results.filter(project => project.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProjects(results);
  }, [searchTerm, selectedCategory, projects]);

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
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Explore Projects</h1>
        
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center ring-1 ring-gray-600 bg-gray-1000 rounded-lg p-2 mb-6 hover:ring-1 hover:ring-red-200">
            <Search className="h-5 w-5 text-gray-400 mx-2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent text-white focus:outline-none p-2"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === null 
                  ? 'ring-2 ring-red-200 text-white' 
                  : 'ring-1 ring-gray-600 text-white hover:bg-gray-700 hover:ring-1 hover:ring-red-200 transition-all duration-300 ease-in-out cursor-pointer'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg ${
                  category === selectedCategory 
                    ? 'ring-1 ring-red-200 text-white' 
                    : 'ring-1 ring-gray-600 text-white hover:bg-gray-700 hover:ring-1 hover:ring-red-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No projects found</h2>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-gray-1000 ring-1 ring-gray-600 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-200 transition cursor-pointer"
              >
                <div className="aspect-video bg-gray-700">
                  {project.image_urls && project.image_urls.length > 0 ? (
                    <img
                      src={project.image_urls[0]} // Display the first image
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-image.jpg'; // Add a fallback image
                      }}
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 line-clamp-3">{project.description}</p>
                  <span className="inline-block mt-4 text-sm ring-1 ring-red-200 text-gray-300 px-3 py-1 rounded-full">
                    {project.category || 'Uncategorized'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
