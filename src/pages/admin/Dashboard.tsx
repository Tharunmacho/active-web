import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Users, CheckCircle, XCircle,
  Clock
} from "lucide-react";
import { useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileMenu from "@/components/AdminMobileMenu";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const recentApplications = [
    { id: "Actv2024001", name: "John Doe", status: "approved", date: "2024-01-15", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face" },
    { id: "Actv2024002", name: "Jane Smith", status: "pending", date: "2024-01-14", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face" },
    { id: "Actv2024003", name: "Robert Brown", status: "approved", date: "2024-01-13", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face" },
  ];

  const role = (typeof window !== 'undefined' ? localStorage.getItem('role') : '') || '';
  const userName = (typeof window !== 'undefined' ? localStorage.getItem('userName') : '') || 'Admin';

  const roleLabel = useMemo(() => {
    if (role === 'block_admin') return 'Block Admin';
    if (role === 'district_admin') return 'District Admin';
    if (role === 'state_admin') return 'State Admin';
    if (role === 'super_admin') return 'Super Admin';
    return 'Admin';
  }, [role]);

  const dashboardTitle = useMemo(() => {
    if (role === 'block_admin') return 'Block Admin Dashboard';
    if (role === 'district_admin') return 'District Admin Dashboard';
    if (role === 'state_admin') return 'State Admin Dashboard';
    if (role === 'super_admin') return 'Super Admin Dashboard';
    return 'Admin Dashboard';
  }, [role]);

  const dashboardSubtitle = useMemo(() => {
    if (role === 'block_admin') return 'Manage Block Level';
    if (role === 'district_admin') return 'Manage District Level';
    if (role === 'state_admin') return 'Manage State Level';
    if (role === 'super_admin') return 'Manage All Levels';
    return 'Manage your dashboard';
  }, [role]);

  const avatarInitials = useMemo(() => {
    if (role === 'block_admin') return 'BA';
    if (role === 'district_admin') return 'DA';
    if (role === 'state_admin') return 'SA';
    if (role === 'super_admin') return 'SU';
    const parts = (userName || 'A').trim().split(/\s+/);
    return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }, [role, userName]);

  // Stats data - can be fetched from API
  const stats = {
    totalMembers: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar - always visible */}
      <div className="w-16 lg:w-64 border-r bg-white shadow-sm">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="w-full max-w-7xl mx-auto space-y-5 md:space-y-6">
            {/* Header */}
            <div className="bg-white shadow-lg p-5 md:p-6 rounded-xl border-0">
              <div className="flex items-center gap-3 md:gap-4">
                <Avatar className="w-12 h-12 md:w-14 md:h-14 ring-2 ring-blue-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">{dashboardTitle}</h1>
                  <p className="text-sm md:text-base text-gray-600">{dashboardSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              <Card className="shadow-lg border-0 border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow">
                <CardContent className="pt-5 md:pt-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">Total Members</p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalMembers}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 border-l-4 border-l-amber-500 hover:shadow-xl transition-shadow">
                <CardContent className="pt-5 md:pt-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">Pending</p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">{stats.pending}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 border-l-4 border-l-green-500 hover:shadow-xl transition-shadow">
                <CardContent className="pt-5 md:pt-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">Approved</p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.approved}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 border-l-4 border-l-red-500 hover:shadow-xl transition-shadow">
                <CardContent className="pt-5 md:pt-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">Rejected</p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{stats.rejected}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card className="shadow-lg border-0">
              <CardHeader className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl text-blue-600">Recent ADF Approvals</CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1">Latest application submissions</CardDescription>
                  </div>
                  <Link to="/admin/applications">
                    <Button variant="outline" size="sm" className="rounded-lg border-2 hover:bg-blue-50 hover:border-blue-300">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-5 md:p-6 pt-0">
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-blue-100">
                          <AvatarImage src={app.image} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm md:text-base">{app.name}</p>
                          <p className="text-xs md:text-sm text-gray-600">{app.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={app.status === "approved" ? "default" : "outline"}
                          className={app.status === "approved" ? "bg-green-500 hover:bg-green-600 text-white" : "border-amber-500 text-amber-700"}
                        >
                          {app.status === "approved" ? "Approved" : "Pending"}
                        </Badge>
                        <Link to={`/admin/application/${app.id}`}>
                          <Button size="sm" variant="outline" className="rounded-lg border-2 hover:bg-blue-50 hover:border-blue-300">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
