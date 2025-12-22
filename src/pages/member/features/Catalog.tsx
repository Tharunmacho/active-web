import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ArrowLeft, Package, Search, Filter, Plus, Star, ShoppingCart } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

// Dummy catalog data
const categories = ["All", "Electronics", "Clothing", "Home & Garden", "Sports", "Beauty"];

const products = [
    { id: 1, name: "Wireless Bluetooth Headphones", category: "Electronics", price: 2499, originalPrice: 3999, rating: 4.5, reviews: 128, image: "🎧", stock: 45, type: "B2C" },
    { id: 2, name: "Smart Watch Pro", category: "Electronics", price: 4999, originalPrice: 6999, rating: 4.8, reviews: 256, image: "⌚", stock: 23, type: "B2C" },
    { id: 3, name: "Cotton Premium T-Shirt", category: "Clothing", price: 599, originalPrice: 999, rating: 4.2, reviews: 89, image: "👕", stock: 150, type: "B2C" },
    { id: 4, name: "Running Shoes Elite", category: "Sports", price: 3499, originalPrice: 4999, rating: 4.6, reviews: 312, image: "👟", stock: 67, type: "B2C" },
    { id: 5, name: "Organic Face Cream", category: "Beauty", price: 799, originalPrice: 1299, rating: 4.4, reviews: 78, image: "🧴", stock: 89, type: "B2C" },
    { id: 6, name: "LED Desk Lamp", category: "Home & Garden", price: 1299, originalPrice: 1999, rating: 4.3, reviews: 45, image: "💡", stock: 34, type: "B2C" },
    { id: 7, name: "Bulk Cotton Fabric (100m)", category: "Clothing", price: 15000, originalPrice: 18000, rating: 4.7, reviews: 23, image: "🧵", stock: 12, type: "B2B", minOrder: 5 },
    { id: 8, name: "Industrial LED Lights (50 units)", category: "Electronics", price: 25000, originalPrice: 32000, rating: 4.9, reviews: 15, image: "💡", stock: 8, type: "B2B", minOrder: 2 },
];

const Catalog = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [catalogType, setCatalogType] = useState<"all" | "B2C" | "B2B">("all");
    const navigate = useNavigate();

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = catalogType === "all" || product.type === catalogType;
        return matchesCategory && matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-800">Catalog</h1>
                    <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">SD</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-white">
                    <div className="w-full max-w-6xl mx-auto space-y-6">

                        {/* Back Button & Header */}
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')} className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">B2C & B2B Catalog</h1>
                                <p className="text-gray-500">Browse products, categories, and pricing</p>
                            </div>
                        </div>

                        {/* Catalog Type Tabs */}
                        <div className="flex gap-2">
                            {["all", "B2C", "B2B"].map((type) => (
                                <Button
                                    key={type}
                                    variant={catalogType === type ? "default" : "outline"}
                                    onClick={() => setCatalogType(type as any)}
                                    className={catalogType === type ? "bg-blue-600 text-white" : ""}
                                >
                                    {type === "all" ? "All Products" : type}
                                </Button>
                            ))}
                        </div>

                        {/* Search & Filter */}
                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                        {categories.map((category) => (
                                            <Button
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedCategory(category)}
                                                className={`whitespace-nowrap ${selectedCategory === category ? "bg-blue-600" : ""}`}
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Add Product Button */}
                        <div className="flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="bg-white border shadow-sm rounded-xl hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardContent className="p-4">
                                        <div className="relative">
                                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-5xl mb-3 group-hover:bg-gray-200 transition-colors">
                                                {product.image}
                                            </div>
                                            <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded ${product.type === "B2B" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                                {product.type}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{product.rating}</span>
                                            <span className="text-xs text-gray-400">({product.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-lg font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
                                                <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {product.type === "B2B" && (
                                            <p className="text-xs text-purple-600 mt-1">Min Order: {product.minOrder} units</p>
                                        )}
                                        <p className="text-xs text-green-600 mt-1">{product.stock} in stock</p>
                                        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
