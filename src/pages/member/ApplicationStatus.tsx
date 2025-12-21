import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info, CheckCircle, Clock, FileText, Menu, Loader2, RefreshCw, CreditCard } from 'lucide-react';
import MemberSidebar from './MemberSidebar';
import { getUserApplication } from '@/services/applicationApi';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface ApprovalStatus {
  adminId?: string;
  adminName?: string;
  status: string;
  remarks?: string;
  actionDate?: string;
}

interface Application {
  _id: string;
  applicationId: string;
  memberName: string;
  state: string;
  district: string;
  block: string;
  status: string;
  approvals: {
    block: ApprovalStatus;
    district: ApprovalStatus;
    state: ApprovalStatus;
  };
  submittedAt: string;
}

export default function ApplicationStatus() {
  const q = useQuery();
  const id = q.get('id');
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    loadApplicationData();
  }, []);

  const loadApplicationData = async () => {
    setLoading(true);
    try {
      console.log('📥 Loading application data...');
      
      // Try to get application from backend
      const app = await getUserApplication();
      console.log('📦 Received application data:', app);
      console.log('👤 CRITICAL - Member Type:', app?.memberType);
      console.log('🏢 Business Experience:', app?.businessExperience);
      
      if (app) {
        console.log('✅ Application status:', {
          applicationId: app.applicationId,
          status: app.status,
          memberType: app.memberType,
          blockApproval: app.approvals?.block?.status,
          districtApproval: app.approvals?.district?.status,
          stateApproval: app.approvals?.state?.status
        });
        setApplication(app);
      } else {
        console.log('⚠️ No application found, checking localStorage');
        // Fallback to localStorage
        const data = localStorage.getItem("applicationSubmission");
        if (data) {
          setSubmissionData(JSON.parse(data));
        }
      }
    } catch (error) {
      console.error('❌ Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-700">Loading application status...</p>
        </div>
      </div>
    );
  }

  // Build stages from real application data
  const getStagesFromApplication = () => {
    if (!application) {
      // Fallback to default pending stages
      return [
        { id: 1, name: 'Block Admin', admin: 'Pending Assignment', status: 'pending', remarks: '', icon: FileText },
        { id: 2, name: 'District Admin', admin: 'Pending Assignment', status: 'pending', remarks: '', icon: FileText },
        { id: 3, name: 'State Admin', admin: 'Pending Assignment', status: 'pending', remarks: '', icon: FileText },
        { id: 4, name: 'Ready for Payment', admin: 'ACTIV Super Admin', status: 'pending', remarks: '', icon: CheckCircle }
      ];
    }

    const stages = [];

    // Block Admin Stage
    const blockAdmin = application.approvals.block;
    const isBlockInProgress = application.status === 'pending_block_approval' && blockAdmin.status === 'pending';
    const isBlockCompleted = blockAdmin.status === 'approved';
    const isBlockRejected = blockAdmin.status === 'rejected';
    
    stages.push({
      id: 1,
      name: 'Block Admin',
      admin: blockAdmin.adminName || `${application.block} Block Admin`,
      status: isBlockRejected ? 'rejected' : 
              isBlockCompleted ? 'completed' : 
              isBlockInProgress ? 'in-progress' : 'pending',
      remarks: blockAdmin.remarks || '',
      actionDate: blockAdmin.actionDate,
      icon: FileText
    });

    // District Admin Stage
    const districtAdmin = application.approvals.district;
    const isDistrictInProgress = application.status === 'pending_district_approval' && districtAdmin.status === 'pending';
    const isDistrictCompleted = districtAdmin.status === 'approved';
    const isDistrictRejected = districtAdmin.status === 'rejected';
    
    stages.push({
      id: 2,
      name: 'District Admin',
      admin: districtAdmin.adminName || `${application.district} District Admin`,
      status: isDistrictRejected ? 'rejected' :
              isDistrictCompleted ? 'completed' :
              isDistrictInProgress ? 'in-progress' : 'pending',
      remarks: districtAdmin.remarks || '',
      actionDate: districtAdmin.actionDate,
      icon: FileText
    });

    // State Admin Stage
    const stateAdmin = application.approvals.state;
    const isStateInProgress = application.status === 'pending_state_approval' && stateAdmin.status === 'pending';
    const isStateCompleted = stateAdmin.status === 'approved';
    const isStateRejected = stateAdmin.status === 'rejected';
    
    stages.push({
      id: 3,
      name: 'State Admin',
      admin: stateAdmin.adminName || `${application.state} State Admin`,
      status: isStateRejected ? 'rejected' :
              isStateCompleted ? 'completed' :
              isStateInProgress ? 'in-progress' : 'pending',
      remarks: stateAdmin.remarks || '',
      actionDate: stateAdmin.actionDate,
      icon: FileText
    });

    // Payment Stage
    stages.push({
      id: 4,
      name: 'Ready for Payment',
      admin: 'ACTIV Super Admin',
      status: application.status === 'approved' ? 'completed' : 'pending',
      remarks: '',
      actionDate: undefined,
      icon: CheckCircle
    });

    return stages;
  };

  const stages = getStagesFromApplication();
  const completedStages = stages.filter(s => s.status === 'completed').length;
  const totalStages = stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  // Check if application was rejected
  const isRejected = stages.some(s => s.status === 'rejected');

  // If coming from query parameter (old flow), show approval stages
  if (id || application) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">Application Status</h1>
              <Button
                variant="outline"
                size="icon"
                onClick={loadApplicationData}
                className="hover:bg-blue-50"
                title="Refresh status"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-700">Track your membership approval progress</p>
            {application && (
              <p className="text-sm text-gray-600 mt-2">
                Application ID: <span className="font-semibold">{application.applicationId}</span>
              </p>
            )}
          </div>

          {/* Stage cards - existing code continues */}
          <Card className="rounded-2xl shadow-lg mb-6 bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-center mb-4">Overall Progress</h2>
              <p className="text-center text-gray-600 mb-4">{completedStages} of {totalStages} stages completed</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Stage Indicators */}
              <div className="grid grid-cols-4 gap-4">
                {stages.map((stage, index) => {
                  const isCompleted = stage.status === 'completed';
                  const isInProgress = stage.status === 'in-progress';
                  const isRejected = stage.status === 'rejected';

                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted ? 'bg-green-500' : 
                        isInProgress ? 'bg-blue-500' :
                        isRejected ? 'bg-red-500' : 'bg-gray-300'
                      }`}>
                        {isCompleted && <CheckCircle className="w-8 h-8 text-white" />}
                        {isInProgress && <Clock className="w-8 h-8 text-white animate-pulse" />}
                        {!isCompleted && !isInProgress && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <p className="text-xs text-center font-medium">{stage.name}</p>
                      <p className="text-xs text-center text-gray-500">{stage.admin}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stage Cards */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in-progress';
              const isRejected = stage.status === 'rejected';

              return (
                <Card key={stage.id} className="rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green-500' : 
                        isInProgress ? 'bg-blue-500' :
                        isRejected ? 'bg-red-500' : 'bg-gray-300'
                      }`}>
                        {isCompleted && <CheckCircle className="w-6 h-6 text-white" />}
                        {isInProgress && <Clock className="w-6 h-6 text-white" />}
                        {!isCompleted && !isInProgress && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{stage.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{stage.admin}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          isCompleted ? 'bg-green-100 text-green-700' :
                          isInProgress ? 'bg-blue-100 text-blue-700' :
                          isRejected ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? 'Approved' : isInProgress ? 'In Review' : isRejected ? 'Rejected' : 'Pending'}
                        </span>
                        {stage.remarks && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{stage.remarks}</p>
                          </div>
                        )}
                        {stage.actionDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(stage.actionDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Payment Action Section - Show when approved and payment not completed */}
          {application?.status === 'approved' && application?.paymentStatus !== 'completed' && (
            <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    🎉 Application Approved!
                  </h3>
                  <p className="text-green-700 mb-6">
                    Your application has been approved. Please proceed to payment to complete your membership registration.
                  </p>
                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-lg font-semibold"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Register for Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Completed Section */}
          {application?.paymentStatus === 'completed' && (
            <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">
                    ✅ Membership Active
                  </h3>
                  <p className="text-purple-700 mb-4">
                    Your payment has been completed and your membership is now active!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/member/certificate')}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      View Certificate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/member/payment-history')}
                    >
                      View Payment Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            onClick={() => navigate('/member/dashboard')}
          >
            Back to Dashboard
          </Button>

          {/* Payment Registration Dialog */}
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <DialogTitle className="text-2xl">Payment Registration</DialogTitle>
                </div>
                <DialogDescription className="text-base text-gray-700 mt-2">
                  You are about to proceed with the payment registration process.
                </DialogDescription>
              </DialogHeader>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-purple-900 mb-3">Next Steps:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-purple-800">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Complete payment process</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-800">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Receive membership confirmation</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-800">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Access member benefits</span>
                  </li>
                </ul>
              </div>

              <DialogFooter className="flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowPaymentDialog(false);
                    // Route to correct payment page based on member type
                    // Aspirants go to simple ₹2000 plan
                    // Business members go to tiered plans (₹5000, ₹10000, ₹20000)
                    console.log('🔍 Routing logic - Application data:', {
                      memberType: application?.memberType,
                      businessExperience: application?.businessExperience
                    });
                    
                    const isAspirant = application?.memberType === 'aspirant';
                    
                    if (isAspirant) {
                      console.log('➡️ Routing to Aspirant Plan (₹2000)');
                      navigate('/payment/membership-plan'); // Aspirant Plan ₹2000
                    } else {
                      console.log('➡️ Routing to Business Plans (3 tiers)');
                      navigate('/payment/membership-plans'); // Business Plans
                    }
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Proceed
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // No application found - show the detailed form view with mock data
  const applicationData = {
    applicationId: application?.applicationId || 'ACTV2024001',
    submittedDate: application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : '15 Dec 2024, 10:30 AM',
    personalInfo: {
      name: localStorage.getItem('userName') || 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra',
      occupation: 'Business Owner'
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      {/* Centered Form Container */}
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <Card className="shadow-2xl border-0 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Membership Application</h1>
                <p className="text-blue-100 text-lg">Application Status & Review Progress</p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => navigate('/member/dashboard')}
              >
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
          </div>

          {/* Application ID Banner */}
          <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application ID</p>
                  <p className="text-xl font-bold text-gray-900">{applicationData.applicationId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.submittedDate}</p>
                </div>
              </div>
              <div>
                <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold bg-blue-600 text-white shadow-md">
                  Under Review
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information Section */}
        <Card className="shadow-2xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <CardTitle className="text-2xl text-gray-900">Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Info className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{applicationData.personalInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Info className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Info className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="w-14 h-14 rounded-xl bg-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Info className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 md:col-span-2">
                <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Info className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Occupation</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.occupation}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracking Section */}
        <Card className="shadow-2xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-900">Review Progress</CardTitle>
              <div className="text-right">
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round(progressPercentage)}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-base font-semibold text-gray-700">{completedStages} of {totalStages} stages completed</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 h-6 rounded-full transition-all duration-700 shadow-lg flex items-center justify-end pr-3"
                  style={{ width: `${progressPercentage || 5}%` }}
                >
                  {progressPercentage > 10 && (
                    <span className="text-xs font-bold text-white">{Math.round(progressPercentage)}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stage Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stages.map((stage, index) => {
                const isCompleted = stage.status === 'completed';
                const isInProgress = stage.status === 'in-progress';
                const Icon = stage.icon;

                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-3 shadow-xl transition-all duration-300 ${isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-green-700 text-white'
                      : isInProgress
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-4 ring-blue-300 animate-pulse'
                        : 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-600'
                      }`}>
                      <Icon className="w-12 h-12" />
                    </div>
                    <p className="text-base text-center text-gray-900 font-bold leading-tight mb-1">
                      {stage.name}
                    </p>
                    <p className="text-xs text-center text-gray-600">
                      {stage.admin}
                    </p>
                    <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${isCompleted
                      ? 'bg-green-100 text-green-700'
                      : isInProgress
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-600'
                      }`}>
                      {isCompleted ? 'Approved' : isInProgress ? 'In Review' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Stage Info */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-600 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Currently Under Review</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Your application is being reviewed by the <strong>Block Admin</strong>. This process typically takes 2-3 business days. You will receive an email notification once this stage is completed.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Expected completion: Within 3 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-600 to-purple-700">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Next Steps</h3>
                <p className="text-blue-100 leading-relaxed text-lg">
                  Once all approval stages are complete, you will be notified via email and SMS. You'll then be able to proceed to the payment section to complete your ACTIVian membership registration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-2xl"
          onClick={() => navigate('/member/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
