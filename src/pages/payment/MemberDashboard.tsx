import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Calendar,
  Headphones,
  Settings,
  Download,
  FileText,
  Award,
  Loader2,
  Menu,
  Bell,
  ChevronRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { getUserApplication } from '@/services/applicationApi';
import MemberSidebar from '@/pages/member/MemberSidebar';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch both application data and user profile data in parallel
      const [app, profileRes] = await Promise.all([
        getUserApplication(),
        fetch('http://localhost:4000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      let profilePhoto = '';

      // Get profile photo from API response
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success && profileData.data?.profilePhoto) {
          let photo = profileData.data.profilePhoto;

          // If it's a base64 string without data URI prefix, add it
          if (photo && !photo.startsWith('data:') && !photo.startsWith('http')) {
            // Assume it's a PNG base64 string
            photo = `data:image/png;base64,${photo}`;
          }

          profilePhoto = photo;
          // Store in localStorage for other components
          localStorage.setItem('userProfilePhoto', profilePhoto);
        }
      }

      let planType = 'Aspirant Plan';
      if (app.paymentDetails?.planType) {
        planType = app.paymentDetails.planType;
      } else if (app.memberType === 'business') {
        planType = 'Business Membership';
      } else if (app.memberType === 'aspirant') {
        planType = 'Aspirant Plan';
      }

      setUserData({
        name: app.memberName || 'Member',
        company: 'Your Company',
        email: app.memberEmail || 'Loading...',
        memberSince: new Date().getFullYear(),
        planType: planType,
        status: app.paymentStatus === 'completed' ? 'Active' : 'Pending',
        membershipId: `ACTIV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        profilePhoto: profilePhoto
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData({
        name: 'Member',
        company: 'Your Company',
        email: 'member@activ.org',
        memberSince: new Date().getFullYear(),
        planType: 'Aspirant Plan',
        status: 'Active',
        membershipId: 'ACTIV-2024-000000',
        profilePhoto: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => navigate('/member/certificate');

  const handleDownloadTaxExemption = () => {
    const content = `TAX EXEMPTION CERTIFICATE\n================================\n\nMember ID: ${userData?.membershipId}\nMember Name: ${userData?.name}\n\nThis certifies that the member is eligible for\ntax exemption benefits as per ACTIV membership.\n\nIssue Date: ${new Date().toLocaleDateString()}\n================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Exemption_${userData?.membershipId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Stage 2 Features with routes
  const stage2Features = [
    { title: 'B2C & B2B Catalog', description: 'Listing, categories, images, pricing', route: '/member/catalog' },
    { title: 'Shopping Cart & Checkout', description: 'Orders, basic payment flow', route: '/member/cart' },
    { title: 'B2B Inquiry Form', description: 'Inquiry submission, lead inbox', route: '/member/inquiry' },
    { title: 'Business Showcase', description: 'Store info, links, location', route: '/member/showcase' },
    { title: 'Seller Dashboard', description: 'Orders, reviews, updates', route: '/member/seller-dashboard' }
  ];

  // Stage 3 Features with routes
  const stage3Features = [
    { title: 'WhatsApp Catalog Sharing', description: 'Link/QR creation for product list', route: '/member/whatsapp-catalog' },
    { title: 'Inventory Tracking', description: 'Stock level, alerts', route: '/member/inventory' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Loading Dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white px-4 py-3 flex items-center justify-between border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>
          <h1 className="font-bold text-gray-900">Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/member/notifications')}>
            <Bell className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block sticky top-0 z-40 bg-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Member Dashboard</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/member/notifications')}>
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="rounded-2xl p-6 md:p-8 mb-6 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/20 overflow-hidden">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {userData?.name?.charAt(0)?.toUpperCase() || 'V'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Welcome back, {userData?.name}!
                </h2>
                <p className="text-blue-200 text-sm">{userData?.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/20 text-white">
                  {userData?.planType}
                </span>
                <span className="px-3 py-2 rounded-xl text-xs font-bold bg-green-500 text-white">
                  ✓ {userData?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: User, label: 'My Profile', description: 'View & edit profile', path: '/member/profile', color: 'bg-blue-500' },
                { icon: Calendar, label: 'Events', description: 'Workshops & meets', path: '/member/events', color: 'bg-purple-500' },
                { icon: Headphones, label: 'Support', description: 'Get help & FAQs', path: '/member/help', color: 'bg-green-500' },
                { icon: Settings, label: 'Settings', description: 'Account preferences', path: '/member/help', color: 'bg-gray-500' }
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Card key={idx} className="border shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(action.path)}>
                    <CardContent className="p-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stage 2 - Upcoming Features */}
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Upcoming Features</h3>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stage2Features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => navigate(feature.route)}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage 3 - Future Features */}
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Future Features</h3>
                <span className="text-xs text-gray-400">In Planning</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage3Features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-100 transition-all cursor-pointer"
                    onClick={() => navigate(feature.route)}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout - Activity & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">Recent Activity</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-500">View All</Button>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '2 days ago', title: 'Attended Virtual Networking Event', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
                    { time: '5 days ago', title: 'Downloaded Tax Certificate', icon: FileText, color: 'bg-green-100 text-green-600' },
                    { time: '1 week ago', title: 'Updated Profile Information', icon: User, color: 'bg-purple-100 text-purple-600' },
                    { time: '2 weeks ago', title: 'Joined Industry Workshop', icon: Star, color: 'bg-yellow-100 text-yellow-600' }
                  ].map((activity, idx) => {
                    const Icon = activity.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activity.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Official Documents */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-5">Official Documents</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors" onClick={handleDownloadCertificate}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-600">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Membership Certificate</p>
                      <p className="text-xs text-gray-500">Download official certificate</p>
                    </div>
                    <Download className="w-5 h-5 text-blue-500" />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 cursor-pointer hover:bg-green-100 transition-colors" onClick={handleDownloadTaxExemption}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-600">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Tax Exemption</p>
                      <p className="text-xs text-gray-500">Download tax certificate</p>
                    </div>
                    <Download className="w-5 h-5 text-green-500" />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-yellow-50 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => navigate('/member/payment-history')}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-500">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Payment History</p>
                      <p className="text-xs text-gray-500">View all transactions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
