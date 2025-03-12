import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function FarmSetup() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    description: user?.farmInfo?.description || '',
    address: user?.farmInfo?.address || '',
    image: user?.farmInfo?.image || '',
    phone: user?.farmInfo?.phone || '',
    hours: user?.farmInfo?.hours || '',
    pickupInstructions: user?.farmInfo?.pickupInstructions || '',
  });
  

  if (!user || user.role !== 'farmer') {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(getApiUrl(`/api/farms/farminfo/${user._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: formData.description,
            address: formData.address,
            image: formData.image, 
            phone: formData.phone, 
            hours: formData.hours, 
            pickupInstructions: formData.pickupInstructions
          }),
      });

      if (!response.ok) {
        throw new Error('Failed to update farm details');
      }

      const updatedUser = await response.json();
      await login(updatedUser);
      toast.success('Farm details updated successfully!');
      navigate('/farmer/dashboard');
    } catch (error) {
      console.error('Error updating farm details:', error);
      toast.error('Failed to update farm details. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Set Up Your Farm Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="block text-2xl font-bold text-gray-700">
                {user?.name}
              </h2>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Tell customers about your farm..."
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="location"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="pickupInstructions" className="block text-sm font-medium text-gray-700">
                Pickup Instructions
              </label>
              <textarea
                id="pickupInstructions"
                value={formData.pickupInstructions}
                onChange={(e) => setFormData({ ...formData, pickupInstructions: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Pickup at the farm on Monday and Wednesday"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                Operating Hours
              </label>
              <input
                type="text"
                id="hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Farm Image URL
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="https://example.com/farm-image.jpg"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Farm Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 