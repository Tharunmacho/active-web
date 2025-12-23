import BusinessForm from '../../../shared/models/BusinessForm.js';

// @desc    Get user's business form data
// @route   GET /api/business-form
// @access  Private
export const getBusinessForm = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let form = await BusinessForm.findOne({ userId });
    
    if (!form) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error fetching business form:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching business form data',
      error: error.message
    });
  }
};

// @desc    Save or update business form
// @route   POST /api/business-form
// @access  Private
export const saveBusinessForm = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;
    
    console.log('📝 Saving business form for userId:', userId);
    console.log('📦 Form data received:', JSON.stringify(formData, null, 2));
    
    let form = await BusinessForm.findOne({ userId });
    console.log('🔍 Existing form found:', form ? 'Yes' : 'No');
    
    if (!form) {
      form = await BusinessForm.create({
        userId,
        ...formData
      });
      console.log('✅ New business form created:', form._id);
    } else {
      Object.keys(formData).forEach(key => {
        form[key] = formData[key];
      });
      await form.save();
      console.log('✅ Existing business form updated:', form._id);
    }
    
    console.log('💾 Final saved data:', JSON.stringify(form, null, 2));
    
    res.status(200).json({
      success: true,
      data: form,
      message: 'Business form saved successfully'
    });
  } catch (error) {
    console.error('Error saving business form:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving business form',
      error: error.message
    });
  }
};

