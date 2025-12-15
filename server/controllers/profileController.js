import AdditionalForm from '../models/AdditionalForm.js';

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
