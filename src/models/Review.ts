import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Either productId or farmId must be present, but not both
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to farm user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Add validation to ensure either productId or farmId is present, but not both
reviewSchema.pre('validate', function(next) {
  if ((!this.productId && !this.farmId) || (this.productId && this.farmId)) {
    next(new Error('Review must have either a productId or farmId, but not both'));
  }
  next();
});

export const Review = mongoose.model('Review', reviewSchema); 