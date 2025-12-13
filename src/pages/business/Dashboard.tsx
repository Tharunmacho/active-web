import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, RefreshCw, Eye, Package, Edit, Trash2 } from "lucide-react";
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
        <div className="min-h-screen flex bg-gray-50">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header - Mobile */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="p-2"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="text-center flex-1">
                        <h1 className="text-xl font-bold">Business Profile</h1>
                        <p className="text-sm text-gray-500">Manage your business presence</p>
                    </div>
                    <Button variant="ghost" size="icon">
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block p-6 bg-white border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Business Profile</h1>
                            <p className="text-gray-500">Manage your business presence</p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Manage My Companies */}
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Package className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Manage My Companies</h2>
                                </div>
                                <span className="text-xl font-bold">{businesses.length}</span>
                            </CardContent>
                        </Card>

                        {/* Business Cards */}
                        {businesses.map((business) => (
                            <Card key={business.id} className="bg-white shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{business.name}</h3>
                                            <p className="text-sm text-gray-600">{business.category}</p>
                                            <p className="text-sm text-gray-600">{business.phone}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                            <RefreshCw className="h-3 w-3" />
                                            {business.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => navigate("/member/business-profile")}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-white shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm">Profile Views</span>
                                    </div>
                                    <div className="text-3xl font-bold">0</div>
                                    <div className="text-xs text-gray-500 mt-1">No change</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Package className="h-4 w-4" />
                                        <span className="text-sm">Products Listed</span>
                                    </div>
                                    <div className="text-3xl font-bold">1</div>
                                    <div className="text-xs text-blue-600 mt-1">1 featured</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="font-medium">{activity.type}</p>
                                                <p className="text-sm text-gray-600">{activity.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
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

export default BusinessDashboard;
