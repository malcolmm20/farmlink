import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ reviews, averageRating, totalReviews }: ProductReviewsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
      
      <div className="mt-4 flex items-center">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <StarIcon
              key={rating}
              className={`h-5 w-5 ${
                rating <= averageRating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="ml-2 text-sm text-gray-600">
          {averageRating.toFixed(1)} out of 5 ({totalReviews} reviews)
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {reviews.map((review) => (
          <div key={review._id} className="border-t border-gray-200 pt-8">
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 ${
                      rating <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
            <p className="mt-2 text-sm text-gray-500">By {review.userId.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 