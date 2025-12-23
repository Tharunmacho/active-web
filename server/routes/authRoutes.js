import express from 'express';
import { register, login, getMe, updateProfile, changePassword, checkUserExists, updateProfilePhoto, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/check-user/:email', checkUserExists); // Debug endpoint

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/update-profile', protect, updateUserProfile);
router.put('/update-profile-photo', protect, updateProfilePhoto);
router.put('/change-password', protect, changePassword);

export default router;

