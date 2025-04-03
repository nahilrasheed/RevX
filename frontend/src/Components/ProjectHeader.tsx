import { useMemo, useState } from 'react';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectHeaderProps {
  project: Project;
  isOwner: boolean | null;
  onEditClick: () => void;
}

const ProjectHeader = ({ project, isOwner, onEditClick }: ProjectHeaderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const averageRating = useMemo(() => {
    if (!project.reviews || project.reviews.length === 0) return "No ratings yet";
    
    const totalRating = project.reviews.reduce((sum: number, review) => {
      return sum + Number(review.rating);
    }, 0);
    
    return (totalRating / project.reviews.length).toFixed(1);
  }, [project.reviews]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (project.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (project.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-video bg-gray-700 rounded-lg">
          {project.images && project.images.length > 0 ? (
            <>
              <img 
                src={project.images[currentImageIndex]} 
                alt={`${project.title} - Image ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === index 
                            ? 'bg-white w-4' 
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No images available
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="inline-block px-3 py-1 text-sm ring-1 ring-red-200 rounded-lg">
            {project.category || 'uncategorized'}
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
        
        {project.owner && (
          <div className="mb-4 flex items-center gap-2 ring-1 ring-gray-600 bg-gray-950 p-3 rounded-lg inline-block">
            <div className="w-8 h-8 rounded-full bg-gray-1000 flex items-center justify-center">
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
