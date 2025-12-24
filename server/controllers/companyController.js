import Company from '../src/shared/models/Company.js';

// @desc    Get all companies for user
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('🔍 Fetching companies for userId:', userId);
    
    const companies = await Company.find({ userId }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${companies.length} companies`);
    
    res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
export const getCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;
    
    const company = await Company.findOne({ _id: companyId, userId });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('❌ Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message
    });
  }
};

// @desc    Create company
// @route   POST /api/companies
// @access  Private
export const createCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyData = req.body;
    
    console.log('📝 Creating company for userId:', userId);
    console.log('📦 Company data:', JSON.stringify(companyData, null, 2));
    
    // Validate required fields
    if (!companyData.businessName || !companyData.businessType || !companyData.mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Business name, type, and mobile number are required'
      });
    }
    
    // Check if this is the first company, make it active
    const existingCompanies = await Company.find({ userId });
    const isActive = existingCompanies.length === 0;
    
    const company = await Company.create({
      userId,
      ...companyData,
      isActive
    });
    
    console.log('✅ Company created:', company._id);
    
    res.status(201).json({
      success: true,
      data: company,
      message: 'Company created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating company:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message
    });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;
    const companyData = req.body;
    
    console.log('📝 Updating company:', companyId);
    
    let company = await Company.findOne({ _id: companyId, userId });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Update fields
    Object.keys(companyData).forEach(key => {
      if (key !== 'isActive') { // Prevent direct isActive updates
        company[key] = companyData[key];
      }
    });
    
    await company.save();
    
    console.log('✅ Company updated:', company._id);
    
    res.status(200).json({
      success: true,
      data: company,
      message: 'Company updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company',
      error: error.message
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
export const deleteCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;
    
    console.log('🗑️ Deleting company:', companyId);
    
    const company = await Company.findOneAndDelete({ _id: companyId, userId });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // If deleted company was active, set another company as active
    if (company.isActive) {
      const nextCompany = await Company.findOne({ userId });
      if (nextCompany) {
        nextCompany.isActive = true;
        await nextCompany.save();
      }
    }
    
    console.log('✅ Company deleted');
    
    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting company',
      error: error.message
    });
  }
};

// @desc    Set company as active
// @route   PUT /api/companies/:id/set-active
// @access  Private
export const setActiveCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;
    
    console.log('⭐ Setting active company:', companyId);
    
    // Deactivate all companies for this user
    await Company.updateMany({ userId }, { isActive: false });
    
    // Activate the selected company
    const company = await Company.findOneAndUpdate(
      { _id: companyId, userId },
      { isActive: true },
      { new: true }
    );
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    console.log('✅ Company set as active');
    
    res.status(200).json({
      success: true,
      data: company,
      message: 'Company set as active'
    });
  } catch (error) {
    console.error('❌ Error setting active company:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting active company',
      error: error.message
    });
  }
};

// @desc    Get active company
// @route   GET /api/companies/active
// @access  Private
export const getActiveCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const company = await Company.findOne({ userId, isActive: true });
    
    if (!company) {
      return res.status(200).json({
        success: true,
        message: 'No active company found',
        data: null
      });
    }
    
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('❌ Error fetching active company:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active company',
      error: error.message
    });
  }
};
