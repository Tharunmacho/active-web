import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { User, Bell, Lock, Save, LogOut } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("account");
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    
    const [accountData, setAccountData] = useState({
        businessName: "",
        email: "",
        phone: "",
        location: ""
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsAlerts: false,
        marketingEmails: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/companies/active', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.success && result.data) {
                setCompanyId(result.data._id || "");
                setCompanyLogo(result.data.logo || "");
                setAccountData({
                    businessName: result.data.businessName || "",
                    email: result.data.email || "",
                    phone: result.data.mobileNumber || "",
                    location: result.data.location || ""
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const handleSaveAccount = async () => {
        if (!companyId) {
            toast.error("No active company found");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                businessName: accountData.businessName,
                email: accountData.email,
                mobileNumber: accountData.phone,
                location: accountData.location
            };

            const response = await fetch(`http://localhost:4000/api/companies/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Account settings saved successfully!");
                // Dispatch custom event to notify sidebar to refresh
                window.dispatchEvent(new CustomEvent('companyDataUpdated'));
                loadSettings(); // Reload data
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error("Failed to save account settings");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        if (!companyId) {
            toast.error("No active company found");
            return;
        }

        setIsUploadingLogo(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:4000/api/companies/${companyId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ logo: base64String })
                });

                if (response.ok) {
                    setCompanyLogo(base64String);
                    toast.success('Logo updated successfully!');
                } else {
                    toast.error('Failed to update logo');
                }
                setIsUploadingLogo(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('Error uploading logo');
            setIsUploadingLogo(false);
        }
    };

    const handleSaveNotifications = () => {
        toast.success("Notification preferences saved!");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
        toast.success("Logged out successfully");
    };

    const tabs = [
        { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
        { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
        { id: "security", label: "Security", icon: <Lock className="h-4 w-4" /> }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage your account preferences</p>
                        </div>
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex gap-2 mb-6 border-b border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600 font-medium"
                                            : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === "account" && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Information</h2>
                                
                                {/* Logo Upload Section */}
                                <div className="mb-8 pb-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Logo</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                                {companyLogo ? (
                                                    <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{accountData.businessName ? accountData.businessName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "BA"}</span>
                                                )}
                                            </div>
                                            {isUploadingLogo && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                                id="logo-upload-features"
                                            />
                                            <label htmlFor="logo-upload-features">
                                                <Button
                                                    type="button"
                                                    onClick={() => document.getElementById('logo-upload-features')?.click()}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    disabled={isUploadingLogo}
                                                >
                                                    {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                                </Button>
                                            </label>
                                            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="businessName">Business Name</Label>
                                        <Input
                                            id="businessName"
                                            value={accountData.businessName}
                                            onChange={(e) => setAccountData({ ...accountData, businessName: e.target.value })}
                                            placeholder="Enter business name"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={accountData.email}
                                            onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                            placeholder="Enter email"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={accountData.phone}
                                            onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                                            placeholder="Enter phone number"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={accountData.location}
                                            onChange={(e) => setAccountData({ ...accountData, location: e.target.value })}
                                            placeholder="Enter location"
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleSaveAccount} 
                                        disabled={loading}
                                        className="w-full sm:w-auto"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === "notifications" && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Email Notifications</p>
                                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                                        </div>
                                        <Switch
                                            checked={notifications.emailNotifications}
                                            onCheckedChange={(checked) => 
                                                setNotifications({ ...notifications, emailNotifications: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Push Notifications</p>
                                            <p className="text-sm text-gray-600">Receive push notifications</p>
                                        </div>
                                        <Switch
                                            checked={notifications.pushNotifications}
                                            onCheckedChange={(checked) => 
                                                setNotifications({ ...notifications, pushNotifications: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">SMS Alerts</p>
                                            <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                                        </div>
                                        <Switch
                                            checked={notifications.smsAlerts}
                                            onCheckedChange={(checked) => 
                                                setNotifications({ ...notifications, smsAlerts: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Marketing Emails</p>
                                            <p className="text-sm text-gray-600">Receive promotional emails</p>
                                        </div>
                                        <Switch
                                            checked={notifications.marketingEmails}
                                            onCheckedChange={(checked) => 
                                                setNotifications({ ...notifications, marketingEmails: checked })
                                            }
                                        />
                                    </div>
                                    <Button onClick={handleSaveNotifications} className="w-full sm:w-auto">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Preferences
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === "security" && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Security</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h3 className="font-medium text-blue-800 mb-2">Change Password</h3>
                                        <p className="text-sm text-blue-600 mb-4">
                                            Update your password to keep your account secure
                                        </p>
                                        <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-100">
                                            <Lock className="h-4 w-4 mr-2" />
                                            Change Password
                                        </Button>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <h3 className="font-medium text-gray-800 mb-2">Active Sessions</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            You are currently logged in on this device
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Last login: {new Date().toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <h3 className="font-medium text-red-800 mb-2">Logout</h3>
                                        <p className="text-sm text-red-600 mb-4">
                                            Sign out from your account
                                        </p>
                                        <Button 
                                            onClick={handleLogout}
                                            variant="outline" 
                                            className="border-red-300 text-red-600 hover:bg-red-100"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
