import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye, Users, TrendingUp, Package, Calendar, BarChart3, PieChart, Activity } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stats = [
        { label: "Total Views", value: "1,234", change: "+12.5%", icon: Eye, color: "from-blue-500 to-blue-600" },
        { label: "Profile Visits", value: "456", change: "+8.2%", icon: Users, color: "from-purple-500 to-purple-600" },
        { label: "Product Views", value: "789", change: "+15.7%", icon: Package, color: "from-pink-500 to-pink-600" },
        { label: "Engagement Rate", value: "23.4%", change: "+5.3%", icon: TrendingUp, color: "from-green-500 to-green-600" },
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
        <div className="min-h-screen flex" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Glassmorphism Header */}
                <div className="p-6 backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Analytics Dashboard</h1>
                            <p className="text-white/80">Track your business performance and insights</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30">
                            <Calendar className="h-4 w-4 text-white" />
                            <span className="text-sm text-white font-medium">Last 7 days</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="group">
                                    <div className="h-full p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                                <stat.icon className="h-6 w-6 text-white" strokeWidth={2} />
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-green-100">
                                                <span className="text-xs font-bold text-green-700">{stat.change}</span>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Weekly Trends */}
                            <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-blue-100">
                                        <BarChart3 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Weekly Trends</h3>
                                </div>

                                <div className="space-y-3">
                                    {weeklyData.map((data, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="w-12 text-sm font-medium text-gray-600">{data.day}</span>
                                            <div className="flex-1 flex gap-2">
                                                <div className="flex-1">
                                                    <div className="h-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                                                        style={{ width: `${(data.views / 80) * 100}%` }}>
                                                    </div>
                                                </div>
                                                <span className="w-12 text-sm font-semibold text-blue-600">{data.views}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-purple-100">
                                        <PieChart className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Top Categories</h3>
                                </div>

                                <div className="space-y-4">
                                    {["Technology", "Retail", "Food & Beverage", "Healthcare"].map((category, index) => (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{category}</span>
                                                <span className="text-sm font-bold text-purple-600">{90 - index * 15}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                                                    style={{ width: `${90 - index * 15}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-green-100">
                                    <Activity className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { action: "New profile view", time: "2 hours ago", type: "view" },
                                    { action: "Product inquiry received", time: "4 hours ago", type: "inquiry" },
                                    { action: "Profile updated", time: "1 day ago", type: "update" },
                                    { action: "New follower", time: "2 days ago", type: "follower" },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
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
