import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Users, Mail, Phone, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, useMemo } from "react";
import AdminSidebar from "./AdminSidebar";
import { toast } from "sonner";
import ProfileViewModal from "@/components/ui/profile-view-modal";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch applications data to show all requests (pending, approved, rejected)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
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
        console.log('📦 Applications data received:', data);
        
        // Map applications to member format with status
        const mappedMembers = (data.data || []).map((app: any) => {
          console.log('🔍 App data:', {
            _id: app._id,
            applicationId: app.applicationId,
            memberName: app.memberName,
            blockApprovalStatus: app.approvals?.block?.status
          });
          let statusLabel = 'Pending';
          let statusColor = 'bg-yellow-500';
          
          // Check block admin approval status first
          if (app.approvals?.block?.status === 'approved' || app.status === 'approved') {
            statusLabel = 'Approved';
            statusColor = 'bg-green-500';
          } else if (app.approvals?.block?.status === 'rejected' || app.status === 'rejected') {
            statusLabel = 'Rejected';
            statusColor = 'bg-red-500';
          } else if (app.status === 'pending_block_approval') {
            statusLabel = 'Pending';
            statusColor = 'bg-yellow-500';
          } else if (app.status === 'pending_district_approval' || app.status === 'pending_state_approval') {
            // If moved past block but block approved, show as approved
            statusLabel = 'Approved';
            statusColor = 'bg-green-500';
          }
          
          // Extract userId properly
          let userIdValue = app.userId;
          if (typeof app.userId === 'object' && app.userId !== null) {
            userIdValue = app.userId._id || app.userId.id;
          }
          
          return {
            id: app._id || app.applicationId,
            applicationId: app.applicationId || app._id,
            name: app.memberName || 'Unknown',
            email: app.memberEmail || app.userId?.email || 'N/A',
            phone: app.memberPhone || app.userId?.phone || 'N/A',
            location: `${app.block || 'N/A'}, ${app.district || 'N/A'}, ${app.state || 'N/A'}`,
            status: statusLabel,
            statusColor: statusColor,
            rawStatus: app.status,
            memberType: app.memberType || 'aspirant',
            role: app.memberType === 'business' ? 'Business' : 'Aspirant',
            joinDate: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : 'N/A',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.memberName || 'U')}&background=3b82f6&color=fff`,
            userId: userIdValue
          };
        });

        setMembers(mappedMembers);
      } catch (error) {
        console.error('❌ Error fetching members:', error);
        toast.error('Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Function to fetch and view profile
  const handleViewProfile = async (applicationId: string) => {
    try {
      setProfileLoading(true);
      setProfileModalOpen(true);
      
      console.log('🔍 Fetching application data for:', applicationId);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/profile/application/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️ Application not found');
          setSelectedProfile(null);
          toast.error('Application not found');
          setProfileModalOpen(false);
          return;
        }
        throw new Error('Failed to fetch application');
      }

      const data = await response.json();
      console.log('👤 Application data:', data);
      
      // Transform application data to profile format
      const appData = data.data;
      const profileData = {
        // Basic info from application
        name: appData.application?.memberName,
        email: appData.application?.memberEmail,
        phone: appData.application?.memberPhone,
        state: appData.application?.state,
        district: appData.application?.district,
        block: appData.application?.block,
        city: appData.application?.city,
        
        // Personal form data
        ...appData.personalForm,
        
        // Business form data
        ...appData.businessForm,
        
        // Financial form data
        ...appData.financialForm,
        
        // Declaration form data
        ...appData.declarationForm
      };
      
      setSelectedProfile(profileData);
    } catch (error) {
      console.error('❌ Error fetching application:', error);
      toast.error('Failed to load application data');
      setProfileModalOpen(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
    setSelectedProfile(null);
  };

  // Filter members by status tabs
  const buckets = useMemo(() => {
    const pending: any[] = [];
    const approved: any[] = [];
    const rejected: any[] = [];
    const all: any[] = [...members];

    members.forEach(member => {
      if (member.rawStatus === 'rejected') {
        rejected.push(member);
      } else if (member.rawStatus === 'approved') {
        approved.push(member);
      } else {
        pending.push(member);
      }
    });

    return { all, pending, approved, rejected };
  }, [members]);

  const counts = useMemo(() => ({
    total: members.length,
    pending: buckets.pending.length,
    approved: buckets.approved.length,
    rejected: buckets.rejected.length,
  }), [members.length, buckets.pending.length, buckets.approved.length, buckets.rejected.length]);

  const currentMembers = buckets[tab];
  
  const filteredMembers = currentMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-xl font-bold text-gray-900">Members</h1>
          <Avatar className="w-10 h-10 ring-2 ring-blue-100">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              {(localStorage.getItem('userName') || 'A').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="w-full max-w-6xl mx-auto space-y-6 pt-12 lg:pt-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl p-6 rounded-2xl border border-blue-500">
              <h1 className="text-3xl font-bold text-white">Members</h1>
              <p className="text-blue-100 mt-1">Manage and view all registered members</p>
            </div>

            {/* Search Bar */}
            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search members by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for filtering */}
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                <TabsTrigger value="all" className="flex items-center gap-2 py-3">
                  <Users className="w-4 h-4" />
                  All ({counts.total})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2 py-3">
                  <Clock className="w-4 h-4" />
                  Pending ({counts.pending})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2 py-3">
                  <CheckCircle className="w-4 h-4" />
                  Approved ({counts.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2 py-3">
                  <XCircle className="w-4 h-4" />
                  Rejected ({counts.rejected})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={tab} className="mt-6">
            {/* Members Grid */}
            {loading ? (
              <Card className="shadow-lg border-0">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-pulse">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Loading members...</h3>
                    <p className="text-sm text-gray-600">Please wait</p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredMembers.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No members found</h3>
                    <p className="text-sm text-gray-600">
                      {searchQuery ? "Try adjusting your search" : "There are no members to display yet."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 ring-4 ring-white/30">
                        <AvatarImage src={member.avatar} className="object-cover" />
                        <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{member.name}</h3>
                        <p className="text-blue-100 text-sm capitalize">{member.memberType}</p>
                        <Badge className={`${member.statusColor} hover:opacity-90 mt-2`}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-100">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{member.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100 text-xs">Joined: {member.joinDate}</span>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="bg-white text-blue-600 hover:bg-blue-50"
                          onClick={() => handleViewProfile(member.applicationId)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <ProfileViewModal 
        open={profileModalOpen}
        onClose={handleCloseProfile}
        profile={selectedProfile}
        loading={profileLoading}
      />
    </div>
  );
};

export default Members;