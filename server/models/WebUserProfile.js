import mongoose from 'mongoose';

// Web Users collection - Stores all user profile details
const webUserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  block: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['member', 'block_admin', 'district_admin', 'state_admin', 'super_admin'],
    default: 'member'
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'web users'
});

const WebUserProfile = mongoose.model('WebUserProfile', webUserProfileSchema);

export default WebUserProfile;
