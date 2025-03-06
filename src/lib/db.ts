import { User, Product, Order, Review, FarmInfo } from '../types';

// Sample farm data
export const sampleFarms: Record<string, FarmInfo> = {
  farm1: {
    name: "Green Valley Farm",
    address: "123 Rural Route, Farmington, ST 12345",
    pickupInstructions: "Follow the gravel driveway past the main house. Look for the green barn on your right. Park in the designated area and ring the doorbell at the side entrance. If no one answers, call the farm phone number.",
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    phone: "(555) 123-4567",
    email: "contact@greenvalleyfarm.com"
  },
  farm2: {
    name: "Sunset Ranch",
    address: "456 Country Lane, Ruralville, ST 67890",
    pickupInstructions: "Enter through the main gate (code will be provided after purchase). Drive to the red farmhouse and park in front of the farm store. If picking up outside store hours, text the farm phone number 15 minutes before arrival.",
    hours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "8:00 AM - 2:00 PM"
    },
    phone: "(555) 987-6543",
    email: "info@sunsetranch.com"
  }
};

// Sample initial data
const sampleProducts: Product[] = [
  {
    id: '1',
    farmerId: 'farmer1',
    farmerName: "John Smith",
    farmInfo: sampleFarms.farm1,
    name: 'Fresh Tomatoes',
    description: 'Locally grown organic tomatoes, picked at peak ripeness. Perfect for salads, sandwiches, or cooking. Grown without pesticides and harvested by hand.',
    price: 4.99,
    category: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264fde376',
    available: true,
    quantity: 50,
    createdAt: new Date()
  },
  {
    id: '2',
    farmerId: 'farmer1',
    farmerName: "John Smith",
    farmInfo: sampleFarms.farm1,
    name: 'Organic Eggs',
    description: 'Free-range organic eggs from happy chickens. Our hens are fed organic feed and have plenty of space to roam. Each egg is hand-collected daily.',
    price: 5.99,
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f',
    available: true,
    quantity: 100,
    createdAt: new Date()
  },
  {
    id: '3',
    farmerId: 'farmer2',
    farmerName: "Sarah Johnson",
    farmInfo: sampleFarms.farm2,
    name: 'Grass-fed Beef',
    description: 'Premium grass-fed beef from our heritage cattle. Raised on open pastures without hormones or antibiotics. Known for exceptional marbling and flavor.',
    price: 15.99,
    category: 'meat',
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
    available: true,
    quantity: 25,
    createdAt: new Date()
  },
  {
    id: '4',
    farmerId: 'farmer1',
    farmerName: "John Smith",
    farmInfo: sampleFarms.farm1,
    name: 'Fresh Carrots',
    description: 'Organic carrots freshly harvested from our rich soil. Sweet, crunchy, and perfect for snacking or cooking. Grown using sustainable farming practices.',
    price: 3.99,
    category: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    available: true,
    quantity: 75,
    createdAt: new Date()
  },
  {
    id: '5',
    farmerId: 'farmer2',
    farmerName: "Sarah Johnson",
    farmInfo: sampleFarms.farm2,
    name: 'Raw Honey',
    description: 'Pure, unfiltered honey from our local bee colonies. Our bees forage on wildflowers, resulting in a unique and delicious honey with natural health benefits.',
    price: 8.99,
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
    available: true,
    quantity: 30,
    createdAt: new Date()
  }
];

// Initialize localStorage with sample data if empty or update existing products
const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
if (existingProducts.length === 0 || !existingProducts[0].hasOwnProperty('quantity')) {
  localStorage.setItem('products', JSON.stringify(sampleProducts));
}

// Initialize other storage if empty
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify([]));
}
if (!localStorage.getItem('reviews')) {
  localStorage.setItem('reviews', JSON.stringify([]));
}

// User operations
export const createUser = (user: Omit<User, 'id' | 'createdAt'>) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const id = Math.random().toString(36).substr(2, 9);
  const newUser = { ...user, id, createdAt: new Date() };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const getUser = (id: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((u: User) => u.id === id);
};

// Product operations
export const updateProductQuantity = (productId: string, quantityChange: number) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find((p: Product) => p.id === productId);
  
  if (product) {
    product.quantity += quantityChange;
    product.available = product.quantity > 0;
    localStorage.setItem('products', JSON.stringify(products));
    return product;
  }
  return null;
};

export const createProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const id = Math.random().toString(36).substr(2, 9);
  const newProduct = { ...product, id, createdAt: new Date() };
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  return newProduct;
};

export const getProducts = () => {
  return JSON.parse(localStorage.getItem('products') || '[]');
};

export const getFarmerProducts = (farmerId: string) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products.filter((p: Product) => p.farmerId === farmerId);
};

export const updateProduct = (productId: string, updates: Partial<Product>) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const index = products.findIndex((p: Product) => p.id === productId);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    localStorage.setItem('products', JSON.stringify(products));
    return products[index];
  }
  return null;
};

export const deleteProduct = (productId: string) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const filteredProducts = products.filter((p: Product) => p.id !== productId);
  localStorage.setItem('products', JSON.stringify(filteredProducts));
  return filteredProducts.length < products.length;
};

// Order operations
export const createOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const id = Math.random().toString(36).substr(2, 9);
  const newOrder = { ...order, id, createdAt: new Date() };
  
  // Update product quantities
  order.products.forEach(item => {
    updateProductQuantity(item.productId, -item.quantity);
  });
  
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  return newOrder;
};

export const getOrdersByConsumer = (consumerId: string) => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.filter((o: Order) => o.consumerId === consumerId);
};

export const getOrdersByFarmer = (farmerId: string) => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.filter((o: Order) => o.farmerId === farmerId);
};

// Review operations
export const createReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  const id = Math.random().toString(36).substr(2, 9);
  const newReview = { ...review, id, createdAt: new Date() };
  reviews.push(newReview);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  return newReview;
};

export const getProductReviews = (productId: string) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  return reviews.filter((r: Review) => r.productId === productId);
}; 