import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search as SearchIcon } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Discover = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-purple-50">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 bg-white border-b">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold">Discover</h1>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className="max-w-2xl mx-auto">
                        <p className="text-gray-600 mb-4">Find companies and products</p>

                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search companies, products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 rounded-xl bg-white shadow-sm border-gray-200"
                            />
                        </div>

                        {/* Empty State */}
                        <div className="text-center py-16">
                            <div className="inline-block p-6 bg-white rounded-full shadow-sm mb-4">
                                <SearchIcon className="h-16 w-16 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Search for companies and products</h3>
                            <p className="text-gray-500">Start typing to discover businesses</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
