import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Filter, Building2, Package } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Discover = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState<any[]>([]);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/companies', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setCompanies(result.data);
            }
        } catch (error) {
            console.error('Error loading companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        return Building2;
    };

    const getCategoryColor = (index: number) => {
        const colors = [
            { text: "text-blue-600", bg: "bg-blue-50" },
            { text: "text-green-600", bg: "bg-green-50" },
            { text: "text-purple-600", bg: "bg-purple-50" },
            { text: "text-orange-600", bg: "bg-orange-50" },
            { text: "text-pink-600", bg: "bg-pink-50" },
        ];
        return colors[index % colors.length];
    };

    const filteredCompanies = companies.filter(company =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.businessCategory && company.businessCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (company.city && company.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const uniqueCategories = new Set(companies.map(c => c.businessCategory).filter(Boolean));

    if (loading) {
        return (
            <div className="min-h-screen flex bg-white items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading businesses...</p>
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
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Discover Businesses</h1>
                        <p className="text-gray-600 text-sm md:text-base">Connect with other businesses in your network</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto space-y-5">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{companies.length}</span>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Total Companies</p>
                            </div>

                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{uniqueCategories.size}</span>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Categories</p>
                            </div>

                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{companies.filter(c => c.isActive).length}</span>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Active</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search companies by name, category, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                            />
                        </div>

                        {/* Company Cards Grid */}
                        {filteredCompanies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                                {filteredCompanies.map((company, index) => {
                                    const Icon = getCategoryIcon(company.businessCategory);
                                    const colors = getCategoryColor(index);
                                    return (
                                        <div key={company._id} className="group">
                                            <div className="h-full rounded-2xl bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                                {/* Company Icon Header */}
                                                <div className={`h-36 relative ${colors.bg} flex items-center justify-center`}>
                                                    <Icon className={`h-16 w-16 ${colors.text}`} strokeWidth={1.5} />
                                                    {company.isActive && (
                                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-green-500 shadow-md">
                                                            <span className="text-xs font-bold text-white">Active</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Company Info */}
                                                <div className="p-6">
                                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{company.companyName}</h3>
                                                    <p className="text-sm text-gray-600 mb-4 min-h-[40px] line-clamp-2">
                                                        {company.businessCategory || 'Business'}
                                                    </p>

                                                    <div className="space-y-3 mb-5">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span>{company.city || 'Location not set'}, {company.state || ''}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className={`px-3 py-1.5 ${colors.bg} rounded-lg text-xs font-semibold ${colors.text}`}>
                                                                {company.businessCategory || 'General'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {company.contactEmail ? 'Verified' : 'Unverified'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Button 
                                                        onClick={() => window.location.href = `/business/companies/${company._id}`}
                                                        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg h-11"
                                                    >
                                                        View Profile
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No companies found</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    {searchQuery ? 'Try adjusting your search' : 'Create your first company to get started'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
