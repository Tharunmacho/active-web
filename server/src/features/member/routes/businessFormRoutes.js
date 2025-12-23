import express from 'express';
import { getBusinessForm, saveBusinessForm } from '../controllers/businessFormController.js';
import { protect } from '../../../shared/middleware/auth.js';

const router = express.Router();

router.get('/', protect, getBusinessForm);
router.post('/', protect, saveBusinessForm);

export default router;

