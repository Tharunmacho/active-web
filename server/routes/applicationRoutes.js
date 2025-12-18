import express from 'express';
import {
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getApplicationStats,
  submitApplication
} from '../controllers/applicationController.js';
import { protect } from '../middleware/adminAuth.js';
import { protect as memberProtect } from '../middleware/auth.js';

const router = express.Router();

// Member route - submit application (must come before protect middleware)
router.post('/submit', memberProtect, submitApplication);

// All other routes are protected (admin only)
router.use(protect);

// Get all applications for admin
router.get('/', getApplications);

// Get application statistics
router.get('/stats', getApplicationStats);

// Get single application
router.get('/:id', getApplicationById);

// Approve application
router.post('/:id/approve', approveApplication);

// Reject application
router.post('/:id/reject', rejectApplication);

export default router;
