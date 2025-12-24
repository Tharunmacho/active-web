import express from 'express';
import { getBusinessForm, saveBusinessForm } from '../controllers/businessFormController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getBusinessForm);
router.post('/', protect, saveBusinessForm);
router.put('/', protect, saveBusinessForm); // Add PUT for updates

export default router;
