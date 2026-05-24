require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const path = require('path');

// Routes
const authRoutes = require('./server/routes/authRoutes.cjs');
const userRoutes = require('./server/routes/userRoutes.cjs');
const productRoutes = require('./server/routes/productRoutes.cjs');
const reviewRoutes = require('./server/routes/reviewRoutes.cjs');
const orderRoutes = require('./server/routes/orderRoutes.cjs');

const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    // If you don't have a Mongo URI in .env, fallback to a local instance
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zivora');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', reviewRoutes); // Review routes mounted on /api/products
app.use('/api/orders', orderRoutes);

// Endpoint to create a Razorpay Order
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
