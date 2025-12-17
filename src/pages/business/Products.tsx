import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, Trash2, Search, Filter, Grid3x3, List, Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Products = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Load products from localStorage
        const savedProducts = localStorage.getItem("businessProducts");
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            // Default product
            setProducts([
                {
                    id: 1,
                    name: "Premium Soap Box",
                    description: "High-quality handmade soap with natural ingredients",
                    category: "Beauty & Personal Care",
                    price: "100",
                    stock: 50,
                    sku: "SOAP-001",
                    image: "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400&h=300&fit=crop",
                },
            ]);
        }
    }, []);

    const handleDelete = (id: number) => {
        const updatedProducts = products.filter((p) => p.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem("businessProducts", JSON.stringify(updatedProducts));
        toast.success("Product deleted successfully");
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-5 md:p-6 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Products & Services</h1>
                            <p className="text-gray-600 text-sm md:text-base">{products.length} items in your catalog</p>
                        </div>
                        <Button
                            className="h-11 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg"
                            onClick={() => navigate("/business/add-product")}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 md:p-6 bg-white border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-11 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                            />
                        </div>
                        <Button variant="outline" className="h-11 px-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <div className="flex gap-2 border-2 border-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {/* Add New Product Card */}
                                <div
                                    className="group cursor-pointer"
                                    onClick={() => navigate("/business/add-product")}
                                >
                                    <div className="h-full rounded-xl bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-300 flex items-center justify-center min-h-[360px] hover:shadow-lg">
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Plus className="h-8 w-8 text-blue-600" strokeWidth={2} />
                                            </div>
                                            <p className="text-gray-800 font-semibold text-base">Add New Product</p>
                                            <p className="text-gray-500 text-sm mt-1">Showcase your offerings</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Cards */}
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="group">
                                        <div className="h-full rounded-xl bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                            {/* Product Image */}
                                            <div className="h-48 relative overflow-hidden bg-gray-100">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                                        <Package className="h-16 w-16 text-gray-300" strokeWidth={1.5} />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3">
                                                    <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-md">
                                                        <span className="text-xs font-semibold text-blue-600">₹{product.price}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="p-5">
                                                <h3 className="font-bold text-base text-gray-800 line-clamp-1 mb-2">{product.name}</h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Category</span>
                                                        <span className="font-medium text-gray-700 text-xs">{product.category}</span>
                                                    </div>
                                                    {product.stock !== undefined && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">Stock</span>
                                                            <span className={`font-medium text-xs ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                                                {product.stock} units
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium h-9 text-xs"
                                                        onClick={() => navigate(`/business/edit-product/${product.id}`)}
                                                    >
                                                        <Edit className="h-3.5 w-3.5 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium h-9 text-xs"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List View */
                            <div className="space-y-4">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                                <Package className="h-12 w-12 text-purple-400" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-xl text-gray-800 mb-1">{product.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600">{product.category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                                        <span className="font-bold text-blue-600">₹{product.price}</span>
                                                    </div>
                                                    {product.stock !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-600">{product.stock} units</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium h-11 px-6"
                                                    onClick={() => navigate(`/business/edit-product/${product.id}`)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium h-11 px-6"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredProducts.length === 0 && searchQuery && (
                            <div className="text-center py-20">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-xl font-semibold text-gray-600">No products found</p>
                                <p className="text-gray-500 mt-2">Try adjusting your search query</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
