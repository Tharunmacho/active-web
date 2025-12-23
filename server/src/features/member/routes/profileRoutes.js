import express from 'express';
import { 
  getAdditionalForm, 
  autoSavePersonalDetails, 
  saveAndLockProfile,
  updateAdditionalForm,
  getUserProfileById,
  getApplicationById 
} from '../controllers/profileController.js';
import { protect } from '../../../shared/middleware/auth.js';
import { protect as adminProtect } from '../../../shared/middleware/adminAuth.js';

const router = express.Router();

router.get('/additional-form', protect, getAdditionalForm);
router.put('/additional-form', protect, updateAdditionalForm);
router.put('/additional-form/auto-save', protect, autoSavePersonalDetails);
router.put('/additional-form/save-and-lock', protect, saveAndLockProfile);
router.get('/user/:userId', adminProtect, getUserProfileById);
router.get('/application/:applicationId', adminProtect, getApplicationById);

export default router;

