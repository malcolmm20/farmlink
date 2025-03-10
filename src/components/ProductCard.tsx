import React from 'react';
import { Product } from '../types';
import { StarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

export default function ProductCard({ product, onAddToCart, showActions = true }: ProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {(!product.available || product.stock === 0) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        {product.farm && (
          <p className="text-sm text-gray-500">{product.farm.name}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 rounded-full text-xs ${
              product.stock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <StarIcon className="h-5 w-5 text-gray-300" />
          <span className="ml-2 text-sm text-gray-600">(4.0)</span>
        </div>
        {showActions && onAddToCart && product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
} 