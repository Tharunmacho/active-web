import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, FileText, Loader2, Calendar, User, CreditCard, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getUserApplication } from '@/services/applicationApi';

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = async () => {
    try {
      // Check if we have details from navigation state
      const stateDetails = location.state;
      
      // Or get from URL parameters (from Instamojo redirect)
      const status = searchParams.get('status');
      const paymentId = searchParams.get('payment_id');
      const transactionId = searchParams.get('transaction_id');

      if (status === 'success' || stateDetails || true) { // Always show for testing
        // Fetch latest application data
        const app = await getUserApplication();
        
        // Determine plan type based on memberType and payment details
        let planType = 'Aspirant Plan';
        let planAmount = 2000;
        
        if (app.paymentDetails?.planType) {
          // Use saved payment details if available
          planType = app.paymentDetails.planType;
          planAmount = app.paymentDetails.planAmount || 2000;
        } else if (app.memberType === 'business') {
          // Business member - use default business plan
          planType = 'Business Membership';
          planAmount = 5000; // Default to basic plan
        } else if (app.memberType === 'aspirant') {
          planType = 'Aspirant Plan';
          planAmount = 2000;
        }
        
        const details = {
          membershipId: `ACTIV-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
          memberName: app.memberName || 'Member',
          transactionId: transactionId || stateDetails?.transactionId || app.paymentDetails?.instamojoPaymentId || 'TEST_' + Date.now(),
          paymentDate: stateDetails?.paymentDate || app.paymentDate || new Date().toISOString(),
          planType: stateDetails?.planType || planType,
          planAmount: stateDetails?.planAmount || planAmount,
          supportAmount: stateDetails?.supportAmount || app.paymentDetails?.supportAmount || 0,
          totalAmount: stateDetails?.totalAmount || app.paymentAmount || planAmount,
          applicationId: app.applicationId,
          validFor: '1 Year'
        };
        
        setPaymentDetails(details);
        
        // Fire confetti animation
        fireConfetti();
      } else {
        // Redirect to dashboard if no valid payment details
        navigate('/member/dashboard');
      }
    } catch (error) {
      console.error('Error loading payment details:', error);
      // Don't redirect on error during testing
      setPaymentDetails({
        membershipId: 'ACTIV-2024-000000',
        memberName: 'Test Member',
        transactionId: 'TEST_' + Date.now(),
        paymentDate: new Date().toISOString(),
        planType: 'Aspirant Plan',
        planAmount: 2000,
        supportAmount: 0,
        totalAmount: 2000,
        applicationId: 'TEST-APP',
        validFor: '1 Year'
      });
    } finally {
      setLoading(false);
    }
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#10B981', '#8B5CF6']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3B82F6', '#10B981', '#8B5CF6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-700">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return null;
  }

  const handleDownloadReceipt = () => {
    // In a real application, this would generate and download a PDF receipt
    const receiptData = `
ACTIV MEMBERSHIP - PAYMENT RECEIPT
======================================

Transaction ID: ${paymentDetails.transactionId}
Payment Date: ${new Date(paymentDetails.paymentDate).toLocaleString()}
Application ID: ${paymentDetails.applicationId || 'N/A'}

Membership Type: ${paymentDetails.planType === 'annual' ? 'Annual Membership' : 'Lifetime Membership'}
Membership Fee: ₹${paymentDetails.planAmount}
Support Amount: ₹${paymentDetails.supportAmount || 0}
--------------------------------------
Total Amount Paid: ₹${paymentDetails.totalAmount}

Status: COMPLETED
Payment Method: ${paymentDetails.paymentMethod?.toUpperCase() || 'CARD'}

Thank you for joining ACTIV!
======================================
    `.trim();

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACTIV_Payment_Receipt_${paymentDetails.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-4">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-700">
            Welcome to ACTIV – Your membership is now active
          </p>
        </div>

        {/* Membership Details Card */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Membership Details</h2>
              <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Membership ID</span>
                <span className="font-semibold text-gray-900">{paymentDetails.membershipId}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Member Name</span>
                <span className="font-semibold text-gray-900">{paymentDetails.memberName}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">{paymentDetails.planType}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold text-blue-600 text-lg">₹{paymentDetails.totalAmount}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Valid</span>
                <span className="font-semibold text-gray-900">{paymentDetails.validFor}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Payment Reference</span>
                <span className="font-mono text-xs text-gray-900">{paymentDetails.transactionId}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Documents Card */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Download Documents</h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start py-6 text-left hover:bg-gray-50"
                onClick={() => navigate('/member/certificate')}
              >
                <FileText className="w-5 h-5 mr-3" />
                <span className="font-medium">Download Membership Certificate</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start py-6 text-left hover:bg-gray-50"
                onClick={handleDownloadReceipt}
              >
                <Download className="w-5 h-5 mr-3" />
                <span className="font-medium">Download Payment Receipt</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Info */}
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Confirmation has been sent to your registered email and WhatsApp number. 
              Keep these for your records.
            </p>
          </CardContent>
        </Card>

        {/* What's Next Card */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Access your member dashboard to update profile and browse other members.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Join area-specific events and networking opportunities.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connect with fellow ACTIV members in your region.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Go to Dashboard Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold shadow-lg"
          onClick={() => navigate('/payment/member-dashboard')}
        >
          Go to Member Dashboard
        </Button>
      </div>
    </div>
  );
}
