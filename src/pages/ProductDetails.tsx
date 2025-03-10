import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductReview from '../components/ProductReview';
import ProductReviews from '../components/ProductReviews';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  farmId: {
    _id: string;
    name: string;
    location: string;
  };
  stock: number;
  unit: string;
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

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${id}/reviews`);
        if (!response.ok) throw new Error('Failed to load reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data._id);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    Promise.all([fetchProduct(), fetchReviews(), fetchCurrentUser()])
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmitted = async () => {
    try {
      const response = await fetch(`/api/products/${id}/reviews`);
      if (!response.ok) throw new Error('Failed to load reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh reviews');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700">{product.description}</div>
          </div>
          <div className="mt-8">
            <div className="flex items-center">
              <p className="text-sm text-gray-500">
                Sold by{' '}
                <Link 
                  to={`/farm/${product.farmId._id}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {product.farmId.name}
                </Link>
              </p>
            </div>
            {product.farmId.location && (
              <p className="mt-1 text-sm text-gray-500">
                Location: {product.farmId.location}
              </p>
            )}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Stock: {product.stock} {product.unit}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        {reviews && (
          <ProductReviews
            reviews={reviews.reviews}
            averageRating={reviews.averageRating}
            totalReviews={reviews.totalReviews}
          />
        )}
        
        <ProductReview
          productId={product._id}
          currentUserId={currentUserId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
} 