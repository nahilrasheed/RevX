import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, addReview } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import { Star, User } from 'lucide-react';
import ProjectEditForm from './ProjectEditForm';
import ContributorsList from './ContributorsList';

const ProjectDescription = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const response = await getProject(projectId);
        if (response.status === 'success') {
          setProject(response.data);
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
  }, [projectId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!review.trim()) {
      setReviewError('Please enter a review');
      return;
    }
    
    if (!rating) {
      setReviewError('Please select a rating (1-5 stars)');
      return;
    }
    
    setReviewError(null);
    setReviewSuccess(null);
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        review: review.trim(),
        rating: rating
      };
      
      const response = await addReview(projectId!, reviewData);
      
      if (response.status === 'success') {
        setReviewSuccess('Review submitted successfully!');
        setReview('');
        setRating(null);
        setHoveredRating(null);
        
        // Refresh project data to show the new review
        const updatedProject = await getProject(projectId!);
        if (updatedProject.status === 'success') {
          setProject(updatedProject.data);
        }
      } else {
        setReviewError('Failed to submit review');
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.detail || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!project?.reviews || project.reviews.length === 0) return "No ratings yet";
    
    const totalRating = project.reviews.reduce((sum: number, review: any) => {
      return sum + Number(review.rating);
    }, 0);
    
    return (totalRating / project.reviews.length).toFixed(1);
  };

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
  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Project Header */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2">
            <div className="aspect-video bg-gray-700 rounded-lg"></div>
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
            <p className="mb-8 text-gray-400">{project.description}</p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-600 transition"
              >
                Back to Projects
              </button>
              {isOwner && (
                <button
                  className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Project
                </button>
              )}
            </div>
          </div>
        </div>
        )}
        
        {/* Contributors Section - Always visible */}
        {!isEditing && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Project Contributors</h2>
            {isOwner ? (
              <ContributorsList 
                projectId={projectId!}
                contributors={project.contributors || []}
                isOwner={isOwner}
                onContributorRemoved={handleContributorRemoved}
              />
            ) : (
              <div>
                {project.contributors && project.contributors.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {project.contributors.map((contributor: any) => (
                      <li 
                        key={contributor.user_id}
                        className="flex items-center bg-gray-800 p-3 rounded-lg"
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <User className="h-4 w-4" />
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
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!project.reviews || project.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              project.reviews.map((review: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg hover:ring-2 hover:ring-gray-600"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {review.user_id?.substring(0, 2) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">User {review.user_id?.substring(0, 8) || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${Number(review.rating) > i ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">({review.rating}/5)</span>
                  </div>
                  <p className="text-gray-400">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Review Section */}
        {isAuthenticated && !isOwner && (
          <div className="mt-12 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Add Your Review</h2>
            
            {reviewSuccess && (
              <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
                {reviewSuccess}
              </div>
            )}
            
            {reviewError && (
              <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                {reviewError}
              </div>
            )}
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label htmlFor="rating" className="block mb-2 text-sm font-medium">
                  Rating (select stars)
                </label>
                <div 
                  className="flex items-center mb-2"
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-8 w-8 cursor-pointer ${
                        (hoveredRating !== null ? hoveredRating > i : rating && Number(rating) > i) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                      onMouseEnter={() => setHoveredRating(i+1)}
                      onClick={() => setRating(String(i+1))}
                    />
                  ))}
                  <span className="ml-2 text-lg">
                    {hoveredRating ? `${hoveredRating}/5` : rating ? `${rating}/5` : 'Select a rating'}
                  </span>
                </div>
                {!rating && !reviewError && (
                  <p className="text-sm text-gray-400">Please click on the stars to select a rating</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="review" className="block mb-2 text-sm font-medium">
                  Your Review
                </label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your thoughts about this project..."
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none min-h-[100px]"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 ${
                  isSubmitting ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
                } rounded-lg flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
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
      </div>
    </div>
  );
};

export default ProjectDescription;
