import jwt from 'jsonwebtoken';
import WebUser from '../src/shared/models/WebUser.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      console.log('🔐 Member auth - verifying token');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here-change-in-production');

      console.log('✅ Token decoded:', { 
        id: decoded.id, 
        userId: decoded.userId,
        email: decoded.email 
      });

      // Get user from token (handle both 'id' and 'userId' fields)
      const userId = decoded.id || decoded.userId;
      req.user = await WebUser.findById(userId).select('-password');

      if (!req.user) {
        console.log('❌ User not found for ID:', userId);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } else {
    console.log('❌ No authorization header found');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Optional authentication - adds user to request if token exists, but doesn't require it
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here-change-in-production');
      const userId = decoded.id || decoded.userId;
      req.user = await WebUser.findById(userId).select('-password');
      console.log('✅ Optional auth - user authenticated:', req.user?.email || 'none');
    } catch (error) {
      console.log('⚠️ Optional auth - invalid token, proceeding without user');
    }
  } else {
    console.log('✅ Optional auth - no token, proceeding without user');
  }
  
  // Always proceed to next middleware/controller
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
