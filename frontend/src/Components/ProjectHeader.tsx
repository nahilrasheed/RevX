import { useMemo } from 'react';
import { Star, User } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectHeaderProps {
  project: Project;
  isOwner: boolean | null;  // Updated type to accept null
  onEditClick: () => void;
  onBackClick: () => void;
}

const ProjectHeader = ({ project, isOwner, onEditClick, onBackClick }: ProjectHeaderProps) => {
  // Memoize the average rating calculation to avoid recalculating on every render
  const averageRating = useMemo(() => {
    if (!project.reviews || project.reviews.length === 0) return "No ratings yet";
    
    const totalRating = project.reviews.reduce((sum: number, review) => {
      return sum + Number(review.rating);
    }, 0);
    
    return (totalRating / project.reviews.length).toFixed(1);
  }, [project.reviews]);

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-1/2">
        <div className="aspect-video bg-gray-700 rounded-lg">
          {project.images && project.images.length > 0 && (
            <img 
              src={project.images[0]} 
              alt={project.title} 
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="inline-block px-3 py-1 text-sm bg-green-600 rounded-full">
            {project.category || 'Uncategorized'}
          </span>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {typeof averageRating === 'string' ? (
                <span className="text-gray-400">{averageRating}</span>
              ) : (
                <>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{averageRating}/5</span>
                </>
              )}
            </div>
            <span className="text-sm text-gray-400">
              ({project.reviews ? project.reviews.length : 0} reviews)
            </span>
          </div>
        </div>
        
        {/* Project Owner Information */}
        {project.owner && (
          <div className="mb-4 flex items-center gap-2 bg-gray-800 p-3 rounded-lg inline-block">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              {project.owner.avatar ? (
                <img 
                  src={project.owner.avatar} 
                  alt="Owner avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Project Owner</p>
              <p className="font-medium">
                {project.owner.full_name || project.owner.username || `User ${project.owner_id.substring(0, 8)}`}
              </p>
            </div>
          </div>
        )}
        
        <p className="mb-8 text-gray-400">{project.description}</p>

        <div className="flex gap-4">
          <button
            onClick={onBackClick}
            className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Projects
          </button>
          {isOwner && (
            <button
              onClick={onEditClick}
              className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
