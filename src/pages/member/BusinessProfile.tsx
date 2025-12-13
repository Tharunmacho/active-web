import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

const BusinessProfile = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        businessName: "",
        description: "",
        businessType: "",
        mobileNumber: "",
        area: "",
        location: "",
        logo: null as File | null,
    });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Validate required fields
        if (!formData.businessName || !formData.businessType || !formData.mobileNumber) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Save to localStorage
        localStorage.setItem("businessProfile", JSON.stringify(formData));
        toast.success("Business profile saved successfully!");
        navigate("/business/dashboard");
    };

    const handleCancel = () => {
        navigate("/member/dashboard");
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white text-gray-900 p-4 flex items-center gap-4 sticky top-0 z-10 border-b shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/member/dashboard")}
                        className="text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-semibold">Business Profile</h1>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-auto p-4 pb-24 md:pb-6">
                    <div className="max-w-2xl mx-auto">
                        {/* Logo Upload Section */}
                        <div className="flex flex-col items-center mb-6">
                            <div
                                className="w-40 h-40 bg-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => document.getElementById("logo-upload")?.click()}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImagePlus className="w-16 h-16 mb-2" />
                                        <span className="text-sm font-medium">Upload Logo</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-3">Tap to upload business logo</p>
                            <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                            />
                        </div>

                        {/* Form Card */}
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6 space-y-5">
                                {/* Business Name */}
                                <div>
                                    <Label htmlFor="businessName" className="text-base font-semibold mb-2 block">
                                        Business Name
                                    </Label>
                                    <Input
                                        id="businessName"
                                        placeholder="Enter business name"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your business..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-gray-50 border-gray-200 min-h-[120px] resize-none"
                                        maxLength={500}
                                    />
                                    <div className="text-right text-xs text-gray-500 mt-1">
                                        {formData.description.length}/500
                                    </div>
                                </div>

                                {/* Business Type */}
                                <div>
                                    <Label htmlFor="businessType" className="text-base font-semibold mb-2 block">
                                        Business Type
                                    </Label>
                                    <Select
                                        value={formData.businessType}
                                        onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                                    >
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue placeholder="Select business type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem value="wholesale">Wholesale</SelectItem>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                            <SelectItem value="service">Service</SelectItem>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="food">Food & Beverage</SelectItem>
                                            <SelectItem value="healthcare">Healthcare</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <Label htmlFor="mobileNumber" className="text-base font-semibold mb-2 block">
                                        Mobile Number
                                    </Label>
                                    <Input
                                        id="mobileNumber"
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={formData.mobileNumber}
                                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>

                                {/* Area */}
                                <div>
                                    <Label htmlFor="area" className="text-base font-semibold mb-2 block">
                                        Area
                                    </Label>
                                    <Input
                                        id="area"
                                        placeholder="Enter area"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <Label htmlFor="location" className="text-base font-semibold mb-2 block">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="Enter location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="flex-1 h-12 text-base font-medium"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                                    >
                                        Save Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
