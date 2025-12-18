import { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin } from '../models/ExistingAdmins.js';
import jwt from 'jsonwebtoken';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Try to find admin in all collections
    let admin = null;
    let adminRole = null;

    // Check BlockAdmin
    admin = await BlockAdmin.findOne({ email: email.toLowerCase(), active: true });
    console.log('📋 BlockAdmin search result:', admin ? `Found: ${admin.email}` : 'Not found');
    if (admin) adminRole = 'block_admin';

    // Check DistrictAdmin if not found
    if (!admin) {
      admin = await DistrictAdmin.findOne({ email: email.toLowerCase(), active: true });
      if (admin) adminRole = 'district_admin';
    }

    // Check StateAdmin if not found
    if (!admin) {
      admin = await StateAdmin.findOne({ email: email.toLowerCase(), active: true });
      if (admin) adminRole = 'state_admin';
    }

    // Check SuperAdmin if not found
    if (!admin) {
      admin = await SuperAdmin.findOne({ email: email.toLowerCase(), active: true });
      if (admin) adminRole = 'super_admin';
    }

    if (!admin) {
      console.log('❌ Admin not found in any collection');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Admin found:', { email: admin.email, role: adminRole, hasPasswordHash: !!admin.passwordHash });

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    console.log('🔑 Password validation:', isPasswordValid ? 'Valid' : 'Invalid');

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login time
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email,
        role: adminRole,
        state: admin.meta?.state,
        district: admin.meta?.district,
        block: admin.meta?.block
      },
      process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
      { expiresIn: '24h' }
    );

    // Return admin data (without password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id.toString(),
          adminId: admin.adminId,
          fullName: admin.fullName,
          email: admin.email,
          role: adminRole,
          state: admin.meta?.state,
          district: admin.meta?.district,
          block: admin.meta?.block
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current admin info
// @route   GET /api/admin/me
// @access  Private (Admin only)
const getAdminInfo = async (req, res) => {
  try {
    // Admin info is already in req.user from middleware
    const adminData = {
      id: req.user._id.toString(),
      adminId: req.user.adminId,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      state: req.user.meta?.state,
      district: req.user.meta?.district,
      block: req.user.meta?.block,
      active: req.user.active,
      lastLoginAt: req.user.lastLoginAt
    };

    res.status(200).json({
      success: true,
      data: adminData
    });

  } catch (error) {
    console.error('Get admin info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const Application = (await import('../models/Application.js')).default;
    const admin = req.user;

    console.log('📊 Getting dashboard stats for admin:', {
      email: admin.email,
      role: admin.role,
      state: admin.meta?.state,
      district: admin.meta?.district,
      block: admin.meta?.block
    });

    let query = {};
    const adminState = admin.meta?.state;
    const adminDistrict = admin.meta?.district;
    const adminBlock = admin.meta?.block;

    // Filter applications based on admin role and location
    if (admin.role === 'block_admin') {
      query = {
        state: adminState,
        district: adminDistrict,
        block: adminBlock,
        status: 'pending_block_approval'
      };
    } else if (admin.role === 'district_admin') {
      query = {
        state: adminState,
        district: adminDistrict,
        status: 'pending_district_approval'
      };
    } else if (admin.role === 'state_admin') {
      query = {
        state: adminState,
        status: 'pending_state_approval'
      };
    }

    console.log('🔍 Dashboard stats query:', query);

    const pendingCount = await Application.countDocuments(query);
    
    console.log(`✅ Found ${pendingCount} pending applications`);

    // Approved count (at this admin level)
    let approvedQuery = { ...query };
    if (admin.role === 'block_admin') {
      approvedQuery['approvals.block.status'] = 'approved';
    } else if (admin.role === 'district_admin') {
      approvedQuery['approvals.district.status'] = 'approved';
    } else if (admin.role === 'state_admin') {
      approvedQuery['approvals.state.status'] = 'approved';
    }

    const approvedCount = await Application.countDocuments(approvedQuery);

    // Total applications in this admin's jurisdiction
    const totalQuery = {
      state: adminState,
      ...(adminDistrict && { district: adminDistrict }),
      ...(adminBlock && { block: adminBlock })
    };
    const totalCount = await Application.countDocuments(totalQuery);

    res.status(200).json({
      success: true,
      data: {
        pending: pendingCount,
        approved: approvedCount,
        total: totalCount,
        role: admin.role,
        location: {
          state: adminState,
          district: adminDistrict,
          block: adminBlock
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export {
  adminLogin,
  getAdminInfo,
  getDashboardStats
};
