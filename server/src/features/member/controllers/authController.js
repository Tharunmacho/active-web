import WebUser from '../../../shared/models/WebUser.js';
import WebUserProfile from '../../../shared/models/WebUserProfile.js';
import PersonalForm from '../../../shared/models/PersonalForm.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    console.log('📥 Registration request body:', req.body);
    const { fullName, email, phoneNumber, password, confirmPassword, state, district, block, city } = req.body;

    // Validation
    if (!fullName || !email || !phoneNumber || !password) {
      console.log('❌ Missing fields:', { fullName, email, phoneNumber, password: password ? '***' : undefined });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const userExists = await WebUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user in "web auth" collection - ONLY email and password for authentication
    const user = await WebUser.create({
      email,
      password
    });

    // Create user profile in "web users" collection - ALL other user details
    await WebUserProfile.create({
      userId: user._id,
      email,
      fullName,
      phoneNumber,
      state,
      district,
      block,
      city,
      role: 'member'
    });

    // Also create personal form entry with registration data
    await PersonalForm.create({
      userId: user._id,
      name: fullName,
      phoneNumber: phoneNumber,
      email: email,
      state: state || '',
      district: district || '',
      block: block || '',
      city: city || '',
      religion: '',
      socialCategory: '',
      isLocked: false
    });

    // Get user profile details from "web users" collection
    const userProfile = await WebUserProfile.findOne({ userId: user._id });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          fullName: userProfile.fullName,
          email: userProfile.email,
          phoneNumber: userProfile.phoneNumber,
          role: userProfile.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Member login attempt:', { email, passwordLength: password?.length });

    // Validation
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password for comparison)
    const user = await WebUser.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found in database:', email);
      // Check if user exists with different case
      const userCaseInsensitive = await WebUser.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      }).select('+password');
      
      if (userCaseInsensitive) {
        console.log('✅ Found user with different case:', userCaseInsensitive.email);
        // Continue with this user
        return handleUserLogin(userCaseInsensitive, password, res);
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ User found:', { id: user._id, email: user.email, isActive: user.isActive });

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    console.log('🔑 Checking password...');
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Password matched');
    return handleUserLogin(user, password, res);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

// Helper function to handle user login
const handleUserLogin = async (user, password, res) => {
  try {
    // Check password if needed
    if (password) {
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    // Get user profile details from "web users" collection
    const userProfile = await WebUserProfile.findOne({ userId: user._id });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: userProfile.fullName,
          email: userProfile.email,
          phoneNumber: userProfile.phoneNumber,
          role: userProfile.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user exists (DEBUG - Remove in production)
// @route   GET /api/auth/check-user/:email
// @access  Public (for debugging only)
export const checkUserExists = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('🔍 Checking user:', email);
    
    const user = await WebUser.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!user) {
      return res.json({
        exists: false,
        message: 'User not found'
      });
    }
    
    const userProfile = await WebUserProfile.findOne({ userId: user._id });
    
    return res.json({
      exists: true,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive,
        hasProfile: !!userProfile,
        profileEmail: userProfile?.email,
        profileName: userProfile?.fullName
      }
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    console.log('👤 getMe called for user:', req.user.id);
    
    // Get user from WebUser collection (has fullName, email)
    const user = await WebUser.findById(req.user.id);
    
    if (!user) {
      console.log('❌ User not found in WebUser collection');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('📋 WebUser data:', { fullName: user.fullName, email: user.email });

    // Get user profile from WebUserProfile collection (has profilePhoto and fallback fullName)
    const userProfile = await WebUserProfile.findOne({ userId: req.user.id });
    
    console.log('📋 WebUserProfile data:', userProfile ? { 
      hasPhoto: !!userProfile.profilePhoto, 
      photoLength: userProfile.profilePhoto?.length || 0,
      fullName: userProfile.fullName 
    } : 'Not found');
    
    // Use WebUserProfile.fullName as fallback if WebUser.fullName is not set
    console.log('🔍 Fallback check:', {
      'user.fullName': user.fullName,
      'userProfile?.fullName': userProfile?.fullName,
      'user.fullName type': typeof user.fullName,
      'userProfile type': typeof userProfile,
      'hasUserProfile': !!userProfile
    });
    
    const fullName = user.fullName || userProfile?.fullName || '';
    console.log('✅ Final fullName after fallback:', fullName);
    
    // Combine data from both models
    const userData = {
      id: user._id,
      fullName: fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profilePhoto: userProfile?.profilePhoto || '',
      createdAt: user.createdAt
    };

    console.log('✅ Returning user data:', { 
      fullName: userData.fullName, 
      email: userData.email, 
      hasPhoto: !!userData.profilePhoto,
      photoLength: userData.profilePhoto.length 
    });

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('❌ Error in getMe:', error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const user = await WebUser.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await WebUser.findById(req.user.id).select('+password');

    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (fullName and email)
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    console.log('🔄 updateUserProfile called');
    console.log('📝 Update data:', req.body);
    
    const { fullName, email } = req.body;

    // Update WebUser model
    const user = await WebUser.findById(req.user.id);
    if (!user) {
      console.log('❌ User not found in WebUser collection');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (fullName) {
      console.log('📝 Updating fullName:', fullName);
      user.fullName = fullName;
    }
    if (email) {
      console.log('📧 Updating email:', email);
      user.email = email;
    }
    
    await user.save();
    console.log('✅ WebUser updated');

    // Also update in WebUserProfile if exists
    const userProfile = await WebUserProfile.findOne({ userId: req.user.id });
    if (userProfile && fullName) {
      userProfile.fullName = fullName;
      await userProfile.save();
      console.log('✅ WebUserProfile fullName updated');
    }

    // Also update in PersonalForm if exists
    const personalForm = await PersonalForm.findOne({ userId: req.user.id });
    if (personalForm) {
      if (fullName) {
        personalForm.name = fullName;
        console.log('✅ PersonalForm name updated');
      }
      if (email) {
        personalForm.email = email;
        console.log('✅ PersonalForm email updated');
      }
      await personalForm.save();
    }

    console.log('✅ All profile updates completed successfully');
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('❌ Error in updateUserProfile:', error);
    next(error);
  }
};

// @desc    Update user profile photo
// @route   PUT /api/auth/update-profile-photo
// @access  Private
export const updateProfilePhoto = async (req, res, next) => {
  try {
    console.log('🖼️ updateProfilePhoto called');
    console.log('📸 Request body:', req.body ? 'Body exists' : 'No body');
    console.log('👤 User:', req.user ? req.user.email : 'No user');
    
    const { profilePhoto } = req.body;

    if (!profilePhoto) {
      console.log('❌ No profile photo in request');
      return res.status(400).json({
        success: false,
        message: 'Please provide profile photo'
      });
    }

    console.log('🔍 Looking for user profile:', req.user.id);
    const userProfile = await WebUserProfile.findOne({ userId: req.user.id });

    if (!userProfile) {
      console.log('❌ User profile not found');
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    console.log('✅ Found user profile, updating photo');
    userProfile.profilePhoto = profilePhoto;
    await userProfile.save();

    console.log('✅ Profile photo updated successfully');
    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      data: userProfile
    });
  } catch (error) {
    console.error('❌ Error in updateProfilePhoto:', error);
    next(error);
  }
};
