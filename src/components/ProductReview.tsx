import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { getApiUrl } from '../utils/api';

interface ProductReviewProps {
  productId: string;
  currentUserId: string | null;
  onReviewSubmitted: () => void;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function ProductReview({ productId, currentUserId, onReviewSubmitted }: ProductReviewProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      setError('Please log in to submit a review');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId,
          userId: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reset form
      setFormData({ rating: 5, comment: '' });
      onReviewSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingChange(rating)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  rating <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Share your thoughts about this product..."
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
} 