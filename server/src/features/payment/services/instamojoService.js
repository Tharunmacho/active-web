import axios from 'axios';

const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY;
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;
const INSTAMOJO_ENDPOINT = process.env.INSTAMOJO_ENDPOINT || 'https://test.instamojo.com/api/1.1/';

/**
 * Create a payment request on Instamojo
 */
export const createPaymentRequest = async (paymentData) => {
  try {
    const { amount, purpose, buyerName, email, phone, redirectUrl, webhookUrl } = paymentData;

    const response = await axios.post(
      `${INSTAMOJO_ENDPOINT}payment-requests/`,
      {
        purpose: purpose || 'ACTIV Membership Payment',
        amount: amount,
        buyer_name: buyerName,
        email: email,
        phone: phone || '',
        redirect_url: redirectUrl,
        webhook: webhookUrl,
        send_email: true,
        send_sms: false,
        allow_repeated_payments: true
      },
      {
        headers: {
          'X-Api-Key': INSTAMOJO_API_KEY,
          'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (response.data && response.data.success) {
      return {
        success: true,
        paymentRequestId: response.data.payment_request.id,
        longUrl: response.data.payment_request.longurl,
        shortUrl: response.data.payment_request.shorturl,
        status: response.data.payment_request.status
      };
    } else {
      return {
        success: false,
        message: 'Failed to create payment request',
        error: response.data
      };
    }
  } catch (error) {
    console.error('Instamojo Payment Request Error:', error.message);
    
    // Return a structured error that can be handled by the controller
    return {
      success: false,
      message: 'Instamojo service unavailable',
      error: {
        code: error.code,
        message: error.message,
        isNetworkError: error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED'
      }
    };
  }
};

/**
 * Verify payment status on Instamojo
 */
export const verifyPaymentStatus = async (paymentRequestId) => {
  try {
    const response = await axios.get(
      `${INSTAMOJO_ENDPOINT}payment-requests/${paymentRequestId}/`,
      {
        headers: {
          'X-Api-Key': INSTAMOJO_API_KEY,
          'X-Auth-Token': INSTAMOJO_AUTH_TOKEN
        }
      }
    );

    if (response.data && response.data.success) {
      const paymentRequest = response.data.payment_request;
      
      return {
        success: true,
        status: paymentRequest.status,
        payments: paymentRequest.payments || [],
        amount: paymentRequest.amount
      };
    } else {
      return {
        success: false,
        message: 'Failed to verify payment'
      };
    }
  } catch (error) {
    console.error('Instamojo Verify Payment Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to verify payment',
      error: error.response?.data || error.message
    };
  }
};

/**
 * Get payment details by payment ID
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await axios.get(
      `${INSTAMOJO_ENDPOINT}payments/${paymentId}/`,
      {
        headers: {
          'X-Api-Key': INSTAMOJO_API_KEY,
          'X-Auth-Token': INSTAMOJO_AUTH_TOKEN
        }
      }
    );

    if (response.data && response.data.success) {
      const payment = response.data.payment;
      
      return {
        success: true,
        payment: {
          id: payment.payment_id,
          status: payment.status,
          amount: payment.amount,
          buyerName: payment.buyer_name,
          buyerEmail: payment.buyer_email,
          buyerPhone: payment.buyer_phone,
          currency: payment.currency,
          createdAt: payment.created_at
        }
      };
    } else {
      return {
        success: false,
        message: 'Failed to get payment details'
      };
    }
  } catch (error) {
    console.error('Instamojo Get Payment Details Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to get payment details',
      error: error.response?.data || error.message
    };
  }
};
