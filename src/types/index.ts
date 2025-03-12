export type UserRole = 'farmer' | 'consumer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  description?: string;
  phone?: string;
  createdAt: Date;
}

export interface FarmInfo {
  name: string;
  address: string;
  pickupInstructions: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  phone: string;
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
  quantity: number;
  farmId: string;
} 