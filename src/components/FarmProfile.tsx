import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import ProductReview from './ProductReview';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';
import { Farm, Product, Review } from '../types';


interface FarmProfileProps {
  farmId: string;
  currentUserId: string | null;
}

export const FarmProfile: React.FC<FarmProfileProps> = ({ farmId, currentUserId }) => {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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

        setFarm(farmData);
        setReviews(reviewsData ?? []);
        setProducts(productsData ?? []);
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
        {/* Farm Name & Address */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
            <p className="mt-2 text-gray-600">{farm.farmInfo?.address}</p>
          </div>
          
          {/* Rating */}
          <div className="text-center">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-2xl font-semibold">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
                  : 'No Ratings'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{reviews.length} reviews</p>
          </div>
        </div>

        {/* Farm Description */}
        <p className="mt-4 text-gray-700">{farm.farmInfo?.description}</p>

        {/* Farm Details Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        {farm.farmInfo?.hours && (
          <div className="flex items-center">
            ⏰ <span className="ml-2"><strong>Hours:</strong> {farm.farmInfo.hours}</span>
          </div>
        )}
        {farm.farmInfo?.pickupInstructions && (
          <div className="flex items-center">
            📦 <span className="ml-2"><strong>Pickup:</strong> {farm.farmInfo.pickupInstructions}</span>
          </div>
        )}
        {farm.farmInfo?.phone && (
          <div className="flex items-center">
            📞 <span className="ml-2"><strong>Phone:</strong> {farm.farmInfo.phone}</span>
          </div>
        )}
        {farm.farmInfo?.email && (
          <div className="flex items-center">
            ✉️ <span className="ml-2"><strong>Email:</strong> {farm.farmInfo.email}</span>
          </div>
        )}
      </div>
    </div>


      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(products || []).map((product) => (
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
          {reviews.map((review) => (
            <div key={review._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
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