import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Upload, ImagePlus, Building2, MapPin, Phone, FileText, Briefcase } from "lucide-react";
import { toast } from "sonner";
import BusinessSidebar from "./BusinessSidebar";

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

    // Load active company on mount
    useEffect(() => {
        const loadActiveCompany = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                console.log("🔍 Loading active company...");
                const response = await fetch("http://localhost:4000/api/companies/active", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("📥 Active company loaded:", result);
                    
                    if (result.data) {
                        setFormData({
                            businessName: result.data.businessName || "",
                            description: result.data.description || "",
                            businessType: result.data.businessType || "",
                            mobileNumber: result.data.mobileNumber || "",
                            area: result.data.area || "",
                            location: result.data.location || "",
                            logo: null
                        });
                        
                        if (result.data.logo) {
                            setLogoPreview(result.data.logo);
                        }
                    }
                } else {
                    console.log("ℹ️ No active company found, creating new one");
                }
            } catch (error) {
                console.error("❌ Error loading active company:", error);
            }
        };

        loadActiveCompany();
    }, []);

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

    const handleSave = async () => {
        // Validate required fields
        if (!formData.businessName || !formData.businessType || !formData.mobileNumber) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to save business profile");
                navigate("/login");
                return;
            }

            // Prepare data to send
            const companyData = {
                businessName: formData.businessName,
                description: formData.description,
                businessType: formData.businessType,
                mobileNumber: formData.mobileNumber,
                area: formData.area,
                location: formData.location,
                logo: logoPreview || "" // Store base64 string
            };

            console.log("📤 Submitting company profile:", companyData);

            // Save to companies collection (will be set as active if it's the first company)
            const response = await fetch("http://localhost:4000/api/companies", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(companyData)
            });

            console.log("📡 Response status:", response.status);
            const result = await response.json();
            console.log("📥 Response data:", result);

            if (response.ok || result.success) {
                toast.success("Company profile created successfully!");
                navigate("/business/dashboard");
            } else {
                toast.error(result.message || "Failed to save company profile");
            }
        } catch (error) {
            console.error("❌ Error saving company profile:", error);
            toast.error("Failed to save company profile");
        }
    };

    const handleCancel = () => {
        navigate("/business/dashboard");
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="p-2">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Business Profile</h1>
                    <div className="w-10" />
                </div>

                {/* Page content */}
                <div className="flex-1 p-3 md:p-4 overflow-auto bg-white">
                    <div className="w-full space-y-4">
                        {/* Header */}
                        <div>
                            <h1 className="text-2xl font-bold mb-1 text-gray-800">Create Business Profile</h1>
                            <p className="text-gray-600">Set up your business account and showcase your brand</p>
                        </div>

                        {/* Main Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Column - Logo Upload */}
                            <div className="lg:col-span-1">
                                <Card className="rounded-2xl border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                                    <CardHeader className="text-center pb-4">
                                        <CardTitle className="text-lg text-gray-800">Business Logo</CardTitle>
                                        <CardDescription className="text-sm">Upload your brand identity</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center pb-6">
                                        <div
                                            className="w-40 h-40 bg-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer hover:shadow-xl transition-all border-4 border-dashed border-blue-200 hover:border-blue-400"
                                            onClick={() => document.getElementById("logo-upload")?.click()}
                                        >
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <div className="flex flex-col items-center text-blue-400">
                                                    <ImagePlus className="w-12 h-12 mb-2" strokeWidth={1.5} />
                                                    <span className="text-sm font-medium">Upload Logo</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Click to upload<br />Recommended: 400x400px
                                        </p>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoUpload}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Info Card */}
                                <Card className="rounded-2xl border-0 shadow-md mt-4 bg-blue-600 text-white">
                                    <CardContent className="pt-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Professional Profile</p>
                                                    <p className="text-xs opacity-90">Stand out from the crowd</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Business Features</p>
                                                    <p className="text-xs opacity-90">Access premium tools</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="lg:col-span-2">
                                <Card className="rounded-2xl border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-gray-800">Business Information</CardTitle>
                                        <CardDescription>Tell us about your business</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        {/* Business Name */}
                                        <div>
                                            <Label htmlFor="businessName" className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                                <Building2 className="w-4 h-4 text-blue-600" />
                                                Business Name *
                                            </Label>
                                            <Input
                                                id="businessName"
                                                placeholder="Enter your business name"
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                className="border-gray-300 focus:border-blue-500 rounded-xl"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor="description" className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                Business Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe what your business does, your products/services, and what makes you unique..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="border-gray-300 focus:border-blue-500 min-h-[120px] resize-none rounded-xl"
                                                maxLength={500}
                                            />
                                            <div className="text-right text-xs text-gray-500 mt-1">
                                                {formData.description.length}/500 characters
                                            </div>
                                        </div>

                                        {/* Business Type & Mobile Number - Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Business Type */}
                                            <div>
                                                <Label htmlFor="businessType" className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                                    Business Type *
                                                </Label>
                                                <Select
                                                    value={formData.businessType}
                                                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                                                >
                                                    <SelectTrigger className="border-gray-300 rounded-xl">
                                                        <SelectValue placeholder="Select type" />
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
                                                <Label htmlFor="mobileNumber" className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                                    <Phone className="w-4 h-4 text-blue-600" />
                                                    Mobile Number *
                                                </Label>
                                                <Input
                                                    id="mobileNumber"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.mobileNumber}
                                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                                    className="border-gray-300 focus:border-blue-500 rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Area & Location - Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Area */}
                                            <div>
                                                <Label htmlFor="area" className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                    Area
                                                </Label>
                                                <Input
                                                    id="area"
                                                    placeholder="e.g., Downtown, Industrial Zone"
                                                    value={formData.area}
                                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                                    className="border-gray-300 focus:border-blue-500 rounded-xl"
                                                />
                                            </div>

                                            {/* Location */}
                                            <div>
                                                <Label htmlFor="location" className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                    City / Location
                                                </Label>
                                                <Input
                                                    id="location"
                                                    placeholder="e.g., Mumbai, Maharashtra"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="border-gray-300 focus:border-blue-500 rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="flex-1 h-11 text-base font-medium rounded-xl"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                Save Business Profile
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
