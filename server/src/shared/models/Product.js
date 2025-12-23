import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  productImage: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'products'
});

// Compound indexes for faster queries
productSchema.index({ userId: 1, companyId: 1 }); // Most common query pattern
productSchema.index({ userId: 1, status: 1 });
productSchema.index({ companyId: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ productName: 'text', description: 'text', category: 'text' }); // Text search

const Product = mongoose.model('Product', productSchema);

export default Product;

