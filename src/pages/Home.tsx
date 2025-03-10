import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { getApiUrl } from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(getApiUrl('/api/products'));
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // For demo, we'll just take the first 3 products
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white py-20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh Food, Local Farmers
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Connect with local farmers and get fresh, high-quality produce delivered to your doorstep
          </p>
          <Link
            to="/products"
            className="bg-white text-green-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-100 transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold mb-2">Local Farmers</h3>
          <p className="text-gray-600">Support your local farming community</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🥬</div>
          <h3 className="text-xl font-semibold mb-2">Fresh Produce</h3>
          <p className="text-gray-600">Get the freshest ingredients delivered</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Direct Connection</h3>
          <p className="text-gray-600">Connect directly with food producers</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to start shopping?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join our community of local food enthusiasts
        </p>
        <Link
          to="/login"
          className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors inline-block"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
} 