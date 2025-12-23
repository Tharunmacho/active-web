import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Lock, Shield } from 'lucide-react';
import { getUserApplication } from '@/services/applicationApi';
import { initiatePayment } from '@/services/paymentApi';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  experience: string;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'For companies less than 5 years',
    price: 5000,
    experience: '< 5 years',
    features: [
      'Compliance and documentation guidance',
      'Access to networking forums',
      'Standard email support'
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate Plan',
    description: 'For companies 5 – 10 years',
    price: 10000,
    experience: '5 - 10 years',
    popular: true,
    features: [
      'All Basic benefits',
      'Priority event invitations',
      'Growth and scaling advisory sessions'
    ]
  },
  {
    id: 'ideal',
    name: 'Ideal Plan',
    description: 'For companies 10+ years',
    price: 20000,
    experience: '10+ years',
    features: [
      'All Intermediate benefits',
      'Premium advisory and consulting',
      'Featured listing and special recognition'
    ]
  }
];

export default function MembershipPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1]); // Default to Intermediate
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const app = await getUserApplication();
      setUserData({
        memberType: 'Company',
        experience: app.businessExperience || '5 - 10 years',
        applicationId: app.applicationId,
        memberName: app.memberName,
        memberEmail: app.memberEmail
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData({
        memberType: 'Company',
        experience: '5 - 10 years',
        applicationId: 'APP-TEST',
        memberName: 'Member',
        memberEmail: 'member@activ.org'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const paymentData = {
        planType: selectedPlan.name,
        planAmount: selectedPlan.price,
        supportAmount: 0,
        totalAmount: selectedPlan.price
      };

      const result = await initiatePayment(paymentData);

      if (result.success) {
        // Redirect to payment URL (either real Instamojo or mock)
        window.location.href = result.paymentUrl;
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Payment initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Back to Status</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Complete Your Membership
          </h1>
          <p className="text-gray-600 text-lg">
            Select your membership type and pay securely
          </p>
        </div>

        {/* Plan Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Membership Plan</h2>
          
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan.id === plan.id
                    ? 'border-blue-500 border-2 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>
                    {plan.popular && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</p>
                    <p className="text-gray-600">/ annum</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Secure Payment Badge */}
        <Card className="bg-green-50 border-green-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Secure Payment</p>
                <p className="text-sm text-green-700">
                  Powered by Instamojo - Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Member Type</span>
                <span className="font-semibold text-gray-900">{userData.memberType}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Experience</span>
                <span className="font-semibold text-gray-900">{selectedPlan.experience}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">{selectedPlan.name}</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{selectedPlan.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-xl font-semibold shadow-lg"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>Pay ₹{selectedPlan.price.toLocaleString()}</>
          )}
        </Button>

        {/* After Payment Info */}
        <Card className="mt-6 bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-3">After Payment</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Instant membership activation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Digital certificate download</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Email & WhatsApp confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Access to member dashboard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
