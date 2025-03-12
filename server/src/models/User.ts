import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'farmer', 'admin'], default: 'customer' },
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema); 