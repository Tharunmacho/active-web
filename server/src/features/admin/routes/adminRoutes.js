import express from 'express';
import { adminLogin, getAdminInfo, getDashboardStats, getMembers, updateAdminProfile, changeAdminPassword } from '../controllers/adminController.js';
import { protect as adminProtect } from '../../../shared/middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes (admin only)
router.get('/me', adminProtect, getAdminInfo);
router.get('/dashboard/stats', adminProtect, getDashboardStats);
router.get('/members', adminProtect, getMembers);
router.put('/profile', adminProtect, updateAdminProfile);
router.put('/change-password', adminProtect, changeAdminPassword);

export default router;

