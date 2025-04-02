import { useState } from 'react';
import { Star } from 'lucide-react';
import { addReview } from '../api/projects';
import { ReviewFormData } from '../types/project';

interface AddReviewFormProps {
  projectId: string;
  onReviewAdded: () => void;
}

const AddReviewForm = ({ projectId, onReviewAdded }: AddReviewFormProps) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!review.trim()) {
      setError('Please enter a review');
      return;
    }
    
    if (!rating) {
      setError('Please select a rating (1-5 stars)');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      const reviewData: ReviewFormData = {
        review: review.trim(),
        rating: rating
      };
      
      const response = await addReview(projectId, reviewData);
      
      if (response.status === 'success') {
        setSuccess('Review submitted successfully!');
        setReview('');
        setRating(null);
        setHoveredRating(null);
        onReviewAdded();
      } else {
        setError('Failed to submit review');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Your Review</h2>
      
      {success && (
        <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
          {!rating && !error && (
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
  );
};

export default AddReviewForm;
