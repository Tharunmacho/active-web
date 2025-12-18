import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, Clock, FileText, ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ApplicationStatus() {
  const q = useQuery();
  const id = q.get('id');
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    // Load submission data from localStorage
    const data = localStorage.getItem("applicationSubmission");
    if (data) {
      setSubmissionData(JSON.parse(data));
    }
  }, []);

  // Show admin approval stages screen
  const stages = [
    { id: 1, name: 'Block Level', admin: 'Block Admin Review', status: 'in-progress', icon: CheckCircle, color: 'blue' },
    { id: 2, name: 'District Level', admin: 'District Admin Review', status: 'pending', icon: Clock, color: 'purple' },
    { id: 3, name: 'State Level', admin: 'State Admin Review', status: 'pending', icon: Clock, color: 'indigo' },
    { id: 4, name: 'Payment', admin: 'Ready for Payment', status: 'pending', icon: FileText, color: 'cyan' }
  ];

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const totalStages = stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  // Application data
  const applicationData = {
    applicationId: 'ACTV2024001',
    submittedDate: '15 Dec 2024, 10:30 AM',
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
                <ArrowLeft className="w-4 h-4" />
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
                  <Calendar className="w-6 h-6 text-purple-600" />
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
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{applicationData.personalInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="w-14 h-14 rounded-xl bg-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-base font-semibold text-gray-900">{applicationData.personalInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 md:col-span-2">
                <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Briefcase className="w-7 h-7 text-white" />
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
      </div>
    </div>
  );
}
