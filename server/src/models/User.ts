import mongoose from 'mongoose';

const farmInfoSchema = new mongoose.Schema({
  address: { type: String },
  pickupInstructions: { type: String },
  phone: { type: String },
  description: { type: String },
  hours: { type: String },
  image: { type: String },
  email: { type: String }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'farmer', 'admin'], default: 'customer' },
  location: { type: String },
  description: { type: String },
  farmInfo: { type: farmInfoSchema, default: null }, // Allows farmInfo to be added later
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
