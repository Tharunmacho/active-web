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

    console.log('✅ Admin found:', { 
      email: admin.email, 
      role: adminRole, 
      hasPasswordHash: !!admin.passwordHash,
      meta: admin.meta,
      'meta.state': admin.meta?.state,
      'meta.district': admin.meta?.district,
      'meta.block': admin.meta?.block
    });

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
    const tokenPayload = {
      adminId: admin._id.toString(),
      email: admin.email,
      role: adminRole,
      state: admin.meta?.state,
      district: admin.meta?.district,
      block: admin.meta?.block
    };
    
    console.log('🎫 Creating JWT token with payload:', tokenPayload);
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
      { expiresIn: '24h' }
    );

    // Return admin data (without password)
    const responseData = {
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
    };
    
    console.log('📤 Sending login response:', responseData);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: responseData
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

    // Build base query for admin's jurisdiction
    const baseQuery = {};
    if (admin.role === 'block_admin') {
      baseQuery.state = adminState;
      baseQuery.district = adminDistrict;
      baseQuery.block = adminBlock;
    } else if (admin.role === 'district_admin') {
      baseQuery.state = adminState;
      baseQuery.district = adminDistrict;
    } else if (admin.role === 'state_admin') {
      baseQuery.state = adminState;
    }

    console.log('🔍 Dashboard stats base query:', baseQuery);

    // Total applications in this admin's jurisdiction
    const totalCount = await Application.countDocuments(baseQuery);
    
    // Pending applications (at current admin's level)
    const pendingQuery = { ...baseQuery };
    if (admin.role === 'block_admin') {
      pendingQuery.status = 'pending_block_approval';
    } else if (admin.role === 'district_admin') {
      pendingQuery.status = 'pending_district_approval';
    } else if (admin.role === 'state_admin') {
      pendingQuery.status = 'pending_state_approval';
    }
    const pendingCount = await Application.countDocuments(pendingQuery);
    
    // Approved applications (by this admin level)
    const approvedQuery = { ...baseQuery };
    if (admin.role === 'block_admin') {
      approvedQuery['approvals.block.status'] = 'approved';
    } else if (admin.role === 'district_admin') {
      approvedQuery['approvals.district.status'] = 'approved';
    } else if (admin.role === 'state_admin') {
      approvedQuery['approvals.state.status'] = 'approved';
    }
    const approvedCount = await Application.countDocuments(approvedQuery);

    // Rejected applications (by this admin level)
    const rejectedQuery = { ...baseQuery };
    if (admin.role === 'block_admin') {
      rejectedQuery['approvals.block.status'] = 'rejected';
    } else if (admin.role === 'district_admin') {
      rejectedQuery['approvals.district.status'] = 'rejected';
    } else if (admin.role === 'state_admin') {
      rejectedQuery['approvals.state.status'] = 'rejected';
    }
    const rejectedCount = await Application.countDocuments(rejectedQuery);
    
    console.log(`✅ Stats - Total: ${totalCount}, Pending: ${pendingCount}, Approved: ${approvedCount}, Rejected: ${rejectedCount}`);

    res.status(200).json({
      success: true,
      data: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalApplications: totalCount, // Alias for compatibility
        pendingApplications: pendingCount,
        approvedApplications: approvedCount,
        rejectedApplications: rejectedCount,
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
