import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MockPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  
  const paymentRequestId = searchParams.get('payment_request_id');
  const amount = searchParams.get('amount');

  const handlePayment = async (success: boolean) => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = `TEST_${Date.now()}`;
      
      if (success) {
        toast.success('Payment successful!');
        // In test mode, directly navigate to confirmation without calling backend verify
        navigate(`/payment/confirmation?status=success&payment_id=${paymentRequestId}&transaction_id=${transactionId}`);
      } else {
        toast.error('Payment failed');
        navigate('/member/application-status');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Test Payment Gateway</h1>
            <p className="text-gray-600 mb-4">
              This is a test mode payment simulation
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Payment Request ID</p>
              <p className="font-mono text-sm">{paymentRequestId}</p>
              <p className="text-2xl font-bold text-blue-600 mt-3">₹{amount}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
              onClick={() => handlePayment(true)}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Simulate Successful Payment
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-6 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handlePayment(false)}
              disabled={processing}
            >
              Simulate Failed Payment
            </Button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Test Mode:</strong> This is a simulation because Instamojo gateway is currently unreachable. 
              In production, you'll be redirected to the actual payment gateway.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
