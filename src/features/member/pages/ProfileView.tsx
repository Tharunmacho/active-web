import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Upload, User, Briefcase, FileText, Building2, Edit, Camera } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

const ProfileView = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<string>("");
    const [personalData, setPersonalData] = useState<any>(null);
    const [businessData, setBusinessData] = useState<any>(null);
    const [financialData, setFinancialData] = useState<any>(null);
    const [declarationData, setDeclarationData] = useState<any>(null);

    useEffect(() => {
        loadProfileData();

        // Listen for profile updates from settings
        const handleProfileUpdate = () => {
            loadProfileData();
        };

        window.addEventListener('profileDataUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profileDataUpdated', handleProfileUpdate);
        };
    }, []);

    const loadProfileData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            setLoading(true);

            // Load Personal Form
            const personalRes = await fetch("http://localhost:4000/api/personal-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (personalRes.ok) {
                const result = await personalRes.json();
                if (result.data) {
                    setPersonalData(result.data);
                    if (result.data.profileImage) {
                        setProfileImage(result.data.profileImage);
                    }
                }
            }

            // Load Business Form
            const businessRes = await fetch("http://localhost:4000/api/business-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (businessRes.ok) {
                const result = await businessRes.json();
                if (result.data) setBusinessData(result.data);
            }

            // Load Financial Form
            const financialRes = await fetch("http://localhost:4000/api/financial-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (financialRes.ok) {
                const result = await financialRes.json();
                if (result.data) setFinancialData(result.data);
            }

            // Load Declaration Form
            const declarationRes = await fetch("http://localhost:4000/api/declaration-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (declarationRes.ok) {
                const result = await declarationRes.json();
                if (result.data) setDeclarationData(result.data);
            }

        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setProfileImage(base64String);

            // Save to backend
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:4000/api/personal-form", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ profileImage: base64String })
                });

                if (response.ok) {
                    toast.success("Profile image updated successfully");
                } else {
                    toast.error("Failed to update profile image");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image");
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                                <p className="text-sm text-gray-600 mt-1">View and manage your profile information</p>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/member/settings')} variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* Profile Header Card */}
                        <Card className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-16 w-16 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg">
                                        <Camera className="h-4 w-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-gray-800">{personalData?.name || "User"}</h2>
                                    <p className="text-gray-600 mt-1">{personalData?.email || ""}</p>
                                    <p className="text-gray-600">{personalData?.phoneNumber || ""}</p>
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                        {personalData?.district && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                {personalData.district}
                                            </span>
                                        )}
                                        {personalData?.state && (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                {personalData.state}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Personal Information */}
                        {personalData && (
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Full Name" value={personalData.name} />
                                    <InfoItem label="Email" value={personalData.email} />
                                    <InfoItem label="Phone Number" value={personalData.phoneNumber} />
                                    <InfoItem label="State" value={personalData.state} />
                                    <InfoItem label="District" value={personalData.district} />
                                    <InfoItem label="Block" value={personalData.block} />
                                    <InfoItem label="City" value={personalData.city} />
                                    <InfoItem label="Religion" value={personalData.religion} />
                                    <InfoItem label="Social Category" value={personalData.socialCategory} />
                                </div>
                            </Card>
                        )}

                        {/* Business Information */}
                        {businessData && (
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-xl font-bold text-gray-800">Business Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Doing Business" value={businessData.doingBusiness} />
                                    <InfoItem label="Organization Name" value={businessData.organization} />
                                    <InfoItem label="Constitution" value={businessData.constitution} />
                                    <InfoItem label="Business Year" value={businessData.businessYear} />
                                    <InfoItem label="Number of Employees" value={businessData.employees} />
                                    <InfoItem label="Chamber Membership" value={businessData.chamber} />
                                    {businessData.businessTypes && businessData.businessTypes.length > 0 && (
                                        <div className="md:col-span-2">
                                            <p className="text-sm font-medium text-gray-600 mb-2">Business Types:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {businessData.businessTypes.map((type: string, index: number) => (
                                                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Financial Information */}
                        {financialData && (
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="h-5 w-5 text-green-600" />
                                    <h3 className="text-xl font-bold text-gray-800">Financial & Compliance</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="PAN Number" value={financialData.pan} />
                                    <InfoItem label="GST Number" value={financialData.gst} />
                                    <InfoItem label="Udyam Number" value={financialData.udyam} />
                                    <InfoItem label="Filed ITR" value={financialData.filedITR} />
                                    <InfoItem label="ITR Years" value={financialData.itrYears} />
                                    <InfoItem label="Turnover Range" value={financialData.turnoverRange} />
                                    <InfoItem label="Turnover Year 1" value={financialData.turnover1} />
                                    <InfoItem label="Turnover Year 2" value={financialData.turnover2} />
                                    <InfoItem label="Turnover Year 3" value={financialData.turnover3} />
                                    <InfoItem label="Government Schemes" value={financialData.govtSchemes} />
                                </div>
                            </Card>
                        )}

                        {/* Declaration Information */}
                        {declarationData && (
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 className="h-5 w-5 text-orange-600" />
                                    <h3 className="text-xl font-bold text-gray-800">Declaration & Additional Info</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <InfoItem label="Sister Concerns" value={declarationData.sisterConcerns} />
                                    {declarationData.companyNames && (
                                        <InfoItem label="Company Names" value={declarationData.companyNames} />
                                    )}
                                    <InfoItem 
                                        label="Declaration Status" 
                                        value={declarationData.declarationAccepted ? "Accepted" : "Pending"} 
                                    />
                                </div>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }: { label: string; value?: string | number }) => {
    if (!value) return null;
    
    return (
        <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-gray-800">{value}</p>
        </div>
    );
};

export default ProfileView;
