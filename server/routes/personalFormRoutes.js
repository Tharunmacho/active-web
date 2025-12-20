import express from 'express';
import { getPersonalForm, savePersonalForm } from '../controllers/personalFormController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getPersonalForm);
router.post('/', protect, savePersonalForm);

export default router;
