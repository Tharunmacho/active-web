import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  Headphones, 
  Settings, 
  ShoppingCart,
  Menu,
  Bell,
  Package,
  Store,
  TrendingUp,
  Send,
  Boxes,
  BarChart3,
  MessageSquare,
  FileCheck
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
      const planType = app.paymentDetails?.planType || 
                      (app.memberType === 'business' ? 'Business Membership' : 'Aspirant Plan');
      
      setUserData({
        name: app.memberName || 'Member',
        email: app.memberEmail || 'member@activ.org',
        planType,
        status: app.paymentStatus === 'completed' ? 'Active' : 'Pending'
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData({
        name: 'Member',
        email: 'member@activ.org',
        planType: 'Intermediate Plan',
        status: 'Active'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate('/member/settings')}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-teal-600 text-white">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'M'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            {/* Welcome Card */}
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white">
              <CardContent className="p-8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white/30">
                      <AvatarFallback className="bg-white text-teal-600 text-2xl font-bold">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-3xl font-bold mb-1">Welcome back, {userData?.name || 'Member'}!</h2>
                      <p className="text-teal-100">{userData?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">{userData?.planType}</Badge>
                    <Badge className="bg-green-500 text-white hover:bg-green-600">✓ {userData?.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E-commerce Platform Card */}
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3">
                      <Badge className="bg-red-500 text-white">🎉 NEW FEATURE</Badge>
                      <Badge className="bg-green-500 text-white">STAGE 2 LIVE</Badge>
                    </div>
                    <h3 className="text-3xl font-bold mb-3">E-commerce Platform is Now Live!</h3>
                    <p className="text-blue-100 mb-6">
                      Browse products, manage your store, submit B2B inquiries, and much more. Start shopping today!
                    </p>
                    <div className="flex gap-4">
                      <Button 
                        className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                        onClick={() => navigate('/member/catalog')}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Button>
                      <Button 
                        className="bg-blue-700 text-white hover:bg-blue-800 font-semibold"
                        onClick={() => navigate('/member/seller-dashboard')}
                      >
                        <Store className="w-4 h-4 mr-2" />
                        Seller Dashboard
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:flex gap-6 ml-8">
                    <div className="flex flex-col gap-4">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Package className="w-10 h-10" />
                      </div>
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Store className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10" />
                      </div>
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-10 h-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 2 E-commerce Features */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Stage 2 E-commerce Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200" onClick={() => navigate('/member/product-catalog')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Product Catalog</h4>
                    <p className="text-xs text-blue-600 font-semibold">🎉 NEW</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-pink-200" onClick={() => navigate('/member/shopping-cart')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <ShoppingCart className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Shopping Cart</h4>
                    <p className="text-xs text-pink-600 font-semibold">🛒 LIVE</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200" onClick={() => navigate('/member/b2b-inquiry')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Send className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">B2B Inquiry</h4>
                    <p className="text-xs text-green-600 font-semibold">📧 ACTIVE</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200" onClick={() => navigate('/member/business-showcase')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Store className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Business Showcase</h4>
                    <p className="text-xs text-purple-600 font-semibold">🏪 READY</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-orange-200" onClick={() => navigate('/member/inventory-tracking')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Boxes className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Inventory Tracking</h4>
                    <p className="text-xs text-orange-600 font-semibold">📦 TRACK</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-cyan-200" onClick={() => navigate('/member/checkout')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <FileCheck className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Checkout</h4>
                    <p className="text-xs text-cyan-600 font-semibold">💳 PAY</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-indigo-200" onClick={() => navigate('/member/whatsapp-catalog')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">WhatsApp Catalog</h4>
                    <p className="text-xs text-indigo-600 font-semibold">💬 SHARE</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-teal-200" onClick={() => navigate('/member/seller-dashboard')}>
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Seller Dashboard</h4>
                    <p className="text-xs text-teal-600 font-semibold">📊 STATS</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/member/profile-view')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">My Profile</h4>
                    <p className="text-sm text-gray-500">View & edit profile</p>
                    <p className="text-xs text-blue-600 mt-2 font-semibold">85% Complete</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/member/catalog')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="w-8 h-8 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Shop Now</h4>
                    <p className="text-sm text-gray-500">Browse our catalog</p>
                    <p className="text-xs text-pink-600 mt-2 font-semibold">NEW! ✨</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/member/events')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Events</h4>
                    <p className="text-sm text-gray-500">Upcoming workshops & meets</p>
                    <p className="text-xs text-purple-600 mt-2 font-semibold">3 Upcoming</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/member/help')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Headphones className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Support</h4>
                    <p className="text-sm text-gray-500">Get help & FAQs</p>
                    <p className="text-xs text-green-600 mt-2 font-semibold">24/7 Available</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/member/settings')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Settings className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Settings</h4>
                    <p className="text-sm text-gray-500">Account preferences</p>
                    <p className="text-xs text-gray-600 mt-2 font-semibold">Help & Settings</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
