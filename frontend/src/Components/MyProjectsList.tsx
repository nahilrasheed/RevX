import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects } from '../api/projects';

interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  created_at: string;
}

const MyProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await getMyProjects();
      if (response.status === 'success') {
        setProjects(response.data || []);
      } else {
        setError('Failed to load your projects');
      }
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError('Error loading your projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">Loading your projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400">You haven't created any projects yet.</p>
        <button 
          onClick={() => navigate('/upload')}
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
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
  );
};

export default MyProjectsList;