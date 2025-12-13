import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Eye, Package, Search, Users } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const weekData = [
        { day: "Mon", views: 0 },
        { day: "Tue", views: 0 },
        { day: "Wed", views: 0 },
        { day: "Thu", views: 0 },
        { day: "Fri", views: 0 },
        { day: "Sat", views: 0 },
        { day: "Sun", views: 0 },
    ];

    const stats = [
        { label: "Profile Views", value: 0, change: "-9%", icon: Eye, color: "text-blue-600", bgColor: "bg-blue-100" },
        { label: "Product Views", value: 0, change: "-1%", icon: Package, color: "text-blue-600", bgColor: "bg-blue-100" },
        { label: "Search Appearances", value: 0, change: "+7%", icon: Search, color: "text-yellow-600", bgColor: "bg-yellow-100" },
        { label: "Connections", value: 0, change: "+29%", icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-purple-50">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 bg-white border-b">
                    <div className="flex items-center gap-3 mb-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
                    </div>
                    <p className="text-gray-600 text-sm md:ml-12">Track your business performance</p>
                    <p className="text-gray-500 text-sm md:ml-12">No Companies</p>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="bg-white shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                            </div>
                                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Profile Views This Week */}
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-4">Profile Views This Week</h3>
                                <div className="space-y-3">
                                    {weekData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-600 w-12">{item.day}</span>
                                            <div className="flex-1 mx-4 bg-gray-100 rounded-full h-6 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full rounded-full"
                                                    style={{ width: `${(item.views / 10) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-gray-900 font-medium w-8 text-right">{item.views}</span>
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

export default Analytics;
