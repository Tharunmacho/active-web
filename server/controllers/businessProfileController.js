import BusinessProfile from '../src/shared/models/BusinessProfile.js';

// @desc    Get user's business profile
// @route   GET /api/business-profile
// @access  Private
export const getBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('🔍 Fetching business profile for userId:', userId);
    
    let profile = await BusinessProfile.findOne({ userId });
    
    if (!profile) {
      console.log('ℹ️ No business profile found for user');
      return res.status(200).json({
        success: true,
        data: null
      });
    }
    
    console.log('✅ Business profile found:', profile._id);
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('❌ Error fetching business profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching business profile',
      error: error.message
    });
  }
};

// @desc    Create or update business profile
// @route   POST /api/business-profile
// @access  Private
export const saveBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    console.log('📝 Saving business profile for userId:', userId);
    console.log('📦 Profile data received:', JSON.stringify(profileData, null, 2));
    
    // Validate required fields
    if (!profileData.businessName || !profileData.businessType || !profileData.mobileNumber) {
      console.log('⚠️ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Business name, type, and mobile number are required'
      });
    }
    
    let profile = await BusinessProfile.findOne({ userId });
    console.log('🔍 Existing profile found:', profile ? 'Yes' : 'No');
    
    if (!profile) {
      // Create new profile
      profile = await BusinessProfile.create({
        userId,
        ...profileData
      });
      console.log('✅ New business profile created:', profile._id);
    } else {
      // Update existing profile
      Object.keys(profileData).forEach(key => {
        profile[key] = profileData[key];
      });
      await profile.save();
      console.log('✅ Existing business profile updated:', profile._id);
    }
    
    console.log('💾 Final saved profile:', JSON.stringify(profile, null, 2));
    
    res.status(200).json({
      success: true,
      data: profile,
      message: 'Business profile saved successfully'
    });
  } catch (error) {
    console.error('❌ Error saving business profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving business profile',
      error: error.message
    });
  }
};

// @desc    Delete business profile
// @route   DELETE /api/business-profile
// @access  Private
export const deleteBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('🗑️ Deleting business profile for userId:', userId);
    
    const profile = await BusinessProfile.findOneAndDelete({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found'
      });
    }
    
    console.log('✅ Business profile deleted:', profile._id);
    
    res.status(200).json({
      success: true,
      message: 'Business profile deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting business profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting business profile',
      error: error.message
    });
  }
};
