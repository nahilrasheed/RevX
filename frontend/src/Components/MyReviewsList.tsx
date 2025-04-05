import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyReviews } from '../api/user';
import { removeReview } from '../api/projects';

interface ProjectOwner {
  id: string;
  username: string;
  avatar: string;
  full_name: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Review {
  id: string;
  review: string;
  rating: string;
  created_at: string;
  project: Project;
  project_owner: ProjectOwner;
}

const MyReviewsList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getMyReviews();
      if (response.status === 'success') {
        setReviews(response.data || []);
      } else {
        setError('Failed to load your reviews');
      }
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      setError('Error loading your reviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setIsDeleting(reviewId);
    setError(null);
    
    try {
      const response = await removeReview(reviewId);
      if (response.status === 'success') {
        // Refresh the reviews list after deletion
        fetchReviews();
      } else {
        setError('Failed to delete review');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error deleting review');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">Loading your reviews...</span>
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

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400">You haven't reviewed any projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => {
          const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          });
          
          return (
            <div 
              key={review.id} 
              className="bg-gray-800 rounded-lg p-4 relative hover:ring-1 hover:ring-gray-600 transition-all"
            >
              <button
                onClick={() => handleDeleteReview(review.id)}
                disabled={isDeleting === review.id}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-700"
                title="Delete review"
              >
                {isDeleting === review.id ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 rounded-full border-white"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
                
              <div 
                className="mb-2 cursor-pointer" 
                onClick={() => navigate(`/project/${review.project.id}`)} 
              >
                <h3 className="text-lg font-semibold text-white hover:text-red-200 transition-colors">
                  {review.project.title || `Project ID: ${review.project.id}`}
                </h3>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>

              <div className="flex items-center mb-3 bg-gray-800/50 py-1.5 px-2 rounded">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${Number(review.rating) > i ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">({review.rating}/5)</span>
              </div>
              
              <p className="text-gray-300 text-sm">{review.review}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyReviewsList;