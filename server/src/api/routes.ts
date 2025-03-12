import express, { Request, Response, Router } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Review } from '../models/Review';

const router: Router = Router();

// User Routes
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid user data' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid user data' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

// Product Routes
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('farmId', 'name location');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmId', 'name location');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    
    // Map frontend field names to backend field names
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      image: req.body.image,
      stock: parseInt(req.body.stock),
      available: req.body.available,
      unit: 'kg', // Default unit
      farmId: req.body.farmId,
    };
    
    // Create new product with mapped data
    const product = new Product(productData);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid product data' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid product data' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

// Order Routes
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.post('/orders', async (req, res) => {
  const order = new Order(req.body);
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid order data' });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid order data' });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

// Review Routes
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.post('/reviews', async (req, res) => {
  const review = new Review(req.body);
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid review data' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid review data' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

// Farm Reviews Routes
router.get('/farms/:farmId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ farmId: req.params.farmId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const averageRating = reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / reviews.length;
    
    res.json({
      reviews,
      averageRating: reviews.length > 0 ? averageRating : 0,
      totalReviews: reviews.length
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

router.post('/farms/:farmId/reviews', async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      farmId: req.params.farmId,
      userId: req.body.userId // This should be the authenticated user's ID
    });
    
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Invalid review data' });
  }
});

// Product Reviews Routes
router.get('/products/:productId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const averageRating = reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / reviews.length;
    
    res.json({
      reviews,
      averageRating: reviews.length > 0 ? averageRating : 0,
      totalReviews: reviews.length
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

// Get products by farm ID
router.get('/farms/:farmId/products', async (req, res) => {
  try {
    const products = await Product.find({ farmId: req.params.farmId });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
});

export default router; 