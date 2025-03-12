import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { getApiUrl } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/products/${id}`));
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!user || !product) return;

    try {
      const response = await fetch(getApiUrl(`/api/cart/${user._id}/add`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      alert('Added to cart!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-2 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <StarIcon className="h-5 w-5 text-gray-300" />
            <span className="ml-2 text-sm text-gray-600">(4.0)</span>
          </div>
          <p className="mt-4 text-2xl text-green-600 font-bold">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="mt-1 flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-l hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 text-center border-t border-b"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1 border rounded-r hover:bg-gray-100"
              >
                +
              </button>
              <span className="ml-4 text-sm text-gray-500">
                {product.stock} available
              </span>
            </div>
          </div>

          <button
            onClick={() => handleAddToCart()}
            disabled={!product.available || product.stock === 0}
            className="mt-8 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Farm Information */}
      {product.farm && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{product.farm.name}</h3>
              <div className="space-y-4">
                <p className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  {product.farm.farmInfo?.address}
                </p>
                <p className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  {product.farm.farmInfo?.phone}
                </p>
                <p className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  {product.farm.username}
                </p>
                {product.farm.farmInfo?.description && (
                  <div className="mt-6 bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">About the Farm</h4>
                    <p className="text-green-700">{product.farm.farmInfo?.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Hours of Operation
              </h3>
              <div className="space-y-2">
                {product.farm?.farmInfo?.hours && (
                  <p>{product.farm?.farmInfo?.hours}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 