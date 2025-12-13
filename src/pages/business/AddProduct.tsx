import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Package } from "lucide-react";
import { toast } from "sonner";

const AddProduct = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        image: null as File | null,
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.category || !formData.price) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Load existing products
        const savedProducts = localStorage.getItem("businessProducts");
        const products = savedProducts ? JSON.parse(savedProducts) : [];

        // Add new product
        const newProduct = {
            id: Date.now(),
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: formData.price,
        };

        products.push(newProduct);
        localStorage.setItem("businessProducts", JSON.stringify(products));

        toast.success("Product added successfully!");
        navigate("/business/products");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/business/products")}
                    className="text-white hover:bg-blue-700"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-semibold">Add Product</h1>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-6 space-y-5">
                            {/* Image Upload */}
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                                onClick={() => document.getElementById("product-image")?.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Product" className="max-h-48 rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Package className="h-16 w-16 mb-3" />
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                            <Upload className="h-5 w-5 text-white" />
                                        </div>
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

                            {/* Product Name */}
                            <div>
                                <Label htmlFor="productName" className="text-base font-semibold mb-2 block">
                                    Product Name
                                </Label>
                                <Input
                                    id="productName"
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-gray-50 border-gray-300"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your product..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-gray-50 border-gray-300 min-h-[100px] resize-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label htmlFor="category" className="text-base font-semibold mb-2 block">
                                    Category
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger className="bg-gray-50 border-gray-300">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Fashion">Fashion</SelectItem>
                                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                                        <SelectItem value="Beauty">Beauty</SelectItem>
                                        <SelectItem value="Sports">Sports</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price */}
                            <div>
                                <Label htmlFor="price" className="text-base font-semibold mb-2 block">
                                    Price
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Enter price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-gray-50 border-gray-300"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/business/products")}
                                    className="flex-1 h-12 text-base font-medium"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                                >
                                    Save Product
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
