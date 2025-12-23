import express from 'express';
import { getPaidMembers } from '../controllers/memberController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/paid-members', protect, getPaidMembers);

export default router;
