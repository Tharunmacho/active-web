import { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin } from '../../../shared/models/ExistingAdmins.js';
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

    // Build base query for admin's jurisdiction with case-insensitive regex
    const baseQuery = {};
    if (admin.role === 'block_admin') {
      baseQuery.state = new RegExp(`^${adminState}$`, 'i');
      baseQuery.district = new RegExp(`^${adminDistrict}$`, 'i');
      baseQuery.block = new RegExp(`^${adminBlock}$`, 'i');
    } else if (admin.role === 'district_admin') {
      // District admin sees ALL block-approved applications
      baseQuery.state = new RegExp(`^${adminState}$`, 'i');
      baseQuery.district = new RegExp(`^${adminDistrict}$`, 'i');
      baseQuery.$or = [
        { status: 'pending_district_approval' },
        { status: 'pending_state_approval' },
        { status: 'approved' },
        { 'approvals.district.status': 'rejected' }
      ];
    } else if (admin.role === 'state_admin') {
      // State admin sees ALL district-approved applications
      baseQuery.state = new RegExp(`^${adminState}$`, 'i');
      baseQuery.$or = [
        { status: 'pending_state_approval' },
        { status: 'approved' },
        { 'approvals.state.status': 'rejected' }
      ];
    }

    console.log('🔍 Dashboard stats base query (case-insensitive):', {
      state: adminState,
      district: adminDistrict,
      block: adminBlock,
      role: admin.role,
      baseQuery: JSON.stringify(baseQuery, null, 2)
    });

    // Debug: Check all applications for this state
    if (admin.role === 'state_admin') {
      const allStateApps = await Application.find({ state: new RegExp(`^${adminState}$`, 'i') });
      console.log('🔍 DEBUG: All applications in state:', allStateApps.length);
      console.log('🔍 DEBUG: Application statuses:', allStateApps.map(app => ({
        id: app.applicationId,
        status: app.status,
        state: app.state,
        districtApproval: app.approvals?.district?.status,
        stateApproval: app.approvals?.state?.status
      })));
    }

    // Fetch all applications matching base query
    const allApps = await Application.find(baseQuery);
    console.log('📊 Total applications found with baseQuery:', allApps.length);

    // Count by admin's approval status
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    if (admin.role === 'block_admin') {
      pendingCount = allApps.filter(app => app.approvals?.block?.status !== 'approved' && app.approvals?.block?.status !== 'rejected').length;
      approvedCount = allApps.filter(app => app.approvals?.block?.status === 'approved').length;
      rejectedCount = allApps.filter(app => app.approvals?.block?.status === 'rejected').length;
    } else if (admin.role === 'district_admin') {
      pendingCount = allApps.filter(app => app.approvals?.district?.status !== 'approved' && app.approvals?.district?.status !== 'rejected').length;
      approvedCount = allApps.filter(app => app.approvals?.district?.status === 'approved').length;
      rejectedCount = allApps.filter(app => app.approvals?.district?.status === 'rejected').length;
    } else if (admin.role === 'state_admin') {
      pendingCount = allApps.filter(app => app.approvals?.state?.status !== 'approved' && app.approvals?.state?.status !== 'rejected').length;
      approvedCount = allApps.filter(app => app.approvals?.state?.status === 'approved').length;
      rejectedCount = allApps.filter(app => app.approvals?.state?.status === 'rejected').length;
    }
    
    console.log(`✅ Stats - Total: ${allApps.length}, Pending: ${pendingCount}, Approved: ${approvedCount}, Rejected: ${rejectedCount}`);

    res.status(200).json({
      success: true,
      data: {
        total: allApps.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalApplications: allApps.length, // Alias for compatibility
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

// @desc    Get members (Web User Profiles)
// @route   GET /api/admin/members
// @access  Private (Admin only)
const getMembers = async (req, res) => {
  try {
    const admin = req.user;
    console.log('👥 Getting members for admin:', { email: admin.email, role: admin.role });
    
    // Import WebUserProfile and Application
    const { default: WebUserProfile } = await import('../models/WebUserProfile.js');
    const { default: Application } = await import('../models/Application.js');
    
    // Build query based on admin jurisdiction with case-insensitive regex
    let query = {};
    const adminState = admin.meta?.state;
    const adminDistrict = admin.meta?.district;
    const adminBlock = admin.meta?.block;
    
    if (admin.role === 'block_admin') {
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        block: new RegExp(`^${adminBlock}$`, 'i')
      };
    } else if (admin.role === 'district_admin') {
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i')
      };
    } else if (admin.role === 'state_admin') {
      query = {
        state: new RegExp(`^${adminState}$`, 'i')
      };
    }
    // super_admin can see all
    
    console.log('🔍 Query for members (case-insensitive):', {
      state: adminState,
      district: adminDistrict,
      block: adminBlock
    });
    
    let members = await WebUserProfile.find(query)
      .populate('userId', 'email isActive')
      .sort({ createdAt: -1 });
    
    // For state admin, filter to only show members approved by district
    if (admin.role === 'state_admin') {
      console.log(`📋 Filtering ${members.length} members for state admin - showing only district-approved members`);
      
      // Get user IDs of members (filter out null/undefined)
      const userIds = members
        .map(m => m.userId?._id || m.userId)
        .filter(id => id != null);
      
      if (userIds.length === 0) {
        console.log('⚠️ No valid user IDs found in members');
        members = [];
      } else {
        // Find applications that are district-approved (status: pending_state_approval, approved, or state rejected)
        const districtApprovedApps = await Application.find({
          userId: { $in: userIds },
          $or: [
            { status: 'pending_state_approval' },
            { status: 'approved' },
            { 'approvals.state.status': 'rejected' }
          ]
        }).select('userId');
        
        // Get the user IDs of district-approved applications
        const districtApprovedUserIds = districtApprovedApps.map(app => app.userId.toString());
        
        // Filter members to only include those with district-approved applications
        members = members.filter(member => {
          const userId = member.userId?._id || member.userId;
          if (!userId) return false;
          const memberId = userId.toString();
          return districtApprovedUserIds.includes(memberId);
        });
        
        console.log(`✅ Filtered to ${members.length} district-approved members for state admin`);
      }
    }
    
    // For district admin, filter to only show members approved by block
    if (admin.role === 'district_admin') {
      console.log(`📋 Filtering ${members.length} members for district admin - showing only block-approved members`);
      
      // Get user IDs of members (filter out null/undefined)
      const userIds = members
        .map(m => m.userId?._id || m.userId)
        .filter(id => id != null);
      
      if (userIds.length === 0) {
        console.log('⚠️ No valid user IDs found in members');
        members = [];
      } else {
        // Find applications that are block-approved (status: pending_district_approval, pending_state_approval, approved, or district rejected)
        const blockApprovedApps = await Application.find({
          userId: { $in: userIds },
          $or: [
            { status: 'pending_district_approval' },
            { status: 'pending_state_approval' },
            { status: 'approved' },
            { 'approvals.district.status': 'rejected' }
          ]
        }).select('userId');
        
        // Get the user IDs of block-approved applications
        const blockApprovedUserIds = blockApprovedApps.map(app => app.userId.toString());
        
        // Filter members to only include those with block-approved applications
        members = members.filter(member => {
          const userId = member.userId?._id || member.userId;
          if (!userId) return false;
          const memberId = userId.toString();
          return blockApprovedUserIds.includes(memberId);
        });
        
        console.log(`✅ Filtered to ${members.length} block-approved members for district admin`);
      }
    }
    
    console.log(`✅ Found ${members.length} members`);
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
    
  } catch (error) {
    console.error('Get members error:', error);
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
  getDashboardStats,
  getMembers
};

