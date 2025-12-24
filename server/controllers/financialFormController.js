import FinancialForm from '../src/shared/models/FinancialForm.js';

// @desc    Get user's financial form data
// @route   GET /api/financial-form
// @access  Private
export const getFinancialForm = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let form = await FinancialForm.findOne({ userId });
    
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
    console.error('Error fetching financial form:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial form data',
      error: error.message
    });
  }
};

// @desc    Save or update financial form
// @route   POST /api/financial-form
// @access  Private
export const saveFinancialForm = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;
    
    let form = await FinancialForm.findOne({ userId });
    
    if (!form) {
      form = await FinancialForm.create({
        userId,
        ...formData
      });
    } else {
      Object.keys(formData).forEach(key => {
        form[key] = formData[key];
      });
      await form.save();
    }
    
    res.status(200).json({
      success: true,
      data: form,
      message: 'Financial form saved successfully'
    });
  } catch (error) {
    console.error('Error saving financial form:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving financial form',
      error: error.message
    });
  }
};
