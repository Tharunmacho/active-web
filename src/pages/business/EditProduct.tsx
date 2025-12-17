import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Package, Tag, DollarSign, FileText, Image as ImageIcon, Save, X } from "lucide-react";
import { toast } from "sonner";
import BusinessSidebar from "./BusinessSidebar";

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        sku: "",
        image: null as File | null,
    });

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                const product = result.data;
                setFormData({
                    name: product.productName,
                    description: product.description || "",
                    category: product.category,
                    price: product.price.toString(),
                    stock: product.stockQuantity.toString(),
                    sku: product.sku || "",
                    image: null
                });
                
                if (product.productImage) {
                    setImagePreview(product.productImage);
                }
            } else {
                toast.error('Failed to load product');
                navigate('/business/products');
            }
        } catch (error) {
            console.error('Error loading product:', error);
            toast.error('Failed to load product');
            navigate('/business/products');
        } finally {
            setLoadingData(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.category || !formData.price) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Validate price
        const priceNum = parseFloat(formData.price);
        if (isNaN(priceNum) || priceNum < 0) {
            toast.error("Please enter a valid price");
            return;
        }

        // Validate stock
        const stockNum = formData.stock ? parseInt(formData.stock) : 0;
        if (isNaN(stockNum) || stockNum < 0) {
            toast.error("Please enter a valid stock quantity");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            console.log('📝 Updating product:', formData);

            const productData = {
                productName: formData.name,
                description: formData.description,
                category: formData.category,
                sku: formData.sku,
                price: priceNum,
                stockQuantity: stockNum,
                productImage: imagePreview || ''
            };

            const response = await fetch(`http://localhost:4000/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            console.log('💾 API Response:', result);

            if (result.success) {
                toast.success('Product updated successfully!');
                navigate('/business/products');
            } else {
                toast.error(result.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error('An error occurred while updating the product');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen flex bg-white items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white">
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/business/products")}
                                className="rounded-xl hover:bg-gray-200"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-1">Edit Product</h1>
                                <p className="text-gray-600">Update product details</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/business/products")}
                                className="h-11 px-6 rounded-xl border-2 border-gray-200 font-medium"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md disabled:opacity-50"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Left Column - Image Upload */}
                            <div className="col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Product Image</h3>
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all bg-gray-50 min-h-[300px]"
                                        onClick={() => document.getElementById("product-image")?.click()}
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full">
                                                <img src={imagePreview} alt="Product" className="w-full rounded-xl" />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-lg shadow-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImagePreview(null);
                                                        setFormData({ ...formData, image: null });
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                                    <ImageIcon className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
                                                </div>
                                                <p className="text-gray-800 font-semibold mb-1">Upload Product Image</p>
                                                <p className="text-sm text-gray-500">Click to browse</p>
                                                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="product-image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <p className="text-xs text-gray-500 mt-3 text-center">
                                        Recommended size: 800x800px
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Product Details */}
                            <div className="col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-xl bg-blue-100">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
                                    </div>

                                    <div className="space-y-5">
                                        {/* Product Name */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                Product Name *
                                            </Label>
                                            <Input
                                                placeholder="Enter product name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                Description
                                            </Label>
                                            <Textarea
                                                placeholder="Enter product description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="min-h-[100px] rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Inventory */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-xl bg-green-100">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Pricing & Inventory</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        {/* Category */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-gray-400" />
                                                Category *
                                            </Label>
                                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                                    <SelectItem value="Clothing">Clothing</SelectItem>
                                                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                                                    <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
                                                    <SelectItem value="Sports & Outdoors">Sports & Outdoors</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* SKU */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-700 mb-2">SKU</Label>
                                            <Input
                                                placeholder="Stock keeping unit"
                                                value={formData.sku}
                                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                Price (₹) *
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Stock */}
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                Stock Quantity
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                            />
                                        </div>
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

export default EditProduct;
