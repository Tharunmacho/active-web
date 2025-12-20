import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
  getPaymentDetails,
  handleWebhook,
  handlePaymentSuccess
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (no authentication needed)
router.post('/webhook', handleWebhook);

// Payment success callback (no authentication needed)
router.get('/success', handlePaymentSuccess);

// All other payment routes require authentication
router.use(protect);

// Initiate payment for approved application
router.post('/initiate', initiatePayment);

// Verify payment after completion
router.post('/verify', verifyPayment);

// Get payment history for current user
router.get('/history', getPaymentHistory);

// Get specific payment details
router.get('/:paymentId', getPaymentDetails);

export default router;
