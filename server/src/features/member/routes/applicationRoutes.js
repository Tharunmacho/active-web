import express from 'express';
import {
  getApplications,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getApplicationStats,
  submitApplication,
  getMyApplication
} from '../controllers/applicationController.js';
import { protect } from '../../../shared/middleware/adminAuth.js';
import { protect as memberProtect } from '../../../shared/middleware/auth.js';

const router = express.Router();

// Member routes (must come before admin protect middleware)
router.post('/submit', memberProtect, submitApplication);
router.get('/my-application', memberProtect, getMyApplication);

// All other routes are protected (admin only)
router.use(protect);

// Get all applications for admin (no status filter) - must come before /:id
router.get('/all', getAllApplications);

// Get all applications for admin (filtered by status)
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

