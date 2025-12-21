import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, User, Menu } from "lucide-react";
import { useState } from "react";
import MemberSidebar from "./MemberSidebar";

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "event",
      title: "Upcoming Workshop",
      message: "JavaScript Fundamentals workshop is scheduled for tomorrow at 2 PM",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      type: "document",
      title: "Document Approved",
      message: "Your ADF form has been approved by the administrator",
      time: "1 day ago",
      unread: false
    },
    {
      id: 3,
      type: "profile",
      title: "Profile Update",
      message: "Please complete your profile to unlock all features",
      time: "2 days ago",
      unread: false
    },
    {
      id: 4,
      type: "event",
      title: "New Event",
      message: "New networking event added in your area",
      time: "3 days ago",
      unread: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "event": return <Calendar className="h-5 w-5 text-blue-500" />;
      case "document": return <FileText className="h-5 w-5 text-green-500" />;
      case "profile": return <User className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar menu for all screen sizes */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header with menu button - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Notifications</h1>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">NT</AvatarFallback>
          </Avatar>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-1 hidden md:block text-gray-800">Notifications</h1>
              <p className="text-gray-600 text-sm hidden md:block">Stay updated with your latest activities</p>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 md:space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${notification.unread
                      ? notification.type === 'event'
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-600'
                        : notification.type === 'document'
                          ? 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-600'
                          : 'bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-600'
                      : 'bg-gradient-to-br from-white to-gray-50'
                    }`}
                >
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Icon Container */}
                      <div
                        className={`flex-shrink-0 p-2.5 rounded-xl shadow-sm ${notification.type === 'event'
                            ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                            : notification.type === 'document'
                              ? 'bg-gradient-to-br from-green-400 to-green-600'
                              : 'bg-gradient-to-br from-purple-400 to-purple-600'
                          }`}
                      >
                        <div className="text-white">
                          {notification.type === 'event' && <Calendar className="h-5 w-5" />}
                          {notification.type === 'document' && <FileText className="h-5 w-5" />}
                          {notification.type === 'profile' && <User className="h-5 w-5" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-gray-900 text-sm md:text-base">{notification.title}</h3>
                          {notification.unread && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">
                            🕐 {notification.time}
                          </span>
                          {notification.unread && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State (if no notifications) */}
            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications yet</h3>
                <p className="text-gray-500 text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;