import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, TrendingUp, Users, Filter, Sparkles } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Discover = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const businesses = [
        {
            id: 1,
            name: "Tech Solutions Inc",
            category: "Technology",
            location: "Mumbai, Maharashtra",
            rating: 4.8,
            reviews: 245,
            description: "Leading provider of innovative tech solutions",
        },
        {
            id: 2,
            name: "Green Foods Co",
            category: "Food & Beverage",
            location: "Bangalore, Karnataka",
            rating: 4.6,
            reviews: 189,
            description: "Organic and healthy food products",
        },
        {
            id: 3,
            name: "Fashion Hub",
            category: "Retail",
            location: "Delhi, NCR",
            rating: 4.7,
            reviews: 322,
            description: "Trendy fashion and accessories",
        },
    ];

    return (
        <div className="min-h-screen flex" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Glassmorphism Header */}
                <div className="p-6 backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Discover Businesses</h1>
                        <p className="text-white/80">Connect with other businesses in your network</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Search Bar */}
                        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Search businesses, categories, locations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500"
                                    />
                                </div>
                                <Button className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-xl bg-blue-500/20">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-white">{businesses.length}</span>
                                </div>
                                <p className="text-white/80 text-sm">Total Businesses</p>
                            </div>

                            <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-xl bg-purple-500/20">
                                        <TrendingUp className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-white">12</span>
                                </div>
                                <p className="text-white/80 text-sm">Categories</p>
                            </div>

                            <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-xl bg-pink-500/20">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-white">45</span>
                                </div>
                                <p className="text-white/80 text-sm">Featured</p>
                            </div>
                        </div>

                        {/* Business Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {businesses.map((business) => (
                                <div key={business.id} className="group">
                                    <div className="h-full p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                <Sparkles className="h-7 w-7 text-white" strokeWidth={2} />
                                            </div>
                                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100">
                                                <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                                                <span className="text-sm font-bold text-yellow-700">{business.rating}</span>
                                            </div>
                                        </div>

                                        {/* Business Info */}
                                        <h3 className="font-bold text-xl text-gray-800 mb-2">{business.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{business.description}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 text-purple-600" />
                                                <span>{business.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-purple-100 rounded-xl text-xs font-semibold text-purple-700">
                                                    {business.category}
                                                </span>
                                                <span className="text-xs text-gray-500">{business.reviews} reviews</span>
                                            </div>
                                        </div>

                                        <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg">
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
