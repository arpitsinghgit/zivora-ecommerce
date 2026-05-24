const express = require('express');
const router = express.Router();
const User = require('../models/User.cjs');
const { protect } = require('../middleware/auth.cjs');

// @desc    Get user cart
// @route   GET /api/user/cart
// @access  Private
router.get('/cart', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user cart
// @route   PUT /api/user/cart
// @access  Private
router.put('/cart', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = req.body.cart;
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user wishlist
// @route   PUT /api/user/wishlist
// @access  Private
router.put('/wishlist', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.wishlist = req.body.wishlist; // array of product IDs
    await user.save();
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Get user addresses
// @route   GET /api/user/addresses
// @access  Private
router.get('/addresses', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user addresses
// @route   PUT /api/user/addresses
// @access  Private
router.put('/addresses', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addresses = req.body.addresses;
    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
