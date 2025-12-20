import express from 'express';
import { getBusinessProfile, saveBusinessProfile, deleteBusinessProfile } from '../controllers/businessProfileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getBusinessProfile);
router.post('/', protect, saveBusinessProfile);
router.delete('/', protect, deleteBusinessProfile);

export default router;
