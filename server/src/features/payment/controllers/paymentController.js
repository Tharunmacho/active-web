import Application from '../../../shared/models/Application.js';
import WebUser from '../../../shared/models/WebUser.js';
import { 
  createPaymentRequest, 
  verifyPaymentStatus, 
  getPaymentDetails as getInstamojoPaymentDetails 
} from '../services/instamojoService.js';

/**
 * @desc    Initiate payment for approved application
 * @route   POST /api/payment/initiate
 * @access  Private (Member)
 */
export const initiatePayment = async (req, res) => {
  try {
    const { planType, planAmount, supportAmount, totalAmount } = req.body;

    // Validate required fields
    if (!planType || !planAmount || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details'
      });
    }

    // Get user's application
    const application = await Application.findOne({ userId: req.user._id });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if application is approved
    if (application.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Application must be approved before payment'
      });
    }

    // Allow repeated payments in development/test mode
    // Comment out the check below to allow multiple test payments
    // if (application.paymentStatus === 'completed') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Payment already completed for this application'
    //   });
    // }

    // Get user details
    const user = await WebUser.findById(req.user._id);

    // Generate payment ID
    const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Check if we should use test mode
    const useTestMode = process.env.USE_TEST_MODE === 'true' || process.env.NODE_ENV === 'development';

    if (useTestMode) {
      console.log('🧪 Using TEST MODE for payment...');
      
      // Create mock payment for testing
      const mockPaymentRequestId = `MOCK_${paymentId}`;
      const mockPaymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/mock?payment_request_id=${mockPaymentRequestId}&amount=${totalAmount}`;
      
      // Update application with mock payment initiation
      application.paymentStatus = 'pending';
      application.paymentDetails = {
        paymentId,
        instamojoPaymentRequestId: mockPaymentRequestId,
        planType,
        planAmount,
        supportAmount: supportAmount || 0,
        totalAmount,
        initiatedAt: new Date(),
        testMode: true
      };

      await application.save();

      return res.json({
        success: true,
        message: 'Payment initiated successfully (Test Mode)',
        paymentId,
        paymentUrl: mockPaymentUrl,
        testMode: true,
        data: {
          paymentId,
          instamojoPaymentRequestId: mockPaymentRequestId,
          applicationId: application.applicationId,
          planType,
          totalAmount,
          paymentUrl: mockPaymentUrl
        }
      });
    }

    // Create Instamojo payment request
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/payment/success`;
    const webhookUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payment/webhook`;

    console.log('🔄 Creating Instamojo payment request...');
    const instamojoResult = await createPaymentRequest({
      amount: totalAmount,
      purpose: `ACTIV ${planType === 'annual' ? 'Annual' : 'Lifetime'} Membership - ${application.applicationId}`,
      buyerName: application.memberName || user.name,
      email: application.memberEmail || user.email,
      phone: application.memberPhone || user.phone || '',
      redirectUrl,
      webhookUrl
    });

    if (!instamojoResult.success) {
      console.error('❌ Instamojo payment request failed:', instamojoResult.error);
      console.log('🔄 Switching to TEST MODE for payment...');
      
      // For testing purposes, create a mock payment if Instamojo is unreachable
      const mockPaymentRequestId = `MOCK_${paymentId}`;
      const mockPaymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/payment/mock?payment_request_id=${mockPaymentRequestId}&amount=${totalAmount}`;
      
      // Update application with mock payment initiation
      application.paymentStatus = 'pending';
      application.paymentDetails = {
        paymentId,
        instamojoPaymentRequestId: mockPaymentRequestId,
        planType,
        planAmount,
        supportAmount: supportAmount || 0,
        totalAmount,
        initiatedAt: new Date()
      };

      await application.save();

      console.log('✅ Test mode payment initiated successfully');

      return res.json({
        success: true,
        message: 'Payment initiated successfully (Test Mode)',
        paymentId,
        paymentUrl: mockPaymentUrl,
        testMode: true,
        data: {
          paymentId,
          instamojoPaymentRequestId: mockPaymentRequestId,
          applicationId: application.applicationId,
          planType,
          totalAmount,
          paymentUrl: mockPaymentUrl
        }
      });
    }

    // Update application with payment initiation
    application.paymentStatus = 'pending';
    application.paymentDetails = {
      paymentId,
      instamojoPaymentRequestId: instamojoResult.paymentRequestId,
      planType,
      planAmount,
      supportAmount: supportAmount || 0,
      totalAmount,
      initiatedAt: new Date()
    };

    await application.save();

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      paymentId,
      paymentUrl: instamojoResult.longUrl,
      data: {
        paymentId,
        instamojoPaymentRequestId: instamojoResult.paymentRequestId,
        applicationId: application.applicationId,
        planType,
        totalAmount,
        paymentUrl: instamojoResult.longUrl
      }
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while initiating payment',
      error: error.message
    });
  }
};

/**
 * @desc    Verify and complete payment
 * @route   POST /api/payment/verify
 * @access  Private (Member)
 */
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethod, transactionId, status } = req.body;

    // Validate required fields
    if (!paymentId || !paymentMethod || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required verification details'
      });
    }

    // Get user's application
    const application = await Application.findOne({ 
      userId: req.user._id,
      'paymentDetails.paymentId': paymentId 
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application or payment not found'
      });
    }

    // In a real application, you would verify with payment gateway here
    // For now, we'll accept the payment if status is 'completed'
    if (status === 'completed') {
      application.paymentStatus = 'completed';
      application.paymentAmount = application.paymentDetails.totalAmount;
      application.paymentDate = new Date();
      application.paymentDetails = {
        ...application.paymentDetails,
        paymentMethod,
        transactionId,
        completedAt: new Date(),
        status: 'completed'
      };

      await application.save();

      res.json({
        success: true,
        message: 'Payment verified and completed successfully',
        transactionId,
        data: {
          applicationId: application.applicationId,
          paymentStatus: application.paymentStatus,
          paymentAmount: application.paymentAmount,
          paymentDate: application.paymentDate
        }
      });
    } else {
      // Payment failed or cancelled
      application.paymentStatus = 'failed';
      application.paymentDetails = {
        ...application.paymentDetails,
        status: 'failed',
        failedAt: new Date()
      };

      await application.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment history for current user
 * @route   GET /api/payment/history
 * @access  Private (Member)
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const applications = await Application.find({ 
      userId: req.user._id,
      paymentStatus: { $in: ['completed', 'pending', 'failed'] }
    })
      .select('applicationId paymentStatus paymentAmount paymentDate paymentDetails')
      .sort({ paymentDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history',
      error: error.message
    });
  }
};

/**
 * @desc    Get specific payment details
 * @route   GET /api/payment/:paymentId
 * @access  Private (Member)
 */
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const application = await Application.findOne({
      userId: req.user._id,
      'paymentDetails.paymentId': paymentId
    })
      .select('applicationId memberName paymentStatus paymentAmount paymentDate paymentDetails');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment details',
      error: error.message
    });
  }
};

/**
 * @desc    Handle Instamojo webhook
 * @route   POST /api/payment/webhook
 * @access  Public
 */
export const handleWebhook = async (req, res) => {
  try {
    console.log('📥 Instamojo Webhook received:', req.body);

    // Respond immediately to Instamojo with 200 OK
    res.status(200).json({ success: true, message: 'Webhook received' });

    const { payment_id, payment_request_id, status, amount, buyer_name, buyer_email } = req.body;

    // Find application by payment request ID
    const application = await Application.findOne({
      'paymentDetails.instamojoPaymentRequestId': payment_request_id
    });

    if (!application) {
      console.log('❌ Application not found for payment request:', payment_request_id);
      return;
    }

    if (status === 'Credit') {
      // Payment successful
      application.paymentStatus = 'completed';
      application.paymentAmount = parseFloat(amount);
      application.paymentDate = new Date();
      application.paymentDetails = {
        ...application.paymentDetails,
        instamojoPaymentId: payment_id,
        status: 'completed',
        completedAt: new Date()
      };

      await application.save();
      console.log('✅ Payment completed for application:', application.applicationId);
    } else {
      // Payment failed
      application.paymentStatus = 'failed';
      application.paymentDetails = {
        ...application.paymentDetails,
        status: 'failed',
        failedAt: new Date()
      };

      await application.save();
      console.log('❌ Payment failed for application:', application.applicationId);
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
  }
};

/**
 * @desc    Handle payment success callback (redirect from Instamojo)
 * @route   GET /api/payment/success
 * @access  Public
 */
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { payment_id, payment_request_id, payment_status } = req.query;

    console.log('📥 Payment success callback:', { payment_id, payment_request_id, payment_status });

    // Verify payment with Instamojo
    const paymentDetails = await getInstamojoPaymentDetails(payment_id);

    if (paymentDetails.success && paymentDetails.payment.status === 'Credit') {
      // Find and update application
      const application = await Application.findOne({
        'paymentDetails.instamojoPaymentRequestId': payment_request_id
      });

      if (application) {
        application.paymentStatus = 'completed';
        application.paymentAmount = parseFloat(paymentDetails.payment.amount);
        application.paymentDate = new Date();
        application.paymentDetails = {
          ...application.paymentDetails,
          instamojoPaymentId: payment_id,
          transactionId: payment_id,
          status: 'completed',
          completedAt: new Date()
        };

        await application.save();

        // Redirect to frontend success page
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}/payment/confirmation?status=success&payment_id=${payment_id}&transaction_id=${payment_id}`);
      }
    }

    // If something went wrong, redirect to failure page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}/payment/failure?status=failed`);
  } catch (error) {
    console.error('❌ Payment success callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}/payment/failure?status=error`);
  }
};

/**
 * @desc    Get payment status for current user
 * @route   GET /api/payment/status
 * @access  Private (Member)
 */
export const getPaymentStatus = async (req, res) => {
  try {
    console.log('🔍 Checking payment status for user:', req.user._id, req.user.email);
    
    // Find application for current user
    const application = await Application.findOne({ userId: req.user._id });

    if (!application) {
      console.log('❌ No application found for user:', req.user.email);
      return res.json({
        success: true,
        data: {
          isPaid: false,
          paymentStatus: null,
          message: 'No application found'
        }
      });
    }

    // Check if payment is completed
    const isPaid = application.paymentStatus === 'completed';
    
    console.log('💰 Payment Status:', {
      userEmail: req.user.email,
      applicationId: application.applicationId,
      paymentStatus: application.paymentStatus,
      isPaid: isPaid
    });

    return res.json({
      success: true,
      data: {
        isPaid,
        paymentStatus: application.paymentStatus,
        paymentDetails: isPaid ? {
          planType: application.paymentDetails?.planType,
          planAmount: application.paymentDetails?.planAmount,
          totalAmount: application.paymentDetails?.totalAmount,
          paymentDate: application.paymentDate
        } : null
      }
    });
  } catch (error) {
    console.error('❌ Error getting payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting payment status',
      error: error.message
    });
  }
};
