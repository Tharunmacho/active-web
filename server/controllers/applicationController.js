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
    if (admin.role === 'block_admin') {
      // Block admin sees ALL applications from their block
      query = {
        state: adminState,
        district: adminDistrict,
        block: adminBlock
      };
      console.log('🔍 Block Admin Query:', JSON.stringify(query, null, 2));
    } else if (admin.role === 'district_admin') {
      // District admin sees ALL applications from their district
      query = {
        state: adminState,
        district: adminDistrict
      };
    } else if (admin.role === 'state_admin') {
      // State admin sees ALL applications from their state
      query = {
        state: adminState
      };
    } else if (admin.role === 'super_admin') {
      // Super admin can see all
      query = {};
    }

    console.log('🔍 Query for applications:', query);

    const applications = await Application.find(query)
      .populate('userId', 'email')
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
  
  if (admin.role === 'state_admin') {
    return adminState === application.state;
  }
  
  if (admin.role === 'district_admin') {
    return adminState === application.state && adminDistrict === application.district;
  }
  
  if (admin.role === 'block_admin') {
    return adminState === application.state && 
           adminDistrict === application.district && 
           adminBlock === application.block;
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

    // Filter by admin location
    if (admin.role === 'block_admin') {
      baseQuery = { state: adminState, district: adminDistrict, block: adminBlock };
    } else if (admin.role === 'district_admin') {
      baseQuery = { state: adminState, district: adminDistrict };
    } else if (admin.role === 'state_admin') {
      baseQuery = { state: adminState };
    }

    const stats = {
      total: await Application.countDocuments(baseQuery),
      pending: await Application.countDocuments({ ...baseQuery, status: { $regex: /^pending/ } }),
      approved: await Application.countDocuments({ ...baseQuery, status: 'approved' }),
      rejected: await Application.countDocuments({ ...baseQuery, status: 'rejected' }),
      aspirants: await Application.countDocuments({ ...baseQuery, memberType: 'aspirant' }),
      business: await Application.countDocuments({ ...baseQuery, memberType: 'business' })
    };

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

export {
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getApplicationStats,
  submitApplication
};
