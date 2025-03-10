import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import ProductReview from './ProductReview';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

interface Farm {
  _id: string;
  name: string;
  description: string;
  location: string;
  products: Product[];
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

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

interface FarmProfileProps {
  farmId: string;
  currentUserId: string | null;
}

export const FarmProfile: React.FC<FarmProfileProps> = ({ farmId, currentUserId }) => {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const [farmResponse, reviewsResponse, productsResponse] = await Promise.all([
          fetch(getApiUrl(`/api/users/${farmId}`)),
          fetch(getApiUrl(`/api/farms/${farmId}/reviews`)),
          fetch(getApiUrl(`/api/farms/${farmId}/products`))
        ]);

        if (!farmResponse.ok || !reviewsResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch farm data');
        }

        const farmData = await farmResponse.json();
        const reviewsData = await reviewsResponse.json();
        const productsData = await productsResponse.json();

        setFarm({
          ...farmData,
          ...reviewsData,
          products: productsData
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmData();
  }, [farmId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !farm) {
    return <div className="text-center py-8 text-red-600">{error || 'Farm not found'}</div>;
  }

  const handleReviewClick = () => {
    if (!currentUserId) {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Farm Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
            <p className="mt-2 text-gray-600">{farm.location}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-2xl font-semibold">{farm.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{farm.totalReviews} reviews</p>
          </div>
        </div>
        <p className="mt-4 text-gray-700">{farm.description}</p>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(farm.products || []).map((product) => (
            <div key={product._id} className="bg-white shadow rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-gray-600">{product.description}</p>
                <p className="mt-2 text-lg font-bold text-indigo-600">${product.price}</p>
                <div className="mt-4">
                  {currentUserId ? (
                    <ProductReview
                      productId={product._id}
                      currentUserId={currentUserId}
                      onReviewSubmitted={() => {
                        // Refresh farm data after review submission
                        window.location.reload();
                      }}
                    />
                  ) : (
                    <button
                      onClick={handleReviewClick}
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Login to Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
        <div className="space-y-6">
          {farm.reviews.map((review) => (
            <div key={review._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{review.userId.name}</p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 