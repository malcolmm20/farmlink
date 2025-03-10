import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handlePlaceOrder = () => {
    if (!user || user.role !== 'consumer') {
      localStorage.setItem('returnUrl', '/cart');
      navigate('/login');
      return;
    }

    // Group items by farmer
    const ordersByFarmer = cartItems.reduce((acc, item) => {
      if (!acc[item.farmerId]) {
        acc[item.farmerId] = [];
      }
      acc[item.farmerId].push({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      });
      return acc;
    }, {} as Record<string, { productId: string; quantity: number; price: number; }[]>);

    try {
      // Create an order for each farmer
      Object.entries(ordersByFarmer).forEach(([farmerId, products]) => {
        const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        createOrder({
          consumerId: user.id,
          farmerId,
          products,
          status: 'pending',
          totalAmount
        });
      });

      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);
      alert('Orders placed successfully!');
      navigate('/products'); // Redirect to products page after successful order
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <a
            href="/products"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-green-600 font-semibold mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 