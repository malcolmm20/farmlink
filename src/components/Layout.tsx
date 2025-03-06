import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    ...(user?.role === 'farmer' ? [{ name: 'Farmer Dashboard', href: '/farmer/dashboard' }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Admin Dashboard', href: '/admin/dashboard' }] : []),
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold">🌾 Farmlink</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={clsx(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium',
                      location.pathname === link.href
                        ? 'text-white border-b-2 border-white'
                        : 'text-green-100 hover:text-white hover:border-green-200'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="p-2 text-green-100 hover:text-white rounded-full hover:bg-green-700"
              >
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-green-100 hover:text-white rounded-full hover:bg-green-700"
                >
                  <UserIcon className="h-6 w-6" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {user ? (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-700">
                            Signed in as<br/>
                            <span className="font-medium">{user.name}</span>
                          </div>
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign in
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-green-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p>© 2024 Farmlink. All rights reserved.</p>
            <p className="mt-2 text-sm text-green-200">
              Connecting local farmers with urban consumers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 