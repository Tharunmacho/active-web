import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { adminDbConnection } from '../config/multiDatabase.js';

// Block Admin Schema (maps to blockadmins collection)
const blockAdminSchema = new mongoose.Schema({
  adminId: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'BlockAdmin'
  },
  active: {
    type: Boolean,
    default: true
  },
  meta: {
    state: String,
    district: String,
    block: String,
    stateLc: String,
    districtLc: String,
    blockLc: String,
    mustResetPassword: Boolean
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}, {
  collection: 'blockadmins',
  timestamps: true
});

// Method to compare passwords
blockAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// District Admin Schema (maps to districtadmins collection)
const districtAdminSchema = new mongoose.Schema({
  adminId: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'DistrictAdmin'
  },
  active: {
    type: Boolean,
    default: true
  },
  meta: {
    state: String,
    district: String,
    stateLc: String,
    districtLc: String,
    mustResetPassword: Boolean
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}, {
  collection: 'districtadmins',
  timestamps: true
});

districtAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// State Admin Schema (maps to stateadmins collection)
const stateAdminSchema = new mongoose.Schema({
  adminId: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'StateAdmin'
  },
  active: {
    type: Boolean,
    default: true
  },
  meta: {
    state: String,
    stateLc: String,
    mustResetPassword: Boolean
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}, {
  collection: 'stateadmins',
  timestamps: true
});

stateAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Super Admin Schema (maps to superadmins collection)
const superAdminSchema = new mongoose.Schema({
  adminId: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'SuperAdmin'
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}, {
  collection: 'superadmins',
  timestamps: true
});

superAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Create models using adminDbConnection
const BlockAdmin = adminDbConnection.model('BlockAdmin', blockAdminSchema);
const DistrictAdmin = adminDbConnection.model('DistrictAdmin', districtAdminSchema);
const StateAdmin = adminDbConnection.model('StateAdmin', stateAdminSchema);
const SuperAdmin = adminDbConnection.model('SuperAdmin', superAdminSchema);

export { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin };
