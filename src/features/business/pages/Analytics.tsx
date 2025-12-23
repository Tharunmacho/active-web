import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, BarChart3, PieChart, Activity } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [activeCompany, setActiveCompany] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const [productsRes, activeCompanyRes] = await Promise.all([
                fetch('http://localhost:4000/api/products', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:4000/api/companies/active', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const productsData = await productsRes.json();
            const activeCompanyData = await activeCompanyRes.json();

            if (productsData.success) {
                setProducts(productsData.data);
            }
            if (activeCompanyData.success) {
                setActiveCompany(activeCompanyData.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get category breakdown from real products
    const getCategoryBreakdown = () => {
        const categoryCounts: { [key: string]: number } = {};
        products.forEach(product => {
            const category = product.category || 'Other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        const total = products.length || 1;
        return Object.entries(categoryCounts)
            .map(([category, count]) => ({
                category,
                percentage: Math.round((count / total) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 4);
    };

    // Get recent activity from products
    const getRecentActivity = () => {
        return products
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4)
            .map(product => ({
                action: `New product added: ${product.productName}`,
                time: getTimeAgo(product.createdAt),
                type: 'product'
            }));
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const created = new Date(date);
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    const stats = [
        { 
            label: "Total Products", 
            value: products.length.toString(), 
            change: products.length > 0 ? "Active" : "None", 
            borderColor: "border-l-blue-500" 
        },
        { 
            label: "Active Company", 
            value: activeCompany ? activeCompany.businessName : "None", 
            change: activeCompany ? activeCompany.status.charAt(0).toUpperCase() + activeCompany.status.slice(1) : "None", 
            borderColor: "border-l-purple-500" 
        },
        { 
            label: "Categories", 
            value: new Set(products.map(p => p.category)).size.toString(), 
            change: "Unique", 
            borderColor: "border-l-blue-500" 
        },
        { 
            label: "In Stock", 
            value: products.filter(p => p.status === 'in_stock').length.toString(), 
            change: `${products.length} Total`, 
            borderColor: "border-l-purple-500" 
        },
    ];

    const categoryBreakdown = getCategoryBreakdown();
    const recentActivity = getRecentActivity();

    if (loading) {
        return (
            <div className="min-h-screen flex bg-white items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

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
                            {/* Product Stock Status */}
                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-blue-600">Stock Status</h3>
                                    <p className="text-sm text-gray-500 mt-1">Product availability overview</p>
                                </div>

                                <div className="space-y-3">
                                    {products.length > 0 ? (
                                        products.slice(0, 7).map((product, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <span className="w-24 text-sm font-medium text-gray-600 truncate">{product.productName}</span>
                                                <div className="flex-1 flex gap-2 items-center">
                                                    <div className="flex-1 bg-gray-100 rounded-lg h-8 overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-lg shadow-sm transition-all ${
                                                                product.stockQuantity > 50 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                                                product.stockQuantity > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                                'bg-gradient-to-r from-red-500 to-red-600'
                                                            }`}
                                                            style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }}>
                                                        </div>
                                                    </div>
                                                    <span className="w-12 text-sm font-semibold text-blue-600 text-right">{product.stockQuantity}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No products found</p>
                                    )}
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-blue-600">Top Categories</h3>
                                    <p className="text-sm text-gray-500 mt-1">Product distribution by category</p>
                                </div>

                                <div className="space-y-4">
                                    {categoryBreakdown.length > 0 ? (
                                        categoryBreakdown.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                                    <span className="text-sm font-bold text-purple-600">{item.percentage}%</span>
                                                </div>
                                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                                                        style={{ width: `${item.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No categories found</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg">
                            <div className="mb-6">
                                <h3 className="text-lg md:text-xl font-bold text-blue-600">Recent Activity</h3>
                                <p className="text-sm text-gray-500 mt-1">Latest product additions</p>
                            </div>

                            <div className="space-y-3">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-sm">{activity.action}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No recent activity</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
