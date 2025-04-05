import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllProjects, deleteProject } from '../../api/admin';

interface Project {
  id: string;
  title: string;
  owner_id: string;
  owner_username: string;
  created_at: string;
  avg_rating?: number;
}

const ProjectManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchProjects();
  }, [isAdmin, navigate]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProjects();
      setProjects(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error loading projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setActionInProgress(projectId);
      await deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error deleting project');
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Projects</h1>
        </div>

        {/* Admin Nav */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800"
          >
            Manage Users
          </button>
          <button 
            onClick={() => navigate('/admin/projects')}
            className="px-4 py-2 rounded-lg ring-1 ring-red-200 text-white"
          >
            Manage Projects
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 text-white p-4 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Project List */}
        <div className="bg-gray-900 rounded-lg ring-1 ring-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Owner</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-800/50">
                    <td className="py-3 px-4">{project.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{project.title}</div>
                    </td>
                    <td className="py-3 px-4">{project.owner_username}</td>
                    <td className="py-3 px-4">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {project.avg_rating ? project.avg_rating.toFixed(1) : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/project/${project.id}`)}
                          className="px-3 py-1 text-sm rounded bg-blue-700 hover:bg-blue-600"
                        >
                          View
                        </button>
                        
                        {confirmDelete === project.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={actionInProgress === project.id}
                              className="px-3 py-1 text-sm rounded bg-red-700 hover:bg-red-600"
                            >
                              {actionInProgress === project.id ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(project.id)}
                            className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectManagement;