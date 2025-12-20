import express from 'express';
import { getDeclarationForm, saveDeclarationForm } from '../controllers/declarationFormController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getDeclarationForm);
router.post('/', protect, saveDeclarationForm);

export default router;
