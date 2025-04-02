import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import ProjectEditForm from './ProjectEditForm';
import ContributorsList from './ContributorsList';
import ReviewList from './ReviewList';
import AddReviewForm from './AddReviewForm';
import ProjectHeader from './ProjectHeader';
import { Project } from '../types/project';

const ProjectDescription = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoize refreshProjectData to prevent recreation on every render
  const refreshProjectData = useCallback(async () => {
    if (!projectId) return;
    
    try {
      const updatedProject = await getProject(projectId);
      if (updatedProject.status === 'success') {
        setProject(updatedProject.data);
      }
    } catch (err) {
      setError('Error refreshing project data');
    }
  }, [projectId]);

  // Trigger refresh using counter state
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const response = await getProject(projectId);
        if (response.status === 'success') {
          setProject(response.data);
          setError(null);
        } else {
          setError('Failed to load project');
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error loading project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-400 mb-8">{error || 'The requested project could not be found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Go Back to Projects
        </button>
      </div>
    );
  }

  const isOwner = user && project.owner_id === user.id;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Project Header */}
        {isEditing ? (
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
            <ProjectEditForm 
              projectId={projectId!}
              initialData={{
                title: project.title,
                description: project.description,
                category: project.category,
                image: project.images?.[0]
              }}
              onCancel={() => setIsEditing(false)}
              onSuccess={refreshProjectData}
            />

            {/* Show contributors list even in edit mode */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Project Contributors</h2>
              <ContributorsList 
                projectId={projectId!}
                contributors={project.contributors || []}
                isOwner={isOwner}
                onContributorRemoved={triggerRefresh}
              />
            </div>
          </div>
        ) : (
          <>
            <ProjectHeader 
              project={project} 
              isOwner={isOwner}
              onEditClick={() => setIsEditing(true)}
              onBackClick={() => navigate('/')}
            />
            
            {/* Contributors Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Project Contributors</h2>
              {isOwner ? (
                <ContributorsList 
                  projectId={projectId!}
                  contributors={project.contributors || []}
                  isOwner={isOwner}
                  onContributorRemoved={triggerRefresh}
                />
              ) : (
                <div>
                  {project.contributors && project.contributors.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {project.contributors.map((contributor) => (
                        <li 
                          key={contributor.user_id}
                          className="flex items-center bg-gray-800 p-3 rounded-lg"
                        >
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            {contributor.avatar ? (
                              <img 
                                src={contributor.avatar} 
                                alt="Contributor avatar" 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              contributor.full_name?.substring(0, 2) || contributor.username?.substring(0, 2) || contributor.user_id?.substring(0, 2)
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {contributor.full_name || `User ${contributor.user_id.substring(0, 8)}`}
                            </p>
                            <p className="text-sm text-gray-400">
                              {contributor.username ? `@${contributor.username}` : 'No username'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 mb-8">No contributors for this project.</p>
                  )}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Latest Reviews</h2>
              <ReviewList reviews={project.reviews || []} />
            </div>

            {/* Add Review Section */}
            {isAuthenticated && !isOwner && (
              <div className="mt-12">
                <AddReviewForm 
                  projectId={projectId!} 
                  onReviewAdded={triggerRefresh} 
                />
              </div>
            )}

            {/* Report Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Report Bugs or Comments</h2>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Write a complaint..."
                  className="flex-grow p-3 rounded-lg bg-gray-800 focus:outline-none"
                />
                <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300">
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDescription;
