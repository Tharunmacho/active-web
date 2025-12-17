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
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Load companies
            const companiesResponse = await fetch("http://localhost:4000/api/companies", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const companiesResult = await companiesResponse.json();
            if (companiesResult.success) {
                setBusinesses(companiesResult.data);
            }

            // Load products
            const productsResponse = await fetch("http://localhost:4000/api/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const productsResult = await productsResponse.json();
            if (productsResult.success) {
                setProducts(productsResult.data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get recent activity from products
    const getRecentActivity = () => {
        return products.slice(0, 5).map(product => ({
            id: product._id,
            type: "Product created",
            name: product.productName,
            time: new Date(product.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            })
        }));
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-5 md:p-6 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Business Dashboard</h1>
                            <p className="text-gray-600 text-sm md:text-base">Manage your business presence</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                                <p className="text-sm text-blue-700 font-semibold">Welcome back</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto space-y-5">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                            {/* Total Companies */}
                            <Card className="border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-white border-l-4 border-l-blue-500">
                                <CardContent className="p-6 md:p-7">
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Active Companies</p>
                                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{businesses.length}</div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">Currently managed</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Profile Views */}
                            <Card className="border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-white border-l-4 border-l-purple-500">
                                <CardContent className="p-6 md:p-7">
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Profile Views</p>
                                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">0</div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">Last 30 days</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Products Listed */}
                            <Card className="border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-white border-l-4 border-l-blue-500">
                                <CardContent className="p-6 md:p-7">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-500">Products Listed</p>
                                            {products.length > 0 && (
                                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200 text-xs text-purple-700 font-medium">
                                                    {products.filter(p => p.status === 'active').length} active
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {loading ? '...' : products.length}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">Total products</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left Column - Business Cards */}
                            <div className="lg:col-span-2 space-y-5">
                                {/* Manage Companies Card */}
                                <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50">
                                    <CardContent className="p-5 md:p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-lg md:text-xl font-bold text-blue-600">My Companies</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-md">
                                                    {businesses.length}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => navigate("/business/companies")}
                                                >
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Business Cards */}
                                        <div className="space-y-4">
                                            {loading ? (
                                                <div className="text-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                </div>
                                            ) : businesses.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 mb-4">No companies yet</p>
                                                    <Button onClick={() => navigate("/business/companies/add")}>
                                                        Add Your First Company
                                                    </Button>
                                                </div>
                                            ) : (
                                                businesses.slice(0, 2).map((business) => (
                                                    <div key={business._id} className="p-4 md:p-5 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow">
                                                        <div className="flex items-start gap-4 mb-4">
                                                            {business.logo && (
                                                                <img src={business.logo} alt={business.businessName} className="w-12 h-12 rounded-lg object-cover" />
                                                            )}
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-base md:text-lg text-gray-800 mb-1">{business.businessName}</h3>
                                                                <p className="text-sm text-gray-600 mb-0.5">{business.businessType}</p>
                                                                <p className="text-sm text-gray-500">{business.mobileNumber}</p>
                                                            </div>
                                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                                                                business.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                business.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-orange-100 text-orange-700'
                                                            }`}>
                                                                {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium text-sm"
                                                                onClick={() => navigate(`/business/companies/${business._id}`)}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium text-sm"
                                                                onClick={() => navigate(`/business/companies/edit/${business._id}`)}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Recent Activity */}
                            <div className="lg:col-span-1">
                                <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50">
                                    <CardContent className="p-5 md:p-6">
                                        <div className="mb-5">
                                            <h3 className="text-lg md:text-xl font-bold text-blue-600">Recent Activity</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                </div>
                                            ) : getRecentActivity().length === 0 ? (
                                                <div className="text-center py-8">
                                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-gray-500 text-sm">No recent activity</p>
                                                </div>
                                            ) : (
                                                getRecentActivity().map((activity) => (
                                                    <div key={activity.id} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-800 text-sm">{activity.type}</p>
                                                            <p className="text-sm text-gray-600">{activity.name}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
                                            <div className="space-y-2">
                                                <Button
                                                    onClick={() => navigate("/business/products")}
                                                    className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg"
                                                >
                                                    View Products
                                                </Button>
                                                <Button
                                                    onClick={() => navigate("/business/analytics")}
                                                    variant="outline"
                                                    className="w-full rounded-lg border-2 border-gray-200 hover:bg-gray-50 font-medium"
                                                >
                                                    View Analytics
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
