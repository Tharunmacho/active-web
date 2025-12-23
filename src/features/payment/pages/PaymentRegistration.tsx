import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ArrowLeft, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getUserApplication } from '@/services/applicationApi';
import { initiatePayment } from '@/services/paymentApi';

export default function PaymentRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const app = await getUserApplication();
      
      // Check if application is approved
      if (app.status !== 'approved') {
        toast.error('Your application must be approved before payment');
        navigate('/member/application-status');
        return;
      }

      // Check if already paid
      if (app.paymentStatus === 'completed') {
        toast.info('Payment already completed');
        navigate('/member/dashboard');
        return;
      }

      setApplication(app);
    } catch (error) {
      console.error('Error loading application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!application) {
      toast.error('Application not found');
      return;
    }

    setProcessing(true);
    try {
      // For Aspirant plan - fixed pricing
      const paymentData = {
        planType: 'annual' as 'annual' | 'lifetime',
        planAmount: 2000,
        supportAmount: 0,
        totalAmount: 2000
      };

      console.log('🔄 Initiating payment...');
      const result = await initiatePayment(paymentData);
      
      console.log('📦 Payment initiation result:', result);
      
      if (result.success && result.paymentUrl) {
        if (result.testMode) {
          toast.info('Using Test Mode - Instamojo unavailable');
          console.log('🧪 Test mode enabled, redirecting to mock payment');
        } else {
          toast.success('Redirecting to payment gateway...');
        }
        
        // Redirect to payment URL (either Instamojo or mock)
        console.log('🔗 Redirecting to:', result.paymentUrl);
        window.location.href = result.paymentUrl;
      } else {
        toast.error(result.message || 'Failed to initiate payment');
        setProcessing(false);
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-700">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-700 hover:text-gray-900"
          onClick={() => navigate('/member/application-status')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Status
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Membership</h1>
          <p className="text-gray-700 text-lg">
            Select your membership type and pay securely
          </p>
        </div>

        {/* Select Membership Plan Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Select Membership Plan</h2>
          
          {/* Aspirant Plan Card */}
          <Card className="border-4 border-blue-500 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">Aspirant Plan</h3>
              <p className="text-gray-600 mb-4">For students without company experience</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access to learning resources and webinars</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Student-only events and competitions</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Mentorship and career guidance</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Networking with professionals</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">₹2,000</div>
                <div className="text-gray-500">/ annum</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secure Payment Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Secure Payment</h2>
          <Card className="bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Secure Payment - Powered by Instamojo</p>
                  <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-700">Member Type</span>
                  <span className="font-semibold">Aspirant (Student)</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-700">Plan</span>
                  <span className="font-semibold">Aspirant Plan</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-2xl">₹2,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pay Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-xl font-semibold mb-6"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ₹2,000`
          )}
        </Button>

        {/* After Payment Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">After Payment</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">Instant membership activation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">Digital certificate download</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">Email & WhatsApp confirmation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">Access to member dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
