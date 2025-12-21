import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building2, Phone, Briefcase } from "lucide-react";
import { toast } from "sonner";
import BusinessSidebar from "./BusinessSidebar";

const Discover = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery || searchQuery.trim() === '') {
            toast.error("Please enter a product name to search");
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/products/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setCompanies(result.data);
                if (result.data.length === 0) {
                    toast.info("No companies found with matching products");
                }
            } else {
                toast.error(result.message || "Failed to search products");
            }
        } catch (error) {
            console.error('Error searching products:', error);
            toast.error("Failed to search products");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-50">
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-5 md:p-6 bg-white border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Discover</h1>
                        <p className="text-gray-600 text-sm md:text-base">Search for products and find companies</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search for products (e.g., laptop, shoes, furniture)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-12 pr-4 py-6 text-base rounded-xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                                >
                                    {loading ? "Searching..." : "Search"}
                                </Button>
                            </div>
                        </div>

                        {/* Results */}
                        {!hasSearched ? (
                            <div className="flex flex-col items-center justify-center py-20 px-4">
                                <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <Search className="w-16 h-16 text-blue-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center">
                                    Search for Products
                                </h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    Enter a product name to discover companies selling similar products
                                </p>
                            </div>
                        ) : loading ? (
                            <div className="flex flex-col items-center justify-center py-20 px-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Searching for products...</p>
                            </div>
                        ) : companies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-4">
                                <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <Search className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center">
                                    No Results Found
                                </h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    No companies found with products matching "{searchQuery}". Try different keywords.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                        Found {companies.length} {companies.length === 1 ? 'company' : 'companies'} with matching products
                                    </h2>
                                    <p className="text-sm text-gray-600">Search term: "{searchQuery}"</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {companies.map((company, index) => (
                                        <Card key={company.companyId} className="rounded-xl border-0 shadow-md hover:shadow-xl transition-all overflow-hidden">
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    {/* Company Name */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                            <Building2 className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                                                                {company.businessName}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {company.productCount} {company.productCount === 1 ? 'product' : 'products'} available
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Business Type */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Briefcase className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm font-medium">
                                                            {company.businessType || 'Not specified'}
                                                        </span>
                                                    </div>

                                                    {/* Mobile Number */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Phone className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium">
                                                            {company.mobileNumber || 'Not available'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
