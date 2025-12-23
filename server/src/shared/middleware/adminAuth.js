import jwt from 'jsonwebtoken';
import { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin } from '../models/ExistingAdmins.js';

// Admin authentication middleware
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here-change-in-production');

      // Get admin from appropriate collection based on role
      let admin = null;

      if (decoded.role === 'block_admin') {
        admin = await BlockAdmin.findById(decoded.adminId).select('-passwordHash');
      } else if (decoded.role === 'district_admin') {
        admin = await DistrictAdmin.findById(decoded.adminId).select('-passwordHash');
      } else if (decoded.role === 'state_admin') {
        admin = await StateAdmin.findById(decoded.adminId).select('-passwordHash');
      } else if (decoded.role === 'super_admin') {
        admin = await SuperAdmin.findById(decoded.adminId).select('-passwordHash');
      }

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found'
        });
      }

      if (!admin.active) {
        return res.status(401).json({
          success: false,
          message: 'Admin account is deactivated'
        });
      }

      // Add role from token to admin object
      req.user = admin;
      req.user.role = decoded.role;

      next();
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Middleware to check specific admin roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

export { protect, authorize };
