import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    { id: "Actv2024001", name: "John Doe", status: "approved", date: "2024-01-15" },
    { id: "Actv2024002", name: "Jane Smith", status: "pending", date: "2024-01-14" },
    { id: "Actv2024003", name: "Robert Brown", status: "approved", date: "2024-01-13" },
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
    return parts.map(p => p[0]).join('').slice(0,2).toUpperCase();
  }, [role, userName]);

  // Stats data - can be fetched from API
  const stats = {
    totalMembers: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - always visible */}
      <div className="w-16 lg:w-64 border-r bg-white">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-card shadow-soft p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold">{dashboardTitle}</h1>
                  <p className="text-sm text-muted-foreground">{dashboardSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-3xl font-bold">{stats.totalMembers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                      <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent ADF Approvals</CardTitle>
                    <CardDescription>Latest application submissions</CardDescription>
                  </div>
                  <Link to="/admin/applications">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={app.status === "approved" ? "default" : "outline"} className={app.status === "approved" ? "bg-success" : ""}>
                          {app.status === "approved" ? "Approved" : "Pending"}
                        </Badge>
                        <Link to={`/admin/application/${app.id}`}>
                          <Button size="sm" variant="outline">View</Button>
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

