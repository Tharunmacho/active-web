import PersonalForm from '../src/shared/models/PersonalForm.js';
import WebUserProfile from '../src/shared/models/WebUserProfile.js';
import Application from '../src/shared/models/Application.js';

export const getPersonalForm = async (req, res) => {
  try {
    const personalForm = await PersonalForm.findOne({ userId: req.user.id });
    
    if (!personalForm) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: personalForm });
  } catch (error) {
    console.error('Error fetching personal form:', error);
    res.status(500).json({ success: false, message: 'Error fetching personal form' });
  }
};

export const savePersonalForm = async (req, res) => {
  try {
    const formData = req.body;
    
    let personalForm = await PersonalForm.findOne({ userId: req.user.id });
    
    if (personalForm) {
      // Update existing form - always allow updates
      Object.assign(personalForm, formData);
      personalForm.isLocked = true;
      await personalForm.save();
      console.log('✅ Personal form updated for user:', req.user.id);
    } else {
      // Create new form and lock it
      personalForm = await PersonalForm.create({
        userId: req.user.id,
        ...formData,
        isLocked: true
      });
      console.log('✅ Personal form created and locked for user:', req.user.id);
    }

    // Also update WebUserProfile with location changes
    const profileUpdate = {
      fullName: formData.name,
      phoneNumber: formData.phoneNumber,
      state: formData.state,
      district: formData.district,
      block: formData.block,
      city: formData.city
    };

    await WebUserProfile.findOneAndUpdate(
      { userId: req.user.id },
      profileUpdate,
      { new: true }
    );
    console.log('✅ WebUserProfile location updated:', {
      state: formData.state,
      district: formData.district,
      block: formData.block
    });

    // Also update any existing Application with the new location and personal info
    const applicationUpdate = await Application.findOneAndUpdate(
      { userId: req.user.id },
      {
        memberName: formData.name,
        memberEmail: formData.email,
        memberPhone: formData.phoneNumber,
        state: formData.state,
        district: formData.district,
        block: formData.block,
        city: formData.city,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (applicationUpdate) {
      console.log('✅ Application updated with new personal info for:', applicationUpdate.applicationId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
        state: formData.state,
        district: formData.district,
        block: formData.block,
        city: formData.city
      });
    } else {
      console.log('ℹ️ No application found to update for user:', req.user.id);
    }

    res.json({ success: true, data: personalForm });
  } catch (error) {
    console.error('Error saving personal form:', error);
    res.status(500).json({ success: false, message: 'Error saving personal form' });
  }
};
