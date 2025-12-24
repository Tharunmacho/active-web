import express from 'express';
import { getFinancialForm, saveFinancialForm } from '../controllers/financialFormController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getFinancialForm);
router.post('/', protect, saveFinancialForm);
router.put('/', protect, saveFinancialForm); // Add PUT for updates

export default router;
