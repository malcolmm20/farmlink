import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { createUser } from '../lib/db';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('consumer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we'll just create a new user and store it in localStorage
    const user = createUser({ name, role });
    localStorage.setItem('user', JSON.stringify(user));
    
    // Check for return URL
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      // If returning from cart, ensure user is a consumer
      if (returnUrl === '/cart' && role !== 'consumer') {
        alert('Please log in as a consumer to place orders.');
        localStorage.setItem('user', '');
        setRole('consumer');
        return;
      }
      navigate(returnUrl);
      return;
    }
    
    // Default redirects based on role
    if (role === 'farmer') {
      navigate('/farmer/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Farmlink</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="consumer">Consumer</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Note: This is a demo version. No password required.
        </p>
      </div>
    </div>
  );
} 