import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getProjects } from '../api/projects';
import { categories } from '../Components/Categories';
import ProjectGrid from '../Components/ProjectGrid';

const Explore = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
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
                  : 'ring-1 ring-gray-600 text-white hover:bg-gray-700 hover:ring-1 hover:ring-red-200'
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
        <ProjectGrid projects={filteredProjects} />
      </div>
    </div>
  );
};

export default Explore;
