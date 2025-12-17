import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, BarChart3, PieChart, Activity } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stats = [
        { label: "Total Views", value: "1,234", change: "+12.5%", borderColor: "border-l-blue-500" },
        { label: "Profile Visits", value: "456", change: "+8.2%", borderColor: "border-l-purple-500" },
        { label: "Product Views", value: "789", change: "+15.7%", borderColor: "border-l-blue-500" },
        { label: "Engagement Rate", value: "23.4%", change: "+5.3%", borderColor: "border-l-purple-500" },
    ];

    const weeklyData = [
        { day: "Mon", views: 45, visits: 23 },
        { day: "Tue", views: 52, visits: 31 },
        { day: "Wed", views: 38, visits: 19 },
        { day: "Thu", views: 67, visits: 42 },
        { day: "Fri", views: 71, visits: 39 },
        { day: "Sat", views: 55, visits: 28 },
        { day: "Sun", views: 48, visits: 25 },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-5 md:p-6 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Analytics Dashboard</h1>
                            <p className="text-gray-600 text-sm md:text-base">Track your business performance and insights</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 w-fit">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-medium">Last 7 days</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto space-y-5">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {stats.map((stat, index) => (
                                <div key={index} className="group">
                                    <div className={`h-full p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 ${stat.borderColor}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                                            <div className="px-3 py-1 rounded-full bg-green-50">
                                                <span className="text-xs font-bold text-green-700">{stat.change}</span>
                                            </div>
                                        </div>
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                            {/* Weekly Trends */}
                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-blue-600">Weekly Trends</h3>
                                    <p className="text-sm text-gray-500 mt-1">Daily views overview</p>
                                </div>

                                <div className="space-y-3">
                                    {weeklyData.map((data, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="w-10 text-sm font-medium text-gray-600">{data.day}</span>
                                            <div className="flex-1 flex gap-2 items-center">
                                                <div className="flex-1 bg-gray-100 rounded-lg h-8 overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm transition-all"
                                                        style={{ width: `${(data.views / 80) * 100}%` }}>
                                                    </div>
                                                </div>
                                                <span className="w-12 text-sm font-semibold text-blue-600 text-right">{data.views}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-blue-600">Top Categories</h3>
                                    <p className="text-sm text-gray-500 mt-1">Performance by category</p>
                                </div>

                                <div className="space-y-4">
                                    {["Technology", "Retail", "Food & Beverage", "Healthcare"].map((category, index) => (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{category}</span>
                                                <span className="text-sm font-bold text-purple-600">{90 - index * 15}%</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                                                    style={{ width: `${90 - index * 15}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg">
                            <div className="mb-6">
                                <h3 className="text-lg md:text-xl font-bold text-blue-600">Recent Activity</h3>
                                <p className="text-sm text-gray-500 mt-1">Latest updates and events</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { action: "New profile view", time: "2 hours ago", type: "view" },
                                    { action: "Product inquiry received", time: "4 hours ago", type: "inquiry" },
                                    { action: "Profile updated", time: "1 day ago", type: "update" },
                                    { action: "New follower", time: "2 days ago", type: "follower" },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm">{activity.action}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
