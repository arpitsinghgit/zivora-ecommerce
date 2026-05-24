const express = require('express');
const router = express.Router();
const Product = require('../models/Product.cjs');
const { protect, admin } = require('../middleware/auth.cjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client safely so it doesn't crash the server on boot if env vars are missing
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://missing-url.supabase.co',
  process.env.SUPABASE_KEY || 'missing-key'
);

// Multer setup using memory storage for direct upload to Supabase
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

// @desc    Fetch all products with pagination and filtering
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'all' 
      ? { category: req.query.category } 
      : {};

    const shape = req.query.shape && req.query.shape !== 'All'
      ? { shapes: req.query.shape }
      : {};

    const size = req.query.size && req.query.size !== 'All'
      ? { sizes: req.query.size }
      : {};

    let priceFilter = {};
    if (req.query.priceRange && req.query.priceRange !== 'All') {
      if (req.query.priceRange === 'under-20') priceFilter = { price: { $lt: 300 } };
      else if (req.query.priceRange === '20-40') priceFilter = { price: { $gte: 300, $lte: 800 } };
      else if (req.query.priceRange === 'over-40') priceFilter = { price: { $gt: 800 } };
    }

    const filter = { ...keyword, ...category, ...shape, ...size, ...priceFilter };

    let sortObj = {};
    if (req.query.sortBy === 'price-low') sortObj = { price: 1 };
    else if (req.query.sortBy === 'price-high') sortObj = { price: -1 };
    else if (req.query.sortBy === 'rating') sortObj = { rating: -1 };
    else if (req.query.sortBy === 'newest') sortObj = { newArrival: -1, createdAt: -1 };
    else sortObj = { createdAt: -1 }; // default

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Seed the database with default products
// @route   GET /api/products/seed
// @access  Public (Temporary for setup)
router.get('/seed', async (req, res) => {
  try {
    const productsData = require('../data.cjs');
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(productsData);
    res.json({ message: 'Database seeded successfully', count: createdProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }) || await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload image to Supabase
// @route   POST /api/products/upload
// @access  Private/Admin
router.post('/upload', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
      
      const { data, error } = await supabase
        .storage
        .from('products')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('products')
        .getPublicUrl(fileName);

      res.json({ imageUrl: publicUrlData.publicUrl });
    } else {
      res.status(400).json({ message: 'No image file uploaded' });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product({
      id: req.body.id || 'new-product-' + Date.now(),
      name: req.body.name || 'Sample name',
      price: req.body.price || 0,
      user: req.user._id,
      images: req.body.images || [],
      category: req.body.category || 'press-on',
      categoryLabel: req.body.categoryLabel || 'Sample',
      description: req.body.description || 'Sample description',
      features: req.body.features || [],
      shapes: req.body.shapes || [],
      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      tags: req.body.tags || [],
      inStock: true
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }) || await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.description = req.body.description || product.description;
      product.category = req.body.category || product.category;
      product.categoryLabel = req.body.categoryLabel || product.categoryLabel;
      product.inStock = req.body.inStock !== undefined ? req.body.inStock : product.inStock;
      product.images = req.body.images || product.images;
      product.bestSeller = req.body.bestSeller !== undefined ? req.body.bestSeller : product.bestSeller;
      product.newArrival = req.body.newArrival !== undefined ? req.body.newArrival : product.newArrival;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }) || await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
