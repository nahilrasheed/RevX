import { Star, Trash2 } from 'lucide-react';
import { Review } from '../types/project';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { removeReview } from '../api/projects';

interface ReviewListProps {
  reviews: Review[];
  onReviewRemoved?: () => void;
}

const ReviewList = ({ reviews, onReviewRemoved }: ReviewListProps) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoize to avoid recalculation on parent re-renders
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [reviews]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setIsDeleting(reviewId);
    setError(null);
    
    try {
      const response = await removeReview(reviewId);
      if (response.status === 'success') {
        if (onReviewRemoved) {
          onReviewRemoved();
        }
      } else {
        setError('Failed to delete review');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error deleting review');
    } finally {
      setIsDeleting(null);
    }
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet. Be the first!</p>;
  }

  return (
    <div>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedReviews.map((review, index) => (
          <div
            key={review.id || index}
            className={`ring-1 ${user && user.id === review.user_id ? 'ring-indigo-400 bg-indigo-900/10' : 'ring-gray-500'} p-6 rounded-lg hover:ring-2 hover:ring-gray-600 relative transition-all`}
          >
            {user && user.id === review.user_id && (
              <button
                onClick={() => handleDeleteReview(review.id)}
                disabled={isDeleting === review.id}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-800"
                title="Delete review"
              >
                {isDeleting === review.id ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 rounded-full border-white"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            )}
            
            <div className="mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                {review.avatar ? (
                  <img 
                    src={review.avatar} 
                    alt="User avatar" 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full">${review.full_name?.substring(0, 2) || review.username?.substring(0, 2) || 'U'}</div>`;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-sm">
                    {review.full_name?.substring(0, 2) || review.username?.substring(0, 2) || review.user_id?.substring(0, 2) || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="font-semibold">
                    {review.full_name || "Unknown"}
                  </p>
                  {review.username && (
                    <p className="text-sm text-gray-400">@{review.username}</p>
                  )}
                </div>
                <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
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
            
            {review.review ? (
              <p className="text-gray-300 text-sm leading-relaxed">{review.review}</p>
            ) : (
              <p className="text-gray-500 italic text-sm">No review</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
