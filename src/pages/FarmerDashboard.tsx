import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import { getApiUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'vegetables',
    image: '',
    available: true,
    stock: 0,
    farmId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'farmer') {
        navigate('/login');
        return;
      }

      try {
        // Fetch farmer's products
        const productsResponse = await fetch(getApiUrl(`/api/products?farmId=${user._id}`));
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const farmerProducts = await productsResponse.json();

        // Fetch farmer's orders
        const ordersResponse = await fetch(getApiUrl(`/api/orders?farmId=${user._id}`));
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const farmerOrders = await ordersResponse.json();

        setProducts(farmerProducts);
        setOrders(farmerOrders);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
        alert('Failed to load dashboard data. Please refresh the page.');
      }
    };

    fetchData();
  }, [user?._id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(getApiUrl(`/api/products/${editingProduct._id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price || 0,
            category: newProduct.category,
            image: newProduct.image || 'https://images.unsplash.com/photo-1556742393-75aa5a16b0c3',
            stock: newProduct.stock || 0,
            available: newProduct.available,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p));
        setEditingProduct(null);
      } else {
        // Create new product
        const response = await fetch(getApiUrl('/api/products'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price || 0,
            category: newProduct.category,
            image: newProduct.image || 'https://images.unsplash.com/photo-1556742393-75aa5a16b0c3',
            stock: newProduct.stock || 0,
            available: newProduct.available,
            farmId: user._id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create product');
        }

        const newProductData = await response.json();
        setProducts([...products, newProductData]);
      }

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'vegetables',
        image: '',
        available: true,
        stock: 0,
        farmId: '',
      });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      available: product.available,
      stock: product.stock,
      farmId: product.farmId || '',
    });
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(getApiUrl(`/api/products/${productId}`), {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Farmer Dashboard</h1>

      {/* Add/Edit Product Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => {
                const value = e.target.value;
                setNewProduct({ 
                  ...newProduct, 
                  stock: value === '' ? 0 : parseInt(value, 10) || 0 
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="vegetables">Vegetables</option>
              <option value="meat">Meat</option>
              <option value="dairy">Dairy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
            <input
              type="url"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newProduct.available}
              onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Available</label>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    description: '',
                    price: 0,
                    category: 'vegetables',
                    image: '',
                    available: true,
                    stock: 0,
                    farmId: '',
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="relative">
              <ProductCard product={product} showActions={false} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 