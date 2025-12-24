import express from 'express';
import { getPersonalForm, savePersonalForm } from '../controllers/personalFormController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getPersonalForm);
router.post('/', protect, savePersonalForm);
router.put('/', protect, savePersonalForm); // Add PUT for updates

export default router;
