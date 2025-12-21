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
  Trophy,
  Loader2,
  Menu,
  Bell,
  ChevronRight,
  Star,
  Zap,
  Shield,
  ShoppingCart,
  Store,
  MessageSquare,
  QrCode,
  Package,
  LayoutGrid,
  TrendingUp,
  Clock,
  CheckCircle,
  Layers,
  Building2
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
      const app = await getUserApplication();

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
        membershipId: `ACTIV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
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
        membershipId: 'ACTIV-2024-000000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    navigate('/member/certificate');
  };

  const handleDownloadTaxExemption = () => {
    const content = `
TAX EXEMPTION CERTIFICATE
================================

Member ID: ${userData?.membershipId}
Member Name: ${userData?.name}
Company: ${userData?.company}

This certifies that the member is eligible for
tax exemption benefits as per ACTIV membership.

Issue Date: ${new Date().toLocaleDateString()}
Valid Until: ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}

================================
ACTIV Organization
    `.trim();

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

  // Stage 2 Features
  const stage2Features = [
    {
      icon: LayoutGrid,
      title: 'B2C & B2B Catalog',
      description: 'Listing, categories, images, pricing',
      color: '#0ea5e9'
    },
    {
      icon: ShoppingCart,
      title: 'Shopping Cart & Checkout',
      description: 'Orders, basic payment flow',
      color: '#8b5cf6'
    },
    {
      icon: MessageSquare,
      title: 'B2B Inquiry Form',
      description: 'Inquiry submission, lead inbox',
      color: '#10b981'
    },
    {
      icon: Store,
      title: 'Business Showcase',
      description: 'Store info, links, location',
      color: '#f59e0b'
    },
    {
      icon: Layers,
      title: 'Seller Dashboard',
      description: 'Orders, reviews, updates',
      color: '#ef4444'
    }
  ];

  // Stage 3 Features
  const stage3Features = [
    {
      icon: QrCode,
      title: 'WhatsApp Catalog Sharing',
      description: 'Link/QR creation for product list',
      color: '#22c55e'
    },
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Stock level, alerts',
      color: '#6366f1'
    }
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
              boxShadow: '0 8px 24px -4px rgba(15, 118, 110, 0.4)'
            }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Loading Dashboard</h2>
          <p className="text-gray-500 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
      }}
    >
      {/* Sidebar */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div
          className="md:hidden sticky top-0 z-40 backdrop-blur-md px-4 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>
          <h1 className="font-bold text-gray-900">Dashboard</h1>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div
          className="hidden md:block sticky top-0 z-40 backdrop-blur-md px-6 py-4"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Member Dashboard</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)' }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-6"
            style={{
              background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
              boxShadow: '0 10px 40px -10px rgba(15, 118, 110, 0.5)'
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Welcome back, {userData?.name}!
                </h2>
                <p className="text-teal-200 text-sm">{userData?.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' }}
                >
                  {userData?.planType}
                </span>
                <span
                  className="px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ background: '#10b981', color: '#ffffff' }}
                >
                  ✓ {userData?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions - First after welcome */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: User,
                  label: 'My Profile',
                  description: 'View & edit your profile',
                  path: '/member/profile',
                  gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  stats: '85% Complete'
                },
                {
                  icon: Calendar,
                  label: 'Events',
                  description: 'Upcoming workshops & meets',
                  path: '/member/events',
                  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  stats: '3 Upcoming'
                },
                {
                  icon: Headphones,
                  label: 'Support',
                  description: 'Get help & FAQs',
                  path: '/member/help',
                  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  stats: '24/7 Available'
                },
                {
                  icon: Settings,
                  label: 'Settings',
                  description: 'Account preferences',
                  path: '/member/help',
                  gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  stats: 'Help & Settings'
                }
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={idx}
                    className="border-0 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.08)'
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: action.gradient }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">{action.label}</p>
                      <p className="text-xs text-gray-500 mb-2">{action.description}</p>
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: '#f1f5f9', color: '#475569' }}
                      >
                        {action.stats}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Events Attended', value: '12', icon: Calendar, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Network Connections', value: '156', icon: User, color: '#8b5cf6', bg: '#ede9fe' },
              { label: 'Resources Downloaded', value: '24', icon: Download, color: '#10b981', bg: '#d1fae5' },
              { label: 'Days Active', value: String((new Date().getFullYear() - (userData?.memberSince || 2024)) * 365 || 1), icon: Trophy, color: '#f59e0b', bg: '#fef3c7' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={idx}
                  className="border-0"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <CardContent className="p-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: stat.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Membership Card */}
          <Card
            className="border-0 mb-6 overflow-hidden"
            style={{
              borderRadius: '20px',
              boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                  >
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Membership</p>
                    <p className="font-bold text-gray-900">{userData?.planType}</p>
                  </div>
                </div>
                <Shield className="w-6 h-6 text-gray-300" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: '#f8fafc' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Member Since</p>
                  <p className="text-xl font-bold" style={{ color: '#0f766e' }}>{userData?.memberSince}</p>
                </div>
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: '#f8fafc' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Member ID</p>
                  <p className="text-xs font-bold text-gray-900 truncate">{userData?.membershipId}</p>
                </div>
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: '#f8fafc' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Valid Until</p>
                  <p className="text-xl font-bold" style={{ color: '#10b981' }}>{new Date().getFullYear() + 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage 2 - Coming Soon Features */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#dbeafe', color: '#1e40af' }}
              >
                STAGE 2
              </div>
              <h3 className="font-bold text-gray-900">Upcoming Features</h3>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stage2Features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={idx}
                    className="border-0 opacity-90 hover:opacity-100 transition-all"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${feature.color}15` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: feature.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</p>
                          <p className="text-xs text-gray-500">{feature.description}</p>
                        </div>
                        <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stage 3 - Future Features */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#dcfce7', color: '#166534' }}
              >
                STAGE 3
              </div>
              <h3 className="font-bold text-gray-900">Future Features</h3>
              <span className="text-xs text-gray-400">In Planning</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stage3Features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={idx}
                    className="border-0 opacity-85 hover:opacity-100 transition-all"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${feature.color}15` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: feature.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</p>
                          <p className="text-xs text-gray-500">{feature.description}</p>
                        </div>
                        <div
                          className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                          style={{ background: '#f1f5f9', color: '#64748b' }}
                        >
                          Planned
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Two Column Layout - Activity & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Activity */}
            <Card
              className="border-0"
              style={{
                borderRadius: '20px',
                boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">Recent Activity</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '2 days ago', title: 'Attended Virtual Networking Event', icon: Calendar, color: '#0ea5e9' },
                    { time: '5 days ago', title: 'Downloaded Tax Certificate', icon: FileText, color: '#10b981' },
                    { time: '1 week ago', title: 'Updated Profile Information', icon: User, color: '#8b5cf6' },
                    { time: '2 weeks ago', title: 'Joined Industry Workshop', icon: Star, color: '#f59e0b' }
                  ].map((activity, idx) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ background: `${activity.color}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: activity.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
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
            <Card
              className="border-0"
              style={{
                borderRadius: '20px',
                boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.08)'
              }}
            >
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-5">Official Documents</h3>
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: '#eff6ff' }}
                    onClick={handleDownloadCertificate}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
                    >
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Membership Certificate</p>
                      <p className="text-xs text-gray-500">Download official certificate</p>
                    </div>
                    <Download className="w-5 h-5 text-blue-500" />
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: '#ecfdf5' }}
                    onClick={handleDownloadTaxExemption}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Tax Exemption</p>
                      <p className="text-xs text-gray-500">Download tax certificate</p>
                    </div>
                    <Download className="w-5 h-5 text-emerald-500" />
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: '#fef3c7' }}
                    onClick={() => navigate('/member/payment-history')}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                    >
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Payment History</p>
                      <p className="text-xs text-gray-500">View all transactions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Info */}
          <div
            className="mt-8 p-5 rounded-xl text-center"
            style={{ background: 'rgba(15, 118, 110, 0.05)' }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">ACTIV Platform</span>
            </div>
            <p className="text-xs text-gray-500">
              Stay tuned for more features! We're constantly working to enhance your membership experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
