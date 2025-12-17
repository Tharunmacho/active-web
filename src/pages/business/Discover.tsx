import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Filter, Monitor, UtensilsCrossed, ShoppingBag } from "lucide-react";
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
            icon: Monitor,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50",
        },
        {
            id: 2,
            name: "Green Foods Co",
            category: "Food & Beverage",
            location: "Bangalore, Karnataka",
            rating: 4.6,
            reviews: 189,
            description: "Organic and healthy food products",
            icon: UtensilsCrossed,
            iconColor: "text-green-600",
            iconBg: "bg-green-50",
        },
        {
            id: 3,
            name: "Fashion Hub",
            category: "Retail",
            location: "Delhi, NCR",
            rating: 4.7,
            reviews: 322,
            description: "Trendy fashion and accessories",
            icon: ShoppingBag,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50",
        },
    ];

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
                                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{businesses.length}</span>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Total Businesses</p>
                            </div>

                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">12</span>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Categories</p>
                            </div>

                            <div className="p-5 md:p-6 rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">45</span>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Featured</p>
                            </div>
                        </div>

                        {/* Business Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {businesses.map((business) => {
                                const Icon = business.icon;
                                return (
                                    <div key={business.id} className="group">
                                        <div className="h-full rounded-2xl bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                            {/* Business Icon Header */}
                                            <div className={`h-36 relative ${business.iconBg} flex items-center justify-center`}>
                                                <Icon className={`h-16 w-16 ${business.iconColor}`} strokeWidth={1.5} />
                                                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white shadow-md">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-bold text-gray-800">{business.rating}</span>
                                                </div>
                                            </div>

                                            {/* Business Info */}
                                            <div className="p-6">
                                                <h3 className="font-bold text-xl text-gray-900 mb-2">{business.name}</h3>
                                                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">{business.description}</p>

                                                <div className="space-y-3 mb-5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span>{business.location}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`px-3 py-1.5 ${business.iconBg} rounded-lg text-xs font-semibold ${business.iconColor}`}>
                                                            {business.category}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{business.reviews} reviews</span>
                                                    </div>
                                                </div>

                                                <Button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg h-11">
                                                    View Profile
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
