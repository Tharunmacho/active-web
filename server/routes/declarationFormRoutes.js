import express from 'express';
import { getDeclarationForm, saveDeclarationForm } from '../controllers/declarationFormController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getDeclarationForm);
router.post('/', protect, saveDeclarationForm);
router.put('/', protect, saveDeclarationForm); // Add PUT for updates

export default router;
