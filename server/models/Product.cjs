const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['press-on', 'polish', 'art-care', 'accessories'] },
  categoryLabel: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  description: { type: String, required: true },
  features: [{ type: String }],
  images: [{ type: String }],
  shapes: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ name: String, hex: String }],
  tags: [{ type: String }],
  inStock: { type: Boolean, default: true },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
