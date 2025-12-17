import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ApplicationSubmitted() {
  const q = useQuery();
  const id = q.get('id');
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardContent>
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
  
  const steps = [
    { 
      id: 1, 
      title: 'Application Received', 
      description: 'Your application has been received and assigned for review.',
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'Block Admin Review', 
      description: 'Pending review by block administrator.',
      status: 'pending' 
    },
    { 
      id: 3, 
      title: 'District Admin Review', 
      description: 'Pending review by district administrator.',
      status: 'pending' 
    },
    { 
      id: 4, 
      title: 'State Admin Review', 
      description: 'Pending review by state administrator.',
      status: 'pending' 
    },
    { 
      id: 5, 
      title: 'Final Approval', 
      description: 'Final approval and membership activation.',
      status: 'pending' 
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gray-50">
      <div className="w-full max-w-lg">
        <Card className="rounded-2xl shadow-xl border-0">
          <CardContent className="p-6 md:p-8">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-sm md:text-base text-gray-600">
                Your membership application has been successfully submitted and is now under review. 
                You will receive updates on your application status.
              </p>
            </div>

            {/* Application Summary */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Application Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="font-semibold text-blue-600">{id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">{today}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    Under Review
                  </span>
                </div>
              </div>
            </div>

            {/* Application Progress */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">Application Progress</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isCompleted = step.status === 'completed';
                  const isActive = index === 1; // First pending step is active
                  
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isCompleted 
                            ? 'bg-blue-600 text-white' 
                            : isActive 
                            ? 'bg-gray-300 text-gray-700' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {step.id}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-0.5 h-12 ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <h4 className="font-semibold text-sm md:text-base mb-1">{step.title}</h4>
                        <p className="text-xs md:text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Important Notice</h4>
                  <p className="text-xs text-gray-700">
                    Please keep your application ID safe. You may need it for future reference and status inquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate(`/member/application-status?id=${id}`)}
              >
                View Application Status
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const applicationData = {
                    id: id,
                    submittedDate: today,
                    status: 'Under Review'
                  };
                  const blob = new Blob([JSON.stringify(applicationData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${id}.json`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                Download Application Copy
              </Button>
              <Button 
                variant="ghost"
                className="w-full text-blue-600"
                onClick={() => navigate('/member/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

