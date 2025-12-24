import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ArrowLeft, CheckCircle, Info, AlertCircle } from 'lucide-react';
import MemberSidebar from '@/pages/member/MemberSidebar';

export default function Notifications() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Payment Successful',
      message: 'Your membership payment has been processed successfully.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      title: 'Upcoming Event',
      message: 'Don\'t forget about the networking event tomorrow at 3 PM.',
      time: '2 days ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      title: 'Welcome to ACTIV',
      message: 'Thank you for joining ACTIV! Explore your dashboard to get started.',
      time: '1 week ago',
      read: true
    }
  ];

  return (
    <div className="min-h-screen flex bg-white">
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">Stay updated with your latest activities</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Mark all as read
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`border shadow-sm cursor-pointer hover:shadow-md transition-all ${!notification.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notification.bgColor}`}>
                        <Icon className={`w-6 h-6 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State (if no notifications) */}
          {notifications.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-sm text-gray-500">
                You'll see notifications here when there's activity on your account
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}