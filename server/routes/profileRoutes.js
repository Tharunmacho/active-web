import express from 'express';
import { 
  getAdditionalForm, 
  autoSavePersonalDetails, 
  saveAndLockProfile,
  updateAdditionalForm 
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/additional-form', protect, getAdditionalForm);
router.put('/additional-form', protect, updateAdditionalForm);
router.put('/additional-form/auto-save', protect, autoSavePersonalDetails);
router.put('/additional-form/save-and-lock', protect, saveAndLockProfile);

export default router;
