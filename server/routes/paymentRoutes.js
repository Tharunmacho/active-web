import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  completePayment,
  getPaymentHistory,
  getPaymentDetails,
  handleWebhook,
  handlePaymentSuccess
} from '../controllers/paymentController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (no authentication needed)
router.post('/webhook', handleWebhook);

// Payment success callback (no authentication needed)
router.get('/success', handlePaymentSuccess);

// Complete payment endpoint
router.post('/complete', protect, completePayment);

// Mock/Test payment verification (NO authentication for testing)
router.post('/verify-mock', verifyPayment);

// Initiate payment (requires authentication)
router.post('/initiate', protect, initiatePayment);

// Verify payment after completion (requires authentication)
router.post('/verify', protect, verifyPayment);

// Get payment history for current user (requires authentication)
router.get('/history', protect, getPaymentHistory);

// Get specific payment details (requires authentication)
router.get('/:paymentId', protect, getPaymentDetails);

export default router;
