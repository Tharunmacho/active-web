import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Package, Edit, Trash2, Info } from "lucide-react";
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
        <div className="min-h-screen flex bg-gray-50">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white border-b">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">Products & Services</h1>
                            <p className="text-sm text-gray-500">{products.length} items listed</p>
                        </div>
                    </div>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => navigate("/business/add-product")}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Company Status */}
                        <div className="text-gray-600">No Companies</div>

                        {/* Info Card */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700">
                                    Add products and services to showcase your offerings to potential customers.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Product Cards */}
                        {products.map((product) => (
                            <Card key={product.id} className="bg-white shadow-sm">
                                <CardContent className="p-0">
                                    {/* Product Image */}
                                    <div className="bg-gray-100 h-48 flex items-center justify-center">
                                        <Package className="h-16 w-16 text-blue-400" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                {product.category}
                                            </span>
                                            <span className="text-lg font-bold">₹{product.price}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                onClick={() => navigate(`/business/edit-product/${product.id}`)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
