const express = require('express');
const router = express.Router();
const Product = require('../models/Product.cjs');
const { protect, admin } = require('../middleware/auth.cjs');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product by generic ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Check if valid ObjectId or string ID
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
      image: req.body.image || '/images/sample.jpg',
      category: req.body.category || 'Sample category',
      categoryLabel: req.body.categoryLabel || 'Sample',
      description: req.body.description || 'Sample description',
      images: req.body.images || [],
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
      product.image = req.body.image || product.image;
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
