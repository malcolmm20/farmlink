export type UserRole = 'farmer' | 'customer' | 'admin';

export interface User {
  _id: string;
  name: string;
  username: string;
  role: UserRole;
  farmInfo?: FarmInfo;
  createdAt: Date;
}

export interface FarmInfo {
  name: string;
  address: string;
  pickupInstructions?: string;
  phone?: string;
  description?: string;
  hours?: string;
  image?: string;
  email: string;
}

export interface Farm extends User {
  role: 'farmer';
  farmInfo: FarmInfo;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  farmId: string;
  farm?: Farm;
  stock: number;
  available: boolean;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  description: string;
  image: string;
  category: string;
  farmId: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  totalAmount: number;
  shippingAddress: string;
  createdAt: Date;
}

export interface Review {
  _id: string;
  productId?: string;
  farmId?: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem extends Product {
  productId?: string
  quantity: number;
  farmId: string;
} 