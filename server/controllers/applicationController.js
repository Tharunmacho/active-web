import Application from '../models/Application.js';
import PersonalForm from '../models/PersonalForm.js';
import BusinessForm from '../models/BusinessForm.js';
import FinancialForm from '../models/FinancialForm.js';
import DeclarationForm from '../models/DeclarationForm.js';
import WebUserProfile from '../models/WebUserProfile.js';

// @desc    Get all applications for admin (based on role and location)
// @route   GET /api/applications
// @access  Private (Admin only)
const getApplications = async (req, res) => {
  try {
    const admin = req.user;
    let query = {};

    console.log('📋 Getting applications for admin:', {
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
      'admin.meta': admin.meta,
      'admin object keys': Object.keys(admin.toObject ? admin.toObject() : admin)
    });

    // Extract location from admin.meta
    const adminState = admin.meta?.state;
    const adminDistrict = admin.meta?.district;
    const adminBlock = admin.meta?.block;

    console.log('📍 Extracted admin location:', {
      adminState,
      adminDistrict,
      adminBlock,
      types: {
        state: typeof adminState,
        district: typeof adminDistrict,
        block: typeof adminBlock
      }
    });

    // Filter based on admin role and location - show ALL applications from their jurisdiction
    // Use case-insensitive regex to handle spelling variations
    if (admin.role === 'block_admin') {
      // Block admin sees ALL applications from their block
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        block: new RegExp(`^${adminBlock}$`, 'i')
      };
      console.log('🔍 Block Admin Query (case-insensitive):', {
        state: adminState,
        district: adminDistrict,
        block: adminBlock
      });
    } else if (admin.role === 'district_admin') {
      // District admin sees ONLY applications pending district approval (approved by block admin)
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        status: 'pending_district_approval'
      };
      console.log('🔍 District Admin Query (WITH STATUS FILTER):', {
        state: adminState,
        district: adminDistrict,
        status: 'pending_district_approval'
      });
      console.log('🔍 District Admin Query (with status filter):', {
        state: adminState,
        district: adminDistrict,
        status: 'pending_district_approval'
      });
    } else if (admin.role === 'state_admin') {
      // State admin sees ONLY applications pending state approval (approved by district admin)
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        status: 'pending_state_approval'
      };
    } else if (admin.role === 'super_admin') {
      // Super admin can see all
      query = {};
    }

    console.log('🔍 Query for applications (regex):', query);

    const applications = await Application.find(query)
      .populate('userId', 'email phone')
      .populate('personalFormId')
      .populate('businessFormId')
      .sort({ submittedAt: -1 });

    console.log(`✅ Found ${applications.length} applications matching query`);
    
    // Debug: Show all applications in the database for comparison
    const allApps = await Application.find({}).limit(10);
    console.log(`📊 Total applications in database: ${allApps.length}`);
    if (allApps.length > 0) {
      console.log('📋 Sample application locations:');
      allApps.slice(0, 3).forEach(app => {
        console.log(`  - ${app.applicationId}: state="${app.state}", district="${app.district}", block="${app.block}", status="${app.status}"`);
      });
    }
    
    // Debug: Log approval status for block admin
    if (admin.role === 'block_admin' && applications.length > 0) {
      console.log('📋 Block Admin - Application Approval Status:');
      applications.slice(0, 3).forEach(app => {
        console.log(`  - ${app.applicationId}:`, {
          status: app.status,
          blockApprovalStatus: app.approvals?.block?.status,
          districtApprovalStatus: app.approvals?.district?.status,
          stateApprovalStatus: app.approvals?.state?.status
        });
      });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get ALL applications for admin's jurisdiction (no status filter)
// @route   GET /api/applications/all
// @access  Private (Admin only)
const getAllApplications = async (req, res) => {
  try {
    const admin = req.user;
    let query = {};

    console.log('📋 Getting ALL applications for admin:', {
      email: admin.email,
      role: admin.role
    });

    // Extract location from admin.meta
    const adminState = admin.meta?.state;
    const adminDistrict = admin.meta?.district;
    const adminBlock = admin.meta?.block;

    // Filter based on admin role and location - EXCLUDE REJECTED FROM LOWER LEVELS
    if (admin.role === 'block_admin') {
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        block: new RegExp(`^${adminBlock}$`, 'i')
        // Block admin sees all applications from their block (including rejected)
      };
    } else if (admin.role === 'district_admin') {
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        // District admin sees only block-approved or district-processed applications
        $or: [
          { status: 'pending_district_approval' },
          { status: 'pending_state_approval' },
          { status: 'approved' },
          { 'approvals.district.status': 'rejected' } // Only see if THEY rejected it
        ]
      };
    } else if (admin.role === 'state_admin') {
      query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        // State admin sees only district-approved or state-processed applications
        $or: [
          { status: 'pending_state_approval' },
          { status: 'approved' },
          { 'approvals.state.status': 'rejected' } // Only see if THEY rejected it
        ]
      };
    } else if (admin.role === 'super_admin') {
      query = {};
    }

    console.log('🔍 Query for ALL applications:', query);

    const applications = await Application.find(query)
      .populate('userId', 'email phone')
      .populate('personalFormId')
      .populate('businessFormId')
      .sort({ submittedAt: -1 });

    console.log(`✅ Found ${applications.length} total applications`);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private (Admin only)
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'email fullName phoneNumber')
      .populate('personalFormId')
      .populate('businessFormId')
      .populate('financialFormId')
      .populate('declarationFormId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve application at current admin level
// @route   POST /api/applications/:id/approve
// @access  Private (Admin only)
const approveApplication = async (req, res) => {
  try {
    const { remarks } = req.body;
    const admin = req.user;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify admin has authority over this application
    const hasAuthority = checkAdminAuthority(admin, application);
    if (!hasAuthority) {
      return res.status(403).json({
        success: false,
        message: 'You do not have authority to approve this application'
      });
    }

    // Update approval based on admin role
    if (admin.role === 'block_admin' && application.status === 'pending_block_approval') {
      application.approvals.block = {
        adminId: admin._id,
        adminName: admin.fullName,
        status: 'approved',
        remarks: remarks || '',
        actionDate: new Date()
      };
      application.status = 'pending_district_approval';
      application.approvals.district.status = 'pending';

    } else if (admin.role === 'district_admin' && application.status === 'pending_district_approval') {
      application.approvals.district = {
        adminId: admin._id,
        adminName: admin.fullName,
        status: 'approved',
        remarks: remarks || '',
        actionDate: new Date()
      };
      application.status = 'pending_state_approval';
      application.approvals.state.status = 'pending';

    } else if (admin.role === 'state_admin' && application.status === 'pending_state_approval') {
      application.approvals.state = {
        adminId: admin._id,
        adminName: admin.fullName,
        status: 'approved',
        remarks: remarks || '',
        actionDate: new Date()
      };
      application.status = 'approved';

    } else {
      return res.status(400).json({
        success: false,
        message: 'Application is not at the correct approval stage for your role'
      });
    }

    application.lastUpdated = new Date();
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: application
    });

  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reject application at current admin level
// @route   POST /api/applications/:id/reject
// @access  Private (Admin only)
const rejectApplication = async (req, res) => {
  try {
    const { remarks } = req.body;
    const admin = req.user;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify admin has authority
    const hasAuthority = checkAdminAuthority(admin, application);
    if (!hasAuthority) {
      return res.status(403).json({
        success: false,
        message: 'You do not have authority to reject this application'
      });
    }

    // Update rejection based on admin role
    if (admin.role === 'block_admin' && application.status === 'pending_block_approval') {
      application.approvals.block = {
        adminId: admin._id,
        adminName: admin.fullName,
        status: 'rejected',
        remarks: remarks || 'Application rejected by block admin',
        actionDate: new Date()
      };
    } else if (admin.role === 'district_admin' && application.status === 'pending_district_approval') {
      application.approvals.district = {
        adminId: admin._id,
        adminName: admin.fullName,
        status: 'rejected',
        remarks: remarks || 'Application rejected by district admin',
        actionDate: new Date()
      };
    } else if (admin.role === 'state_admin' && application.status === 'pending_state_approval') {
      application.approvals.state = {
        adminId: admin._id,
        adminName: admin.fullName,
        status: 'rejected',
        remarks: remarks || 'Application rejected by state admin',
        actionDate: new Date()
      };
    }

    application.status = 'rejected';
    application.lastUpdated = new Date();
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application
    });

  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to check if admin has authority over application
function checkAdminAuthority(admin, application) {
  if (admin.role === 'super_admin') return true;
  
  const adminState = admin.meta?.state;
  const adminDistrict = admin.meta?.district;
  const adminBlock = admin.meta?.block;
  
  // Use case-insensitive comparison for location matching
  const stateMatch = adminState?.toLowerCase() === application.state?.toLowerCase();
  const districtMatch = adminDistrict?.toLowerCase() === application.district?.toLowerCase();
  const blockMatch = adminBlock?.toLowerCase() === application.block?.toLowerCase();
  
  if (admin.role === 'state_admin') {
    return stateMatch;
  }
  
  if (admin.role === 'district_admin') {
    return stateMatch && districtMatch;
  }
  
  if (admin.role === 'block_admin') {
    return stateMatch && districtMatch && blockMatch;
  }
  
  return false;
}

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private (Admin only)
const getApplicationStats = async (req, res) => {
  try {
    const admin = req.user;
    let baseQuery = {};

    // Extract location from admin.meta
    const adminState = admin.meta?.state;
    const adminDistrict = admin.meta?.district;
    const adminBlock = admin.meta?.block;

    // Filter by admin location using case-insensitive regex
    // District and State admins should only see stats for their approval level
    if (admin.role === 'block_admin') {
      baseQuery = { 
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        block: new RegExp(`^${adminBlock}$`, 'i')
      };
    } else if (admin.role === 'district_admin') {
      // District admin stats: only applications at district level
      baseQuery = { 
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        status: 'pending_district_approval'
      };
    } else if (admin.role === 'state_admin') {
      // State admin stats: only applications at state level
      baseQuery = { 
        state: new RegExp(`^${adminState}$`, 'i'),
        status: 'pending_state_approval'
      };
    }

    // For district/state admins, calculate stats based on their approval status
    let stats;
    if (admin.role === 'district_admin') {
      // District admin stats: ALL applications approved by block
      const allDistrictApps = await Application.find({
        state: new RegExp(`^${adminState}$`, 'i'),
        district: new RegExp(`^${adminDistrict}$`, 'i'),
        $or: [
          { status: 'pending_district_approval' },
          { status: 'pending_state_approval' },
          { status: 'approved' },
          { 'approvals.district.status': 'rejected' }
        ]
      });
      
      console.log('📊 District Admin Stats Query:', {
        state: adminState,
        district: adminDistrict,
        foundApps: allDistrictApps.length,
        appIds: allDistrictApps.map(app => app.applicationId)
      });
      
      stats = {
        total: allDistrictApps.length,
        pending: allDistrictApps.filter(app => app.approvals?.district?.status !== 'approved' && app.approvals?.district?.status !== 'rejected').length,
        approved: allDistrictApps.filter(app => app.approvals?.district?.status === 'approved').length,
        rejected: allDistrictApps.filter(app => app.approvals?.district?.status === 'rejected').length,
        aspirants: allDistrictApps.filter(app => app.memberType === 'aspirant').length,
        business: allDistrictApps.filter(app => app.memberType === 'business').length
      };
      
      console.log('📊 District Admin Stats Result:', stats);
    } else if (admin.role === 'state_admin') {
      // State admin stats: ALL applications approved by district (pending_state_approval, approved, or state rejected)
      const query = {
        state: new RegExp(`^${adminState}$`, 'i'),
        $or: [
          { status: 'pending_state_approval' },
          { status: 'approved' },
          { 'approvals.state.status': 'rejected' }
        ]
      };
      
      console.log('📊 State Admin Stats Query:', JSON.stringify(query, null, 2));
      const allStateApps = await Application.find(query);
      console.log('📊 State Admin Found Apps:', allStateApps.length);
      console.log('📊 State Admin App Details:', allStateApps.map(app => ({
        id: app.applicationId,
        status: app.status,
        stateApprovalStatus: app.approvals?.state?.status,
        districtApprovalStatus: app.approvals?.district?.status
      })));
      
      console.log('📊 State Admin Stats Query:', {
        state: adminState,
        foundApps: allStateApps.length,
        statuses: allStateApps.map(app => ({ id: app.applicationId, status: app.status, stateApproval: app.approvals?.state?.status }))
      });
      
      stats = {
        total: allStateApps.length,
        pending: allStateApps.filter(app => app.approvals?.state?.status !== 'approved' && app.approvals?.state?.status !== 'rejected').length,
        approved: allStateApps.filter(app => app.approvals?.state?.status === 'approved').length,
        rejected: allStateApps.filter(app => app.approvals?.state?.status === 'rejected').length,
        aspirants: allStateApps.filter(app => app.memberType === 'aspirant').length,
        business: allStateApps.filter(app => app.memberType === 'business').length
      };
      
      console.log('📊 State Admin Stats Result:', stats);
    } else {
      // Block admin and super admin: count all applications
      stats = {
        total: await Application.countDocuments(baseQuery),
        pending: await Application.countDocuments({ ...baseQuery, status: { $regex: /^pending/ } }),
        approved: await Application.countDocuments({ ...baseQuery, status: 'approved' }),
        rejected: await Application.countDocuments({ ...baseQuery, status: 'rejected' }),
        aspirants: await Application.countDocuments({ ...baseQuery, memberType: 'aspirant' }),
        business: await Application.countDocuments({ ...baseQuery, memberType: 'business' })
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit a new application (from member)
// @route   POST /api/applications/submit
// @access  Private (Member only)
const submitApplication = async (req, res) => {
  try {
    const { applicationId, userName, memberType, state, district, block } = req.body;
    
    console.log('📝 Creating new application:', {
      applicationId,
      userName,
      memberType,
      state,
      district,
      block,
      userId: req.user.id
    });

    // Check if application already exists
    const existingApp = await Application.findOne({ applicationId });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'Application already exists'
      });
    }

    // Get user profile details
    const userProfile = await WebUserProfile.findOne({ userId: req.user.id });
    const userEmail = userProfile?.email || req.user.email || '';
    const userPhone = userProfile?.phoneNumber || '';

    // Create new application
    const newApplication = new Application({
      applicationId,
      userId: req.user._id,
      memberName: userName,
      memberEmail: userEmail,
      memberPhone: userPhone,
      memberType: memberType || 'business',
      state,
      district,
      block,
      status: 'pending_block_approval',
      submittedAt: new Date(),
      approvals: {
        block: { status: 'pending' },
        district: { status: 'pending' },
        state: { status: 'pending' }
      },
      approvalHistory: [
        {
          level: 'submitted',
          action: 'submitted',
          timestamp: new Date(),
          remarks: 'Application submitted successfully'
        }
      ]
    });

    await newApplication.save();
    
    console.log('✅ Application created successfully:', {
      applicationId,
      state,
      district,
      block,
      status: 'pending_block_approval'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApplication
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's own application
// @route   GET /api/applications/my-application
// @access  Private (Member only)
const getMyApplication = async (req, res) => {
  try {
    console.log('📋 Getting application for user:', {
      userId: req.user._id,
      userEmail: req.user.email
    });
    
    // Find the application for this user
    const application = await Application.findOne({ userId: req.user._id })
      .sort({ submittedAt: -1 }); // Get the most recent application

    if (!application) {
      console.log('⚠️ No application found for user:', req.user._id);
      
      // Also check with any field that might contain userId
      const allAppsForDebugging = await Application.find({}).limit(5);
      console.log('📊 Sample applications in DB:', allAppsForDebugging.map(app => ({
        applicationId: app.applicationId,
        userId: app.userId,
        status: app.status
      })));
      
      return res.status(404).json({
        success: false,
        message: 'No application found'
      });
    }

    console.log('✅ Found application:', {
      applicationId: application.applicationId,
      status: application.status,
      memberType: application.memberType,
      district: application.district,
      block: application.block,
      state: application.state,
      blockApproval: application.approvals?.block?.status,
      districtApproval: application.approvals?.district?.status,
      stateApproval: application.approvals?.state?.status
    });

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('❌ Get my application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export {
  getApplications,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getApplicationStats,
  submitApplication,
  getMyApplication
};
