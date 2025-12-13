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
        <div className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 hidden md:block">Notifications</h1>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={notification.unread ? "border-l-4 border-l-blue-500" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {notification.unread && (
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;