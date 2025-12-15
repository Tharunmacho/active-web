import PersonalForm from '../models/PersonalForm.js';

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
      // Update existing form
      Object.assign(personalForm, formData);
      await personalForm.save();
    } else {
      // Create new form
      personalForm = await PersonalForm.create({
        userId: req.user.id,
        ...formData
      });
    }

    res.json({ success: true, data: personalForm });
  } catch (error) {
    console.error('Error saving personal form:', error);
    res.status(500).json({ success: false, message: 'Error saving personal form' });
  }
};
