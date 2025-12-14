import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Package, Edit, Trash2, TrendingUp, Clock, Sparkles } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [businesses, setBusinesses] = useState<any[]>([]);

    useEffect(() => {
        // Load businesses from localStorage
        const savedProfile = localStorage.getItem("businessProfile");
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setBusinesses([
                {
                    id: 1,
                    name: profile.businessName || "My Business",
                    category: profile.businessType || "Others",
                    phone: profile.mobileNumber || "N/A",
                    status: "Under Review",
                },
            ]);
        }
    }, []);

    const recentActivity = [
        {
            id: 1,
            type: "Product created",
            name: "soap box",
            time: "1 day ago",
        },
    ];

    return (
        <div className="min-h-screen flex bg-white">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Glassmorphism Header */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">Business Dashboard</h1>
                            <p className="text-gray-600">Manage your business presence</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200">
                                <p className="text-sm text-blue-700 font-medium">Welcome back</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Stats Grid - Glassmorphism Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Total Companies */}
                            <div className="group">
                                <div className="h-full p-6 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                                            <Package className="h-6 w-6 text-white" strokeWidth={2} />
                                        </div>
                                        <Sparkles className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-800 mb-1">{businesses.length}</div>
                                    <div className="text-gray-600 text-sm font-medium">Active Companies</div>
                                </div>
                            </div>

                            {/* Profile Views */}
                            <div className="group">
                                <div className="h-full p-6 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                                            <Eye className="h-6 w-6 text-white" strokeWidth={2} />
                                        </div>
                                        <TrendingUp className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-800 mb-1">0</div>
                                    <div className="text-gray-600 text-sm font-medium">Profile Views</div>
                                </div>
                            </div>

                            {/* Products Listed */}
                            <div className="group">
                                <div className="h-full p-6 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg">
                                            <Package className="h-6 w-6 text-white" strokeWidth={2} />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200">
                                            <span className="text-xs text-pink-700 font-medium">1 featured</span>
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-800 mb-1">1</div>
                                    <div className="text-gray-600 text-sm font-medium">Products Listed</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Business Cards */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Manage Companies Card */}
                                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-blue-100">
                                                <Package className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800">My Companies</h2>
                                        </div>
                                        <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg">
                                            {businesses.length}
                                        </span>
                                    </div>

                                    {/* Business Cards */}
                                    <div className="space-y-4">
                                        {businesses.map((business) => (
                                            <div key={business.id} className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-lg transition-all">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <Package className="h-7 w-7 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-800 mb-1">{business.name}</h3>
                                                        <p className="text-sm text-gray-600 mb-0.5">{business.category}</p>
                                                        <p className="text-sm text-gray-500">{business.phone}</p>
                                                    </div>
                                                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                                        {business.status}
                                                    </span>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                                                        onClick={() => navigate("/member/business-profile")}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Recent Activity */}
                            <div className="lg:col-span-1">
                                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-xl bg-purple-100">
                                            <Clock className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 text-sm">{activity.type}</p>
                                                    <p className="text-sm text-gray-600">{activity.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
                                        <div className="space-y-2">
                                            <Button
                                                onClick={() => navigate("/business/products")}
                                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg"
                                            >
                                                View Products
                                            </Button>
                                            <Button
                                                onClick={() => navigate("/business/analytics")}
                                                variant="outline"
                                                className="w-full rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-medium"
                                            >
                                                View Analytics
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
