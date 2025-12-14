import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, CreditCard, Globe, LogOut, Save, Lock, Mail, Phone, MapPin, Check } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("account");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        marketing: false,
        updates: true,
    });

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        toast.success("Logged out successfully");
    };

    const settingsSections = [
        { id: "account", label: "Account", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security & Privacy", icon: Shield },
        { id: "billing", label: "Billing", icon: CreditCard },
        { id: "preferences", label: "Preferences", icon: Globe },
    ];

    return (
        <div className="min-h-screen flex bg-white">
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">Settings</h1>
                            <p className="text-gray-600">Manage your account and application preferences</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Left Sidebar - Navigation */}
                            <div className="col-span-3">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
                                    <div className="p-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</h3>
                                        <nav className="space-y-1">
                                            {settingsSections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => setActiveTab(section.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === section.id
                                                        ? 'bg-blue-50 text-blue-700 font-semibold border-2 border-blue-200'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <section.icon className={`h-5 w-5 ${activeTab === section.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                                    <span className="text-sm">{section.label}</span>
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    <div className="border-t border-gray-200 p-4">
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            className="w-full justify-start rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold h-11"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content Area */}
                            <div className="col-span-9 space-y-6">
                                {/* Account Settings */}
                                {activeTab === "account" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-blue-100">
                                                    <User className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                                                    <p className="text-sm text-gray-600">Update your account details and business information</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        Business Name
                                                    </Label>
                                                    <Input
                                                        placeholder="Enter business name"
                                                        defaultValue="My Business"
                                                        className="h-11 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        Email Address
                                                    </Label>
                                                    <Input
                                                        type="email"
                                                        placeholder="business@example.com"
                                                        defaultValue="business@company.com"
                                                        className="h-11 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        Phone Number
                                                    </Label>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+91 98765 43210"
                                                        defaultValue="+91 98765 43210"
                                                        className="h-11 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        Location
                                                    </Label>
                                                    <Input
                                                        placeholder="City, State"
                                                        defaultValue="Mumbai, Maharashtra"
                                                        className="h-11 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <h3 className="text-lg font-bold text-gray-800 mb-4">Business Description</h3>
                                            <textarea
                                                className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                                                placeholder="Describe your business..."
                                                defaultValue="Leading provider of innovative business solutions..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Notifications */}
                                {activeTab === "notifications" && (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-purple-100">
                                                <Bell className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">Notification Preferences</h2>
                                                <p className="text-sm text-gray-600">Choose how you want to be notified</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { key: "email", label: "Email Notifications", description: "Receive important updates and newsletters via email", icon: Mail },
                                                { key: "push", label: "Push Notifications", description: "Get instant alerts on your device for real-time updates", icon: Bell },
                                                { key: "sms", label: "SMS Notifications", description: "Receive critical alerts via text message", icon: Phone },
                                                { key: "marketing", label: "Marketing Communications", description: "Stay informed about new features and promotions", icon: Check },
                                                { key: "updates", label: "Product Updates", description: "Get notified when we add new features", icon: Check },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-5 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 rounded-lg bg-white">
                                                            <item.icon className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{item.label}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={notifications[item.key as keyof typeof notifications]}
                                                        onCheckedChange={(checked) =>
                                                            setNotifications({ ...notifications, [item.key]: checked })
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Security & Privacy */}
                                {activeTab === "security" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-green-100">
                                                    <Shield className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
                                                    <p className="text-sm text-gray-600">Protect your account and data</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <Button
                                                    variant="outline"
                                                    className="h-20 justify-start rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-green-300"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 rounded-xl bg-green-100">
                                                            <Lock className="h-6 w-6 text-green-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-semibold text-gray-800">Change Password</p>
                                                            <p className="text-xs text-gray-500">Update your account password</p>
                                                        </div>
                                                    </div>
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    className="h-20 justify-start rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-blue-300"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 rounded-xl bg-blue-100">
                                                            <Shield className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-semibold text-gray-800">Two-Factor Auth</p>
                                                            <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                                        </div>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Billing */}
                                {activeTab === "billing" && (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-blue-100">
                                                <CreditCard className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">Billing & Payment</h2>
                                                <p className="text-sm text-gray-600">Manage your subscription and payment methods</p>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-600">Current Plan</p>
                                                    <h3 className="text-2xl font-bold text-gray-800 mt-1">Free Plan</h3>
                                                    <p className="text-sm text-gray-600 mt-1">All basic features included</p>
                                                </div>
                                                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                                                    Upgrade Plan
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Preferences */}
                                {activeTab === "preferences" && (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-purple-100">
                                                <Globe className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">Application Preferences</h2>
                                                <p className="text-sm text-gray-600">Customize your experience</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Language</Label>
                                                <select className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none">
                                                    <option>English (US)</option>
                                                    <option>Hindi</option>
                                                    <option>Tamil</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Timezone</Label>
                                                <select className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none">
                                                    <option>IST (GMT+5:30)</option>
                                                    <option>UTC</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
