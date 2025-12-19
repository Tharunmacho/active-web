import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import ApprovalCard from "@/components/ui/approval-card";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Backend application types
type StageKey = 'block' | 'district' | 'state' | 'payment';
interface Stage { id: number; key: StageKey; title: string; reviewer: string; status: string; reviewDate: string | null; notes: string; }
interface ApplicationRec {
  id: string;
  userId: string;
  submittedAt: string;
  status: string; // 'Under Review' | 'Rejected' | 'Ready for Payment'
  stage: number; // 1-based index
  stages: Stage[];
  profile?: any;
}

const Approvals = () => {
  const [applications, setApplications] = useState<ApplicationRec[]>([]);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const role = (localStorage.getItem('role') || 'block_admin') as string;

  const stageByRole: Record<string, StageKey> = {
    super_admin: 'payment',
    state_admin: 'state',
    district_admin: 'district',
    block_admin: 'block',
    member: 'block',
  };

  // Helpers to compute current stage and bucket by status
  const desiredStage: StageKey = stageByRole[role] ?? 'block';
  const getCurrentStage = (a: ApplicationRec): Stage | null => {
    const idx = Math.max(1, Math.min(Number(a.stage) || 1, (a.stages || []).length)) - 1;
    return a.stages?.[idx] ?? null;
  };

  const buckets = useMemo(() => {
    const pending: ApplicationRec[] = [];
    const approved: ApplicationRec[] = [];
    const rejected: ApplicationRec[] = [];
    const all: ApplicationRec[] = [...applications];
    for (const a of applications) {
      const st = getCurrentStage(a);
      if (a.status === 'Rejected') {
        rejected.push(a);
        continue;
      }
      if (a.status === 'Ready for Payment') {
        // treat as approved for listing purposes
        approved.push(a);
        continue;
      }
      if (st?.key === desiredStage) {
        if (st.status === 'Under Review') pending.push(a);
        else if (st.status === 'Approved') approved.push(a);
        else if (st.status === 'Rejected') rejected.push(a);
      }
    }
    return { pending, approved, rejected, all };
  }, [applications, desiredStage]);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: buckets.pending.length,
    approved: buckets.approved.length,
    rejected: buckets.rejected.length,
  }), [applications.length, buckets.pending.length, buckets.approved.length, buckets.rejected.length]);

  const load = async () => {
    try {
      console.log('🔄 Fetching applications from backend...');
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('❌ No admin token found');
        toast.error('Please login again');
        return;
      }

      const response = await fetch('http://localhost:4000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      console.log('📦 Applications received:', data);

      // Map backend data to frontend format
      const mappedApplications: ApplicationRec[] = (data.data || []).map((app: any) => {
        // Determine display status and current stage
        let displayStatus = 'Under Review';
        let currentStage = 1;
        
        if (app.status === 'rejected') {
          displayStatus = 'Rejected';
        } else if (app.status === 'approved') {
          displayStatus = 'Ready for Payment';
          currentStage = 4;
        } else if (app.status === 'pending_state_approval') {
          currentStage = 3;
        } else if (app.status === 'pending_district_approval') {
          currentStage = 2;
        } else if (app.status === 'pending_block_approval') {
          currentStage = 1;
        }

        // Build stages array with approval data
        const stages: Stage[] = [
          {
            id: 1,
            key: 'block',
            title: 'Block Review',
            reviewer: app.approvals?.block?.adminName || 'Block Admin',
            status: app.approvals?.block?.status === 'approved' ? 'Approved' : 
                   app.approvals?.block?.status === 'rejected' ? 'Rejected' : 
                   currentStage === 1 ? 'Under Review' : 'Pending',
            reviewDate: app.approvals?.block?.actionDate || null,
            notes: app.approvals?.block?.remarks || ''
          },
          {
            id: 2,
            key: 'district',
            title: 'District Review',
            reviewer: app.approvals?.district?.adminName || 'District Admin',
            status: app.approvals?.district?.status === 'approved' ? 'Approved' : 
                   app.approvals?.district?.status === 'rejected' ? 'Rejected' : 
                   currentStage === 2 ? 'Under Review' : 'Pending',
            reviewDate: app.approvals?.district?.actionDate || null,
            notes: app.approvals?.district?.remarks || ''
          },
          {
            id: 3,
            key: 'state',
            title: 'State Review',
            reviewer: app.approvals?.state?.adminName || 'State Admin',
            status: app.approvals?.state?.status === 'approved' ? 'Approved' : 
                   app.approvals?.state?.status === 'rejected' ? 'Rejected' : 
                   currentStage === 3 ? 'Under Review' : 'Pending',
            reviewDate: app.approvals?.state?.actionDate || null,
            notes: app.approvals?.state?.remarks || ''
          },
          {
            id: 4,
            key: 'payment',
            title: 'Payment',
            reviewer: 'Super Admin',
            status: app.paymentStatus === 'completed' ? 'Approved' : 
                   currentStage === 4 ? 'Under Review' : 'Pending',
            reviewDate: app.paymentDate || null,
            notes: ''
          }
        ];

        return {
          id: app._id || app.applicationId,
          userId: app.userId?._id || app.userId,
          submittedAt: app.submittedAt || app.createdAt,
          status: displayStatus,
          stage: currentStage,
          stages: stages,
          profile: {
            profile: {
              profile: {
                firstName: app.memberName || 'Unknown',
                email: app.memberEmail || app.userId?.email || 'N/A'
              }
            }
          }
        };
      });

      console.log('✅ Mapped applications:', mappedApplications);
      setApplications(mappedApplications);

    } catch (error) {
      console.error('❌ Error loading applications:', error);
      toast.error('Failed to load applications');
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    try {
      console.log('🔄 Approving application:', id);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/applications/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ remarks: '' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Approval failed');
      }

      const data = await response.json();
      console.log('✅ Application approved:', data);
      toast.success('Application approved successfully');
      
      // Reload applications to get fresh data
      await load();
    } catch (error: any) {
      console.error('❌ Approval error:', error);
      toast.error(error.message || 'Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      console.log('🔄 Rejecting application:', id);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/applications/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ remarks: 'Application rejected' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Rejection failed');
      }

      const data = await response.json();
      console.log('✅ Application rejected:', data);
      toast.success('Application rejected');
      
      // Reload applications to get fresh data
      await load();
    } catch (error: any) {
      console.error('❌ Rejection error:', error);
      toast.error(error.message || 'Rejection failed');
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Responsive */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Approvals</h1>
          <Avatar className="w-10 h-10 ring-2 ring-blue-100">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              {(localStorage.getItem('userName') || 'A').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="w-full max-w-7xl mx-auto space-y-5 md:space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl p-6 rounded-2xl border border-blue-500">
              <h1 className="text-3xl font-bold text-white">Application Approvals</h1>
              <p className="text-blue-100 mt-1">Review and manage member applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300">
                <p className="text-blue-100 text-sm mb-2 font-medium">Total</p>
                <p className="text-4xl font-bold text-white">{stats.total}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300">
                <p className="text-purple-100 text-sm mb-2 font-medium">Pending</p>
                <p className="text-4xl font-bold text-white">{stats.pending}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-6 border border-cyan-500 shadow-xl hover:shadow-2xl transition-all duration-300">
                <p className="text-cyan-100 text-sm mb-2 font-medium">Approved</p>
                <p className="text-4xl font-bold text-white">{stats.approved}</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 border border-indigo-500 shadow-xl hover:shadow-2xl transition-all duration-300">
                <p className="text-indigo-100 text-sm mb-2 font-medium">Rejected</p>
                <p className="text-4xl font-bold text-white">{stats.rejected}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md bg-white border-2 border-gray-200 p-1 rounded-lg">
                <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">Pending</TabsTrigger>
                <TabsTrigger value="approved" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">Approved</TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                {buckets.pending.length === 0 ? (
                  <Card className="shadow-lg border-0">
                    <CardContent className="pt-12 pb-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                          <Clock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No pending approvals</h3>
                        <p className="text-sm text-gray-600">
                          All applications have been reviewed.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {buckets.pending.map(app => (
                      <ApprovalCard
                        key={app.id}
                        member={{
                          id: app.id,
                          name: app.profile?.profile?.profile?.firstName || app.userId,
                          email: app.profile?.profile?.profile?.email || '',
                          role: role,
                          gender: '', sector: '', phone: ''
                        }}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                {buckets.approved.length === 0 ? (
                  <Card className="shadow-lg border-0">
                    <CardContent className="pt-12 pb-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No approved applications</h3>
                        <p className="text-sm text-gray-600">
                          Approved applications will appear here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {buckets.approved.map(app => (
                      <Card key={app.id} className="shadow-lg border-0 border-l-4 border-l-green-500">
                        <CardHeader className="p-5 md:p-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-green-100">
                              <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold">
                                {(app.profile?.profile?.profile?.firstName || app.userId).substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base md:text-lg">{app.profile?.profile?.profile?.firstName || app.userId}</CardTitle>
                              <CardDescription className="text-sm">
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">Approved</Badge>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                {buckets.rejected.length === 0 ? (
                  <Card className="shadow-lg border-0">
                    <CardContent className="pt-12 pb-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-4">
                          <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No rejected applications</h3>
                        <p className="text-sm text-gray-600">
                          Rejected applications will appear here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {buckets.rejected.map(app => (
                      <Card key={app.id} className="shadow-lg border-0 border-l-4 border-l-red-500">
                        <CardHeader className="p-5 md:p-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-red-100">
                              <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold">
                                {(app.profile?.profile?.profile?.firstName || app.userId).substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base md:text-lg">{app.profile?.profile?.profile?.firstName || app.userId}</CardTitle>
                              <CardDescription className="text-sm">
                                <Badge className="bg-red-500 hover:bg-red-600 text-white">Rejected</Badge>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Approvals;
