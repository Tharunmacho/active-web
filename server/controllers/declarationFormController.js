import DeclarationForm from '../models/DeclarationForm.js';
import Application from '../models/Application.js';
import PersonalForm from '../models/PersonalForm.js';
import BusinessForm from '../models/BusinessForm.js';
import FinancialForm from '../models/FinancialForm.js';
import WebUserProfile from '../models/WebUserProfile.js';

export const getDeclarationForm = async (req, res) => {
  try {
    const declarationForm = await DeclarationForm.findOne({ userId: req.user.id });
    
    if (!declarationForm) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: declarationForm });
  } catch (error) {
    console.error('Error fetching declaration form:', error);
    res.status(500).json({ success: false, message: 'Error fetching declaration form' });
  }
};

export const saveDeclarationForm = async (req, res) => {
  try {
    const formData = req.body;
    
    let declarationForm = await DeclarationForm.findOne({ userId: req.user.id });
    
    if (declarationForm) {
      // Update existing form
      Object.assign(declarationForm, formData);
      await declarationForm.save();
    } else {
      // Create new form
      declarationForm = await DeclarationForm.create({
        userId: req.user.id,
        ...formData
      });
    }

    // After successfully saving declaration form, create Application record
    // This triggers the admin approval workflow
    try {
      // Check if application already exists for this user
      const existingApplication = await Application.findOne({ userId: req.user.id });
      
      if (!existingApplication) {
        // Get all form data
        const personalForm = await PersonalForm.findOne({ userId: req.user.id });
        const businessForm = await BusinessForm.findOne({ userId: req.user.id });
        const financialForm = await FinancialForm.findOne({ userId: req.user.id });
        const userProfile = await WebUserProfile.findOne({ userId: req.user.id });

        if (!personalForm || !businessForm) {
          console.error('Missing required forms for application creation');
          return res.json({ 
            success: true, 
            data: declarationForm,
            warning: 'Application not created - missing required forms'
          });
        }

        // Determine member type
        const memberType = businessForm.doingBusiness === 'yes' ? 'business' : 'aspirant';

        // Generate unique application ID
        const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create application record
        const application = await Application.create({
          userId: req.user.id,
          applicationId,
          memberName: personalForm.name || userProfile?.fullName || '',
          memberEmail: personalForm.email || userProfile?.email || '',
          memberPhone: personalForm.phoneNumber || userProfile?.phoneNumber || '',
          state: personalForm.state || '',
          district: personalForm.district || '',
          block: personalForm.block || '',
          city: personalForm.city || '',
          memberType,
          status: 'pending_block_approval',
          personalFormId: personalForm._id,
          businessFormId: businessForm._id,
          financialFormId: financialForm?._id,
          declarationFormId: declarationForm._id,
          approvals: {
            block: { status: 'pending' },
            district: { status: 'pending' },
            state: { status: 'pending' }
          }
        });

        console.log('✅ Application created successfully:', applicationId);
        console.log('📍 Location:', application.state, '>', application.district, '>', application.block);
        console.log('👤 Member Type:', memberType);
        console.log('📋 Status: Pending Block Admin Approval');

        return res.json({ 
          success: true, 
          data: declarationForm,
          application: {
            id: application._id,
            applicationId: application.applicationId,
            status: application.status
          },
          message: 'Declaration saved and application submitted for approval'
        });
      }
    } catch (appError) {
      console.error('Error creating application:', appError);
      // Still return success for declaration form save
      return res.json({ 
        success: true, 
        data: declarationForm,
        warning: 'Declaration saved but application creation failed'
      });
    }

    res.json({ success: true, data: declarationForm });
  } catch (error) {
    console.error('Error saving declaration form:', error);
    res.status(500).json({ success: false, message: 'Error saving declaration form' });
  }
};
