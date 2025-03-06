export type UserRole = 'farmer' | 'consumer' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
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

export interface Farmer extends User {
  role: 'farmer';
  farmInfo: FarmInfo;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmInfo: FarmInfo;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  quantity: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  consumerId: string;
  farmerId: string;
  products: OrderItem[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  totalAmount: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  consumerId: string;
  farmerId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
} 