import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, Clock, FileText, Menu } from 'lucide-react';
import MemberSidebar from './MemberSidebar';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ApplicationStatus() {
  const q = useQuery();
  const id = q.get('id');
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    // Load submission data from localStorage
    const data = localStorage.getItem("applicationSubmission");
    if (data) {
      setSubmissionData(JSON.parse(data));
    }
  }, []);

  // If coming from query parameter (old flow), show approval stages
  if (id) {
    const stages = [
      { id: 1, name: 'Block Admin', admin: 'Ariyalur Block Admin', status: 'in-progress' },
      { id: 2, name: 'District Admin', admin: 'Ariyalur District Admin', status: 'pending' },
      { id: 3, name: 'State Admin', admin: 'Tamil Nadu State Admin', status: 'pending' },
      { id: 4, name: 'Ready for Payment', admin: 'ACTIV Super Admin', status: 'pending' }
    ];

    const completedStages = stages.filter(s => s.status === 'completed').length;
    const totalStages = stages.length;
    const progressPercentage = (completedStages / totalStages) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Application Status</h1>
            <p className="text-gray-700">Track your membership approval progress</p>
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
                  
                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-sm ${
                        isCompleted 
                          ? 'bg-green-600 text-white' 
                          : isInProgress 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <p className="text-xs text-center text-gray-700 font-medium leading-tight">
                        {stage.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Review Stage Cards */}
          <div className="space-y-4 mb-6">
            {stages.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in-progress';

              return (
                <Card key={stage.id} className="rounded-2xl shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{stage.name} Review</h3>
                        <p className="text-sm text-gray-600">{stage.admin}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                        isCompleted 
                          ? 'bg-green-100 text-green-700' 
                          : isInProgress 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {isCompleted ? 'Approved' : isInProgress ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                    
                    {isInProgress && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex gap-3">
                          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800">
                            Your application is currently being reviewed. You will be notified once this stage is complete.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button 
            variant="outline"
            className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold rounded-2xl"
            onClick={() => navigate('/member/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show admin approval stages screen
  const stages = [
    { id: 1, name: 'Block Admin', admin: 'Block Admin', status: 'in-progress' },
    { id: 2, name: 'District Admin', admin: 'District Admin', status: 'pending' },
    { id: 3, name: 'State Admin', admin: 'State Admin', status: 'pending' },
    { id: 4, name: 'Ready for Payment', admin: 'ACTIV Super Admin', status: 'pending' }
  ];

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const totalStages = stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Application Status</h1>
          <p className="text-gray-700">Track your membership approval progress</p>
        </div>

        {/* Overall Progress Card */}
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
                
                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-sm ${
                      isCompleted 
                        ? 'bg-green-600 text-white' 
                        : isInProgress 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <p className="text-xs text-center text-gray-700 font-medium leading-tight">
                      {stage.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Review Stage Cards */}
        <div className="space-y-4 mb-6">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in-progress';

            return (
              <Card key={stage.id} className="rounded-2xl shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{stage.name} Review</h3>
                      <p className="text-sm text-gray-600">{stage.admin}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : isInProgress 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {isCompleted ? 'Approved' : isInProgress ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  
                  {isInProgress && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          Your application is currently being reviewed. You will be notified once this stage is complete.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Waiting for Approval Info */}
        <Card className="rounded-2xl shadow-lg mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Waiting for Approval</h3>
            <p className="text-sm text-blue-800">
              Your application is currently under review. Once all approval stages are complete, you'll be redirected to the payment section to complete your membership.
            </p>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          variant="outline"
          className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold rounded-2xl"
          onClick={() => navigate('/member/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
