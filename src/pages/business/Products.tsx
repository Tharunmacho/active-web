import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, Trash2, Info, Sparkles, Tag, DollarSign } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";
import { toast } from "sonner";

const Products = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);

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
                    name: "soap box",
                    description: "nice",
                    category: "Other",
                    price: "100",
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

    return (
        <div className="min-h-screen flex" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Glassmorphism Header */}
                <div className="p-6 backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Products & Services</h1>
                            <p className="text-white/80">{products.length} items in your catalog</p>
                        </div>
                        <Button
                            className="rounded-2xl bg-white/90 hover:bg-white text-purple-600 font-semibold px-6 shadow-xl backdrop-blur-md"
                            onClick={() => navigate("/business/add-product")}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Info Card */}
                        <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/20">
                                    <Info className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    Add products and services to showcase your offerings to potential customers.
                                    Each product can have images, descriptions, pricing, and categories.
                                </p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="group">
                                    <div className="h-full rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                        {/* Product Image */}
                                        <div className="h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                                            <Package className="h-20 w-20 text-purple-400/50" strokeWidth={1.5} />
                                            <div className="absolute top-3 right-3">
                                                <div className="px-3 py-1 rounded-full backdrop-blur-md bg-white/90 shadow-lg">
                                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-xl text-gray-800 capitalize">{product.name}</h3>
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    <DollarSign className="h-5 w-5" />
                                                    <span className="text-xl font-bold">₹{product.price}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                                            <div className="flex items-center gap-2 mb-5">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-xl">
                                                    <Tag className="h-3.5 w-3.5 text-purple-600" />
                                                    <span className="text-xs font-semibold text-purple-700">{product.category}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                                                    onClick={() => navigate(`/business/edit-product/${product.id}`)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add New Product Card */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => navigate("/business/add-product")}
                            >
                                <div className="h-full rounded-3xl backdrop-blur-xl bg-white/20 border-2 border-dashed border-white/40 hover:border-white/60 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center min-h-[400px]">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Plus className="h-10 w-10 text-white" strokeWidth={2} />
                                        </div>
                                        <p className="text-white font-semibold text-lg">Add New Product</p>
                                        <p className="text-white/70 text-sm mt-1">Showcase your offerings</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
