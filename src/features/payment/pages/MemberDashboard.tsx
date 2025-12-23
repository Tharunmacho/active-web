import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Calendar, 
  Headphones, 
  Settings, 
  Download, 
  Search,
  FileText,
  Award,
  Trophy
} from 'lucide-react';
import { getUserApplication } from '@/services/applicationApi';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const app = await getUserApplication();
      
      // Determine plan type based on memberType and payment details
      let planType = 'Aspirant Plan';
      
      if (app.paymentDetails?.planType) {
        // Use saved payment details if available
        planType = app.paymentDetails.planType;
      } else if (app.memberType === 'business') {
        // Business member - use default business plan
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
    // Generate tax exemption certificate
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-600" />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">Welcome back, {userData?.name}</h1>
            <p className="text-purple-200">{userData?.company}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-12 py-6 rounded-full bg-white/95 text-gray-700 border-0"
          />
        </div>
      </div>

      {/* Membership Card */}
      <div className="px-6 mb-6">
        <Card className="bg-gradient-to-br from-purple-400 to-pink-400 border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-2 bg-white/30 text-white rounded-full font-semibold backdrop-blur-sm">
                {userData?.planType}
              </span>
              <span className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold flex items-center gap-2">
                {userData?.status}
              </span>
              <Trophy className="w-8 h-8 text-yellow-300" />
            </div>

            <div className="text-white">
              <p className="text-lg mb-2">Member since</p>
              <p className="text-4xl font-bold mb-3">{userData?.memberSince}</p>
              <p className="text-purple-100">Email: {userData?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Official Documents */}
      <div className="px-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-3">Official Documents</h2>
        <p className="text-purple-100 mb-4">
          Access and download essential documents related to your account
        </p>

        <div className="space-y-3">
          <Card 
            className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={handleDownloadCertificate}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Download Membership</p>
                  <p className="font-semibold text-gray-900">Certificate</p>
                </div>
              </div>
              <Download className="w-6 h-6 text-blue-600" />
            </CardContent>
          </Card>

          <Card 
            className="bg-green-50 border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
            onClick={handleDownloadTaxExemption}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Download Tax Exemption</p>
                  <p className="font-semibold text-gray-900">Certificate</p>
                </div>
              </div>
              <Download className="w-6 h-6 text-green-600" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-blue-100 border-0 hover:bg-blue-200 transition-colors cursor-pointer"
            onClick={() => navigate('/member/profile')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">Profile</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-blue-100 border-0 hover:bg-blue-200 transition-colors cursor-pointer"
            onClick={() => navigate('/member/events')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">Events</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-blue-100 border-0 hover:bg-blue-200 transition-colors cursor-pointer"
            onClick={() => navigate('/member/support')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">Support</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-blue-100 border-0 hover:bg-blue-200 transition-colors cursor-pointer"
            onClick={() => navigate('/member/settings')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">Settings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button 
            className="flex flex-col items-center gap-1 text-gray-400"
            onClick={() => navigate('/member/explore')}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <span className="text-xs">Explore</span>
          </button>

          <button 
            className="flex flex-col items-center gap-1 text-gray-400"
            onClick={() => navigate('/member/notifications')}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-xs">Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
}
