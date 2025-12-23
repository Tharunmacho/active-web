import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  businessType: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'companies'
});

// Compound indexes for faster queries
companySchema.index({ userId: 1, isActive: 1 }); // Most common query pattern
companySchema.index({ userId: 1, status: 1 });
companySchema.index({ businessName: 'text', businessType: 'text' }); // Text search

const Company = mongoose.model('Company', companySchema);

export default Company;

