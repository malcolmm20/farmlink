import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

interface Farm {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  image?: string;
  role: string;
}

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch(getApiUrl('/api/users?role=farmer'));
        if (!response.ok) {
          throw new Error('Failed to fetch farms');
        }
        const data = await response.json();
        setFarms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load farms');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Local Farms</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <Link
            key={farm._id}
            to={`/farm/${farm._id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
              <img
                src={farm.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'}
                alt={farm.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{farm.name}</h2>
              {farm.location && (
                <p className="text-gray-600 mb-2">
                  <span className="inline-block mr-2">📍</span>
                  {farm.location}
                </p>
              )}
              {farm.description && (
                <p className="text-gray-600 line-clamp-2">{farm.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {farms.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No farms found. Check back later!
        </div>
      )}
    </div>
  );
} 