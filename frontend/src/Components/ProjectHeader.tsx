import { useState } from 'react';
import { Project } from '../types/project';
import { User, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
  isOwner: boolean | null;
  onEditClick: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, isOwner, onEditClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate average rating
  const averageRating = project.reviews && project.reviews.length > 0
    ? (project.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / project.reviews.length).toFixed(1)
    : 'No ratings yet';

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 mb-12">
      {/* Image Carousel */}
      <div className="w-full lg:w-1/2 aspect-video bg-gray-800 rounded-lg overflow-hidden relative ring-1 ring-gray-600">
        {project.images && project.images.length > 0 ? (
          <>
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick} 
              onError={(e) => { e.currentTarget.src = '/fallback-image.jpg'; }}
            />

            {/* Navigation Buttons */}
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

      {/* Project Details */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          {/* Display Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.length > 0 ? (
              project.tags.map((tag) => {
                const tagKey = tag.tag_id !== undefined ? tag.tag_id : tag.id;
                return (
                  <span 
                    key={tagKey} 
                    className="inline-block px-3 py-1 text-xs font-medium ring-1 ring-purple-400 bg-purple-900/30 text-purple-300 rounded-full"
                  >
                    {tag.tag_name}
                  </span>
                );
              })
            ) : (
              <span className="text-sm text-gray-500 italic">No tags</span>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {typeof averageRating === 'string' ? (
                <span className="text-gray-400 text-sm">{averageRating}</span>
              ) : (
                <>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{averageRating}/5</span>
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
                  onError={(e) => {
                    e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full">${project.owner?.full_name?.substring(0, 2) || project.owner?.username?.substring(0, 2) || 'U'}</div>`;
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  {project.owner.full_name?.substring(0, 2) || project.owner.username?.substring(0, 2) || 'U'}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{project.owner.full_name || project.owner.username || 'Unknown Owner'}</p>
              <p className="text-sm text-gray-400">
                @{project.owner.username || `User ${project.owner_id.substring(0, 8)}`}
              </p>
            </div>
          </div>
        )}

        <p className="mb-8 text-gray-300 leading-relaxed">{project.description}</p>

        <div className="flex gap-4">
          {isOwner && (
            <button
              onClick={onEditClick}
              className="px-6 py-3 ring-1 ring-blue-500 rounded-lg hover:bg-blue-700 transition text-white"
            >
              Edit Project
            </button>
          )}
        </div>
      </div>

      {/* Modal for Image Zooming */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl p-4 rounded-lg flex flex-col">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="ml-auto text-white text-3xl font-semibold hover:text-gray-500"
            >
              &times;
            </button>
            <div className="relative">
              {/* Image in Modal */}
              <img
                src={project.images[currentImageIndex]}
                alt={`Zoomed Image ${currentImageIndex + 1}`}
                className="w-full h-auto"
              />
              {/* Navigation Buttons */}
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
