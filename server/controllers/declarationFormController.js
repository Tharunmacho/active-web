import DeclarationForm from '../models/DeclarationForm.js';

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

    res.json({ success: true, data: declarationForm });
  } catch (error) {
    console.error('Error saving declaration form:', error);
    res.status(500).json({ success: false, message: 'Error saving declaration form' });
  }
};
