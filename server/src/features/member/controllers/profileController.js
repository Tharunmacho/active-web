import AdditionalForm from '../../../shared/models/AdditionalForm.js';

// @desc    Get user's additional form data
// @route   GET /api/profile/additional-form
// @access  Private
export const getAdditionalForm = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let form = await AdditionalForm.findOne({ userId });
    
    if (!form) {
      // Create empty form if doesn't exist
      form = await AdditionalForm.create({ userId });
    }
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error fetching additional form:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form data',
      error: error.message
    });
  }
};

// @desc    Auto-save personal details (Step 1)
// @route   PUT /api/profile/additional-form/auto-save
// @access  Private
export const autoSavePersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Remove password fields from auto-save
    delete updateData.password;
    delete updateData.confirmPassword;
    
    let form = await AdditionalForm.findOne({ userId });
    
    if (!form) {
      form = await AdditionalForm.create({
        userId,
        ...updateData
      });
    } else {
      // Update existing form
      Object.keys(updateData).forEach(key => {
        form[key] = updateData[key];
      });
      await form.save();
    }
    
    res.status(200).json({
      success: true,
      data: form,
      message: 'Auto-saved successfully'
    });
  } catch (error) {
    console.error('Error auto-saving:', error);
    res.status(500).json({
      success: false,
      message: 'Error auto-saving data'
    });
  }
};

// @desc    Save and lock profile
// @route   PUT /api/profile/additional-form/save-and-lock
// @access  Private
export const saveAndLockProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    let form = await AdditionalForm.findOne({ userId });
    
    if (!form) {
      form = await AdditionalForm.create({
        userId,
        ...updateData,
        isLocked: true
      });
    } else {
      // Update all fields
      Object.keys(updateData).forEach(key => {
        form[key] = updateData[key];
      });
      form.isLocked = true;
      await form.save();
    }
    
    res.status(200).json({
      success: true,
      data: form,
      message: 'Profile saved and locked successfully'
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving profile'
    });
  }
};

// @desc    Update additional form (any step)
// @route   PUT /api/profile/additional-form
// @access  Private
export const updateAdditionalForm = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    let form = await AdditionalForm.findOne({ userId });
    
    if (!form) {
      form = await AdditionalForm.create({
        userId,
        ...updateData
      });
    } else {
      // Update existing form
      Object.keys(updateData).forEach(key => {
        if (key === 'completedSteps') {
          // Merge completed steps
          const newSteps = updateData[key];
          form.completedSteps = [...new Set([...form.completedSteps, ...newSteps])];
        } else {
          form[key] = updateData[key];
        }
      });
      await form.save();
    }
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form'
    });
  }
};

// @desc    Get user profile by userId (for admins)
// @route   GET /api/profile/user/:userId
// @access  Private (Admin only)
export const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch additional form data
    const additionalForm = await AdditionalForm.findOne({ userId }).populate('userId', 'email');
    
    if (!additionalForm) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: additionalForm
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Get application details by applicationId (for admins to view member application data)
// @route   GET /api/profile/application/:applicationId
// @access  Private (Admin only)
export const getApplicationById = async (req, res) => {
  try {
    console.log('========================================');
    console.log('🎯 getApplicationById ENDPOINT CALLED');
    console.log('========================================');
    
    const { applicationId } = req.params;
    
    console.log('🔍 Received applicationId:', applicationId);
    console.log('📋 Request params:', req.params);
    console.log('🔐 Admin user:', req.user?.email);
    
    // Import models
    const Application = (await import('../models/Application.js')).default;
    const PersonalForm = (await import('../models/PersonalForm.js')).default;
    const BusinessForm = (await import('../models/BusinessForm.js')).default;
    const FinancialForm = (await import('../models/FinancialForm.js')).default;
    const DeclarationForm = (await import('../models/DeclarationForm.js')).default;
    const mongoose = (await import('mongoose')).default;
    
    // Build query - check if it's a valid ObjectId first
    let query = {};
    if (mongoose.Types.ObjectId.isValid(applicationId) && applicationId.length === 24) {
      // It's a valid ObjectId
      query = { 
        $or: [
          { _id: applicationId },
          { applicationId: applicationId }
        ]
      };
    } else {
      // It's a string applicationId (like APP-xxx-xxx)
      query = { applicationId: applicationId };
    }
    
    console.log('🔍 Query:', query);
    
    // Find the application
    const application = await Application.findOne(query).populate('userId', 'email phone');
    
    console.log('📦 Application found:', application ? 'Yes' : 'No');
    
    if (!application) {
      // Debug: Check if any applications exist
      const allApps = await Application.find({}).limit(5).select('applicationId _id memberName');
      console.log('❌ Application not found. Sample applications in DB:', allApps);
      
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Fetch all form data
    const [personalForm, businessForm, financialForm, declarationForm] = await Promise.all([
      application.personalFormId ? PersonalForm.findById(application.personalFormId) : null,
      application.businessFormId ? BusinessForm.findById(application.businessFormId) : null,
      application.financialFormId ? FinancialForm.findById(application.financialFormId) : null,
      application.declarationFormId ? DeclarationForm.findById(application.declarationFormId) : null
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        application: {
          id: application._id,
          applicationId: application.applicationId,
          memberName: application.memberName,
          memberEmail: application.memberEmail,
          memberPhone: application.memberPhone,
          memberType: application.memberType,
          status: application.status,
          submittedAt: application.submittedAt,
          state: application.state,
          district: application.district,
          block: application.block,
          city: application.city
        },
        personalForm,
        businessForm,
        financialForm,
        declarationForm
      }
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

