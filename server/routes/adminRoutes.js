import express from 'express';
import { adminLogin, getAdminInfo, getDashboardStats } from '../controllers/adminController.js';
import { protect as adminProtect } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes (admin only)
router.get('/me', adminProtect, getAdminInfo);
router.get('/dashboard/stats', adminProtect, getDashboardStats);

export default router;
