import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Download, Eye, Home, Calendar, FileText, Clock } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ApplicationSubmitted() {
  const navigate = useNavigate();

  // Get application ID from localStorage (set after profile completion)
  const id = localStorage.getItem('applicationId') || 'ACTV2024001';

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-lg w-full shadow-2xl">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold">No application specified</h3>
            <p className="text-sm text-muted-foreground">Please submit your application first.</p>
            <div className="mt-3">
              <Button onClick={() => navigate('/member/dashboard')}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const steps = [
    {
      id: 1,
      title: 'Application Received',
      description: 'Your application has been received and assigned for review.',
      status: 'completed',
      icon: CheckCircle
    },
    {
      id: 2,
      title: 'Block Admin Review',
      description: 'Pending review by block administrator.',
      status: 'in-progress',
      icon: Clock
    },
    {
      id: 3,
      title: 'District Admin Review',
      description: 'Pending review by district administrator.',
      status: 'pending',
      icon: Clock
    },
    {
      id: 4,
      title: 'State Admin Review',
      description: 'Pending review by state administrator.',
      status: 'pending',
      icon: Clock
    },
    {
      id: 5,
      title: 'Final Approval',
      description: 'Final approval and membership activation.',
      status: 'pending',
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      {/* Centered Form Container */}
      <div className="max-w-4xl mx-auto">
        {/* Success Header Card */}
        <Card className="shadow-2xl border-0 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-xl">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Application Submitted Successfully!</h1>
            <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
              Your membership application has been successfully submitted and is now under review.
              You will receive updates on your application status via email and SMS.
            </p>
          </div>

          {/* Application Summary Bar */}
          <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Application ID</p>
                  <p className="text-lg font-bold text-blue-600">{id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Submitted On</p>
                  <p className="text-base font-semibold text-gray-900">{today}, {time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Current Status</p>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-orange-600 text-white shadow-md">
                    Under Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Application Progress Card */}
        <Card className="shadow-2xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <CardTitle className="text-2xl text-gray-900">Application Review Process</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';
                const isPending = step.status === 'pending';
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex gap-4 md:gap-6">
                    {/* Step Indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-green-700 text-white'
                        : isInProgress
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-4 ring-blue-300 animate-pulse'
                          : 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-600'
                        }`}>
                        <Icon className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-1 h-16 mt-2 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-gray-300'
                          }`} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{step.title}</h4>
                          <p className="text-sm md:text-base text-gray-600">{step.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${isCompleted
                          ? 'bg-green-100 text-green-700'
                          : isInProgress
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                          }`}>
                          {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                        </span>
                      </div>

                      {/* Progress Info */}
                      {isInProgress && (
                        <div className="mt-3 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-4">
                          <p className="text-sm text-blue-900 font-medium">
                            ⏱️ Currently being reviewed. Expected completion: 2-3 business days
                          </p>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="mt-3 bg-green-50 border-l-4 border-green-600 rounded-r-lg p-4">
                          <p className="text-sm text-green-900 font-medium">
                            ✅ Completed on {today}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice Card */}
        <Card className="shadow-2xl border-0 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Important Notice</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Please keep your <strong>Application ID ({id})</strong> safe for future reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>You will receive email and SMS notifications at each review stage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Review process typically takes 5-7 business days to complete</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Check your application status anytime using the button below</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg"
                onClick={() => navigate(`/member/application-status?id=${id}`)}
              >
                <Eye className="w-5 h-5 mr-2" />
                View Status
              </Button>

              <Button
                variant="outline"
                className="w-full h-14 border-2 border-blue-600 text-blue-600 font-semibold text-base shadow-md"
                onClick={() => {
                  const applicationData = {
                    id: id,
                    submittedDate: `${today}, ${time}`,
                    status: 'Under Review'
                  };
                  const blob = new Blob([JSON.stringify(applicationData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Application_${id}.json`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Copy
              </Button>

              <Button
                variant="outline"
                className="w-full h-14 border-2 border-gray-300 font-semibold text-base shadow-md"
                onClick={() => navigate('/member/dashboard')}
              >
                <Home className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
