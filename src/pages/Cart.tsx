import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { getApiUrl } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError('Please log in to checkout');
      setLoading(false);
      return;
    }

    const itemsByFarm = cartItems.reduce((acc: { [key: string]: CartItem[] }, item) => {
      const farmId = item.farmId || 'unknown';
      console.log(item)
      if (!acc[farmId]) acc[farmId] = [];
      acc[farmId].push(item);
      return acc;
    }, {});

    try {
      await Promise.all(
        Object.entries(itemsByFarm).map(async ([farmId, items]) => {
          console.log(items)
          const orderData = {
            userId: user._id, // Add userId from authenticated user
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              description: item.description,
              image: item.image,
              category: item.category,
              farmId: item.farmId,
            })),
            farmId,
            totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          };
          console.log(orderData) 
          const response = await fetch(getApiUrl('/api/orders'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add auth token if required by backend
              // 'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify(orderData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
          }
        })
      );

      localStorage.setItem('cart', '[]');
      setCartItems([]);
      alert('Orders placed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place orders');
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="space-y-8">
        {cartItems.map(item => (
          <div key={item._id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total: ${total.toFixed(2)}
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 