import express from 'express';
import { getFinancialForm, saveFinancialForm } from '../controllers/financialFormController.js';
import { protect } from '../../../shared/middleware/auth.js';

const router = express.Router();

router.get('/', protect, getFinancialForm);
router.post('/', protect, saveFinancialForm);

export default router;

