import { Star } from 'lucide-react';
import { Review } from '../types/project';
import { useMemo } from 'react';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  // Memoize to avoid recalculation on parent re-renders
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [reviews]);

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet. Be the first!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedReviews.map((review, index) => (
        <div
          key={review.id || index}
          className="bg-gray-800 p-6 rounded-lg hover:ring-2 hover:ring-gray-600"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              {review.avatar ? (
                <img 
                  src={review.avatar} 
                  alt="User avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                review.full_name?.substring(0, 2) || review.username?.substring(0, 2) || review.user_id?.substring(0, 2) || 'U'
              )}
            </div>
            <div>
              <p className="font-semibold">
                {review.full_name || review.username || `User ${review.user_id?.substring(0, 8)}`}
              </p>
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
      ))}
    </div>
  );
};

export default ReviewList;
